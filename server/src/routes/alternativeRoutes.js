import express from "express";
import { AlternativePath } from "../models/AlternativePath.js";
import { requireAuth } from "../middleware/auth.js";

const router = express.Router();

// GET /api/alternatives
router.get("/", requireAuth, async (req, res, next) => {
  try {
    const items = await AlternativePath.find().sort({ createdAt: -1 }).lean();
    res.json(items);
  } catch (e) {
    next(e);
  }
});

// GET /api/alternatives/type/:type
router.get("/type/:type", requireAuth, async (req, res, next) => {
  try {
    const type = req.params.type;
    const items = await AlternativePath.find({ type }).sort({ createdAt: -1 }).lean();
    res.json(items);
  } catch (e) {
    next(e);
  }
});

// POST /api/alternatives (create)
router.post("/", requireAuth, async (req, res, next) => {
  try {
    const { title, type, description, duration, provider, link } = req.body || {};
    if (!title || !type) return res.status(400).json({ message: "title and type are required" });

    const created = await AlternativePath.create({
      title,
      type,
      description,
      duration,
      provider,
      link
    });

    res.status(201).json(created);
  } catch (e) {
    next(e);
  }
});

// GET /api/alternatives/:id
router.get("/:id", requireAuth, async (req, res, next) => {
  try {
    const path = await AlternativePath.findById(req.params.id).lean();
    if (!path) return res.status(404).json({ message: "Alternative path not found" });
    res.json(path);
  } catch (e) {
    next(e);
  }
});

export default router;

