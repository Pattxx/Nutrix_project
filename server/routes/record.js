import express from "express";
import db from "../connect.js";
import bcrypt from "bcrypt";
import { ObjectId } from "mongodb";

const router = express.Router();

// meal history endpoints
// save meal history
router.post("/history", async(req, res) => {
    try {
        const collection = db.collection("History");
        const entry = req.body;

        if (!entry || !entry.email || !entry.name) {
            return res.status(400).json({ message: "Invalid history entry" });
        }

        const result = await collection.insertOne(entry);
        const inserted = await collection.findOne({ _id: result.insertedId });

        return res.status(201).json(inserted);
    } catch (err) {
        console.error("History save error:", err);
        return res.status(500).json({ message: "Server error" });
    }
});

// fetch meal history
router.get("/history", async(req, res) => {
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

// weekly stats 
router.get("/history/weekly", async(req, res) => {
    try {
        const collection = db.collection("History");
        const email = req.query.email;

        if (!email) return res.status(400).json({ message: "Email is required" });

        // Calculate date 7 days ago
        const sevenDaysAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;

        // Fetch entries from the last 7 days
        const entries = await collection
            .find({
                email: String(email),
                timestamp: { $gte: sevenDaysAgo },
            })
            .toArray();

        // Group calories by day 
        const dailyStats = {};
        entries.forEach((entry) => {
            const date = new Date(entry.timestamp);
            date.setHours(0, 0, 0, 0);
            const dateKey = date.toISOString().split('T')[0]; // YYYY-MM-DD
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
// update user profile
router.put("/user/:email", async(req, res) => {
    try {
        const collection = db.collection("Users");
        const email = req.params.email;
        const { _id, ...updates } = req.body; // Exclude _id from updates

        if (!email) return res.status(400).json({ message: "Email is required" });

        const result = await collection.updateOne({ email: email }, { $set: updates });
        if (result.matchedCount === 0) {
            return res.status(404).json({ message: "User not found" });
        }

        const updated = await collection.findOne({ email: email });
        return res.status(200).json(updated);
    } catch (err) {
        console.error("Update user error:", err);
        return res.status(500).json({ message: "Server error" });
    }
});

// registration. check if email exists, hash password, save user
router.post("/", async(req, res) => {
    try {
        const collection = db.collection("Users");
        const { email, password, ...userData } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: "Email and password are required" });
        }

        const existingUser = await collection.findOne({ email: email });
        if (existingUser) {
            return res.status(409).json({ message: "Email already registered" });
        }

        // Hash password with bcrypt
        const hashedPassword = await bcrypt.hash(password, 10);

        const result = await collection.insertOne({
            ...userData,
            email,
            password: hashedPassword,
            createdAt: new Date(),
        });

        const insertedUser = await collection.findOne({ _id: result.insertedId });
        const { password: _, ...safeUser } = insertedUser;
        res.status(201).json(safeUser);
    } catch (err) {
        console.error("Registration error:", err);
        res.status(500).json({ message: "Server error" });
    }
});

// login - check email and password
router.post("/login", async(req, res) => {
    try {
        const collection = db.collection("Users");
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: "Email and password are required" });
        }

        const user = await collection.findOne({ email: email });
        if (!user) {
            return res.status(404).json({ message: "Email not registered" });
        }

        // verify password
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: "Invalid password" });
        }

        // return user without password
        const { password: _, ...safeUser } = user;
        return res.status(200).json(safeUser);
    } catch (err) {
        console.error("Login error:", err);
        return res.status(500).json({ message: "Server error" });
    }
});


export default router;