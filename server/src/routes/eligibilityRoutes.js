import express from "express";
import { requireAuth } from "../middleware/auth.js";
import { University } from "../models/University.js";
import { DegreeProgram } from "../models/DegreeProgram.js";
import { ZScoreTable } from "../models/ZScoreTable.js";

const router = express.Router();

// POST /api/eligibility/universities (create)
router.post("/universities", requireAuth, async (req, res, next) => {
  try {
    const { name, code, country, city } = req.body || {};
    if (!name || !code) return res.status(400).json({ message: "name and code are required" });
    const created = await University.create({ name, code, country, city });
    res.status(201).json(created);
  } catch (e) {
    next(e);
  }
});

// POST /api/eligibility/degree-programs (create)
router.post("/degree-programs", requireAuth, async (req, res, next) => {
  try {
    const { name, code, faculty, universityCode } = req.body || {};
    if (!name || !code) return res.status(400).json({ message: "name and code are required" });

    let university = null;
    if (universityCode) {
      university = await University.findOne({ code: universityCode }).lean();
      if (!university) return res.status(404).json({ message: "University not found for universityCode" });
    }

    const created = await DegreeProgram.create({
      name,
      code,
      faculty,
      university: university ? university._id : undefined
    });
    res.status(201).json(created);
  } catch (e) {
    next(e);
  }
});

// POST /api/eligibility/z-scores (create)
router.post("/z-scores", requireAuth, async (req, res, next) => {
  try {
    const { year, stream, district, degreeProgramCode, minZScore } = req.body || {};
    if (!year || !stream || !district || !degreeProgramCode || typeof minZScore !== "number") {
      return res.status(400).json({
        message: "year, stream, district, degreeProgramCode, minZScore(number) are required"
      });
    }

    const program = await DegreeProgram.findOne({ code: degreeProgramCode }).lean();
    if (!program) return res.status(404).json({ message: "Degree program not found for degreeProgramCode" });

    const created = await ZScoreTable.create({
      year,
      stream,
      district,
      degreeProgram: program._id,
      minZScore
    });
    res.status(201).json(created);
  } catch (e) {
    next(e);
  }
});

// POST /api/eligibility/check
// body: { year, stream, district, zScore }
router.post("/check", requireAuth, async (req, res, next) => {
  try {
    const { year, stream, district, zScore } = req.body || {};
    if (!year || !stream || !district || typeof zScore !== "number") {
      return res.status(400).json({ message: "year, stream, district, zScore(number) are required" });
    }

    const rows = await ZScoreTable.find({
      year,
      stream,
      district,
      minZScore: { $lte: zScore }
    })
      .populate("degreeProgram")
      .lean();

    // Sort best matches first (highest cutoff first)
    rows.sort((a, b) => (b.minZScore || 0) - (a.minZScore || 0));

    const programs = rows
      .filter((r) => r.degreeProgram)
      .map((r) => ({
        year: r.year,
        stream: r.stream,
        district: r.district,
        minZScore: r.minZScore,
        degreeProgram: {
          id: r.degreeProgram._id,
          name: r.degreeProgram.name,
          code: r.degreeProgram.code,
          faculty: r.degreeProgram.faculty,
          university: r.degreeProgram.university
        }
      }));

    res.json({ count: programs.length, programs });
  } catch (e) {
    next(e);
  }
});

export default router;

