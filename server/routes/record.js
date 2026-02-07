import express from "express";
import db from "../connect.js";
import { ObjectId } from "mongodb";

const router = express.Router();

// meal history endpoints
router.post("/history", async(req, res) => {
    try {
        const collection = db.collection("History");
        const entry = req.body;

        if (!entry || !entry.email || !entry.name) {
            return res.status(400).json({ message: "Invalid history entry" });
        }

        const result = await collection
        const inserted = await collection.findOne({ _id: result.insertedId });
        return res.status(201).json(inserted);
    } catch (err) {
        console.error("History save error:", err);
        return res.status(500).json({ message: "Server error" });
    }
});

router.get("/history", async(req, res) => {
    try {
        const collection = db.collection("History");
        const email = req.query.email;

        const query = email ? { email: String(email) } : {};
        const docs = await collection.find(query).sort({ timestamp: -1 }).toArray();
        return res.status(200).json(docs);
    } catch (err) {
        console.error("History fetch error:", err);
        return res.status(500).json({ message: "Server error" });
    }
});

// registration.
router.post("/", async(req, res) => {
    const collection = db.collection("Users");
    const { email } = req.body;

    const existingUser = await collection.findOne({ email: email });
    if (existingUser) {
        return res.status(409).json({ message: "Email already registered" });
    }

    const result = await collection.insertOne(req.body);
    res.status(201).json(result);
});

// login - check whether email is registered
router.post("/login", async(req, res) => {
    try {
        const collection = db.collection("Users");
        const { email } = req.body;

        if (!email) return res.status(400).json({ message: "Email is required" });

        const user = await collection.findOne({ email: email });
        if (!user) {
            return res.status(404).json({ message: "Email not registered" });
        }

        // remove sensitive fields if present (e.g., password)
        const { password, ...safeUser } = user;

        return res.status(200).json(safeUser);
    } catch (err) {
        console.error("Login error:", err);
        return res.status(500).json({ message: "Server error" });
    }
});


export default router;