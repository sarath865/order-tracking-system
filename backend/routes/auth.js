const express = require("express");
const router = express.Router();
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const authMiddleware = require("../middleware/authMiddleware");

const SECRET = "secret";

// ================= REGISTER =================
router.post("/register", async (req, res) => {
    try {
        const { email, password, role } = req.body;

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ error: "User already exists" });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create new user
        const user = new User({
            email,
            password: hashedPassword,
            role
        });

        await user.save();

        res.json({ message: "User registered successfully" });

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});


// ================= LOGIN =================
router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;

        // Find user
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ error: "User not found" });
        }

        // Compare password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ error: "Invalid password" });
        }

        // Generate token
        const token = jwt.sign(
            { id: user._id, role: user.role },
            SECRET,
            { expiresIn: "1d" }
        );

        res.json({
            token,
            role: user.role
        });

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});


// ================= GET CURRENT USER =================
router.get("/me", authMiddleware, (req, res) => {
    res.json({
        message: "User data fetched successfully",
        user: req.user
    });
});

module.exports = router;


