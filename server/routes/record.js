import express from "express";
import db from "../connect.js";
import bcrypt from "bcrypt";
import { ObjectId } from "mongodb";

const router = express.Router();

// ==========================================
// MEAL HISTORY ENDPOINTS
// ==========================================

/**
 * POST /history
 * Save a meal entry to the user's history
 */
router.post("/history", async (req, res) => {
    try {
        const collection = db.collection("History");
        const entry = req.body;

        // Validate required fields
        if (!entry || !entry.email || !entry.name) {
            return res.status(400).json({ message: "Invalid history entry" });
        }

        // Insert and retrieve the saved entry
        const result = await collection.insertOne(entry);
        const inserted = await collection.findOne({ _id: result.insertedId });

        return res.status(201).json(inserted);
    } catch (err) {
        console.error("History save error:", err);
        return res.status(500).json({ message: "Server error" });
    }
});

/**
 * GET /history
 * Fetch meal history for a user (optional: filter by email)
 */
router.get("/history", async (req, res) => {
    try {
        const collection = db.collection("History");
        const email = req.query.email;

        const query = email ? { email: String(email) } : {};
        const docs = await collection
            .find(query)
            .sort({ timestamp: -1 })
            .toArray();

        return res.status(200).json(docs);
    } catch (err) {
        console.error("History fetch error:", err);
        return res.status(500).json({ message: "Server error" });
    }
});

/**
 * GET /history/weekly
 * Aggregate daily calorie totals for the last 7 days
 */
router.get("/history/weekly", async (req, res) => {
    try {
        const collection = db.collection("History");
        const email = req.query.email;

        if (!email) {
            return res.status(400).json({ message: "Email is required" });
        }

        // Calculate date 7 days ago
        const sevenDaysAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;

        // Fetch entries from the last 7 days
        const entries = await collection
            .find({
                email: String(email),
                timestamp: { $gte: sevenDaysAgo },
            })
            .toArray();

        // Group calories by day (midnight to midnight)
        const dailyStats = {};
        entries.forEach((entry) => {
            const date = new Date(entry.timestamp);
            date.setHours(0, 0, 0, 0);
            const dateKey = date.toISOString().split("T")[0]; // YYYY-MM-DD
            dailyStats[dateKey] = (dailyStats[dateKey] || 0) + (entry.calories || 0);
        });

        // Convert to array and sort by date
        const weeklyData = Object.entries(dailyStats)
            .map(([date, calories]) => ({ date, calories }))
            .sort((a, b) => a.date.localeCompare(b.date));

        return res.status(200).json(weeklyData);
    } catch (err) {
        console.error("Weekly stats error:", err);
        return res.status(500).json({ message: "Server error" });
    }
});

// ==========================================
// USER MANAGEMENT ENDPOINTS
// ==========================================

/**
 * PUT /user/:email
 * Update user profile information
 */
router.put("/user/:email", async (req, res) => {
    try {
        const collection = db.collection("Users");
        const email = req.params.email;
        const { _id, ...updates } = req.body; // Exclude _id from updates

        if (!email) {
            return res.status(400).json({ message: "Email is required" });
        }

        // Update user in database
        const result = await collection.updateOne(
            { email: email },
            { $set: updates }
        );

        if (result.matchedCount === 0) {
            return res.status(404).json({ message: "User not found" });
        }

        // Fetch and return updated user
        const updated = await collection.findOne({ email: email });
        return res.status(200).json(updated);
    } catch (err) {
        console.error("Update user error:", err);
        return res.status(500).json({ message: "Server error" });
    }
});

/**
 * POST /
 * Register a new user with email, password, and profile data
 */
router.post("/", async (req, res) => {
    try {
        const collection = db.collection("Users");
        const { email, password, ...userData } = req.body;

        // Validate required fields
        if (!email || !password) {
            return res.status(400).json({ message: "Email and password are required" });
        }

        // Check if email already exists
        const existingUser = await collection.findOne({ email: email });
        if (existingUser) {
            return res.status(409).json({ message: "Email already registered" });
        }

        // Hash password with bcrypt
        const hashedPassword = await bcrypt.hash(password, 10);

        // Insert new user
        const result = await collection.insertOne({
            ...userData,
            email,
            password: hashedPassword,
            createdAt: new Date(),
        });

        // Fetch and return the created user (without password)
        const insertedUser = await collection.findOne({ _id: result.insertedId });
        const { password: _, ...safeUser } = insertedUser;

        return res.status(201).json(safeUser);
    } catch (err) {
        console.error("Registration error:", err);
        return res.status(500).json({ message: "Server error" });
    }
});

/**
 * POST /login
 * Authenticate user with email and password
 */
router.post("/login", async (req, res) => {
    try {
        const collection = db.collection("Users");
        const { email, password } = req.body;

        // Validate required fields
        if (!email || !password) {
            return res.status(400).json({ message: "Email and password are required" });
        }

        // Find user by email
        const user = await collection.findOne({ email: email });
        if (!user) {
            return res.status(404).json({ message: "Email not registered" });
        }

        // Verify password using bcrypt
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: "Invalid password" });
        }

        // Return user without password field
        const { password: _, ...safeUser } = user;
        return res.status(200).json(safeUser);
    } catch (err) {
        console.error("Login error:", err);
        return res.status(500).json({ message: "Server error" });
    }
});

export default router;
});


export default router;