import express from "express";
import { Career } from "../models/Career.js";
import { requireAuth } from "../middleware/auth.js";

const router = express.Router();

// GET /api/careers?page=1&limit=10
router.get("/", requireAuth, async (req, res, next) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const skip = (page - 1) * limit;

    const [items, total] = await Promise.all([
      Career.find().sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
      Career.countDocuments()
    ]);

    res.json({
      items,
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit) || 1
    });
  } catch (e) {
    next(e);
  }
});

// GET /api/careers/search/:query
router.get("/search/:query", requireAuth, async (req, res, next) => {
  try {
    const q = req.params.query;
    const re = new RegExp(q, "i");
    const items = await Career.find({
      $or: [{ title: re }, { description: re }, { category: re }]
    })
      .sort({ title: 1 })
      .lean();
    res.json(items);
  } catch (e) {
    next(e);
  }
});

// POST /api/careers (create)
router.post("/", requireAuth, async (req, res, next) => {
  try {
    const { title, description, imageUrl, category, skills, educationPaths, slug } = req.body || {};
    if (!title) return res.status(400).json({ message: "title is required" });

    const created = await Career.create({
      title,
      description,
      imageUrl,
      category,
      skills: Array.isArray(skills) ? skills : undefined,
      educationPaths: Array.isArray(educationPaths) ? educationPaths : undefined,
      slug
    });

    res.status(201).json(created);
  } catch (e) {
    next(e);
  }
});

// GET /api/careers/:id
router.get("/:id", requireAuth, async (req, res, next) => {
  try {
    const career = await Career.findById(req.params.id).lean();
    if (!career) return res.status(404).json({ message: "Career not found" });
    res.json(career);
  } catch (e) {
    next(e);
  }
});

export default router;

