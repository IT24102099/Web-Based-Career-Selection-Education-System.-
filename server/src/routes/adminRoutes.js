import express from "express";
import bcrypt from "bcryptjs";
import { Admin } from "../models/Admin.js";
import { signToken } from "../utils/jwt.js";
import { requireAdmin } from "../middleware/auth.js";

const router = express.Router();

// POST /api/admin/login
router.post("/login", async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: "email and password are required" });
    }

    const normalizedEmail = email.toLowerCase().trim();
    const admin = await Admin.findOne({ email: normalizedEmail });
    if (!admin || !admin.passwordHash) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const ok = await bcrypt.compare(password, admin.passwordHash);
    if (!ok) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = signToken(admin);
    return res.json({
      token,
      admin: {
        id: admin._id,
        name: admin.name,
        email: admin.email,
        role: admin.role
      }
    });
  } catch (e) {
    next(e);
  }
});

// Example protected route to verify middleware
router.get("/me", requireAdmin, async (req, res, next) => {
  try {
    const admin = await Admin.findOne({ email: req.user.email }).lean();
    if (!admin) return res.status(404).json({ message: "Admin not found" });
    res.json({
      id: admin._id,
      name: admin.name,
      email: admin.email,
      role: admin.role
    });
  } catch (e) {
    next(e);
  }
});

export default router;

