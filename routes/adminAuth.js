import express from 'express';
import Admin from "../models/Admin.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { auth } from "../middleware/auth.js";

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
        // Set token in HTTP-only cookie
        res.cookie("adminToken", token, {
            httpOnly: true,
            secure: true, // set to true if using HTTPS
            sameSite: "none", // MUST be None when frontend and backend are on different domains.         
            maxAge: 24 * 60 * 60 * 1000, // 1 day
        });
        //Send success JSON
        return res.json({ ok: true })
        
    } catch (error) {
        console.error("Login error", error);
        res.status(500).json({ message: "Server error "});
    }
});

// Get /api/admin/verify
router.get("/verify", auth, (req, res) => {
    // If the auth middleware passses, the token is valid
    res.json({ok: true});
});

router.post("/logout", (req, res) => {
    res.clearCookie("adminToken", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "None"
    });
    res.json({ message: "Logged out" });
});

export default router;