import express from 'express';
import Admin from "../models/Admin.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const router = express.Router();

// POST /api/admin/login
router.post("/login", async (req, res) => {
    const { email, password } = req.body;
    try {
        const admin = await Admin.findOne({ email });
        if (!admin) {
            return res.status(401).json({ message: "Invalid credentials"})
        }

        //compare password
        const valid = await bcrypt.compare(password, admin.password);
        if (!valid) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        // Create JWT token
        const token = jwt.sign(
            { id: admin._id, email: admin.email },
            process.env.JWT_SECRET,
            { expiresIn: "1d"}
        );
        res.json({ token })
    } catch (error) {
        console.error("Login error", error);
        res.status(500).json({ message: "Server error "});
    }
});

export default router;