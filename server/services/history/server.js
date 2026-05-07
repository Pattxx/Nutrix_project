import express from "express";
import db from "../../connect.js";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(
    import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, "../../config.env") });

const PORT = process.env.HISTORY_SERVICE_PORT || 5052;
const app = express();

app.use(express.json());

// save meal history
app.post("/", async(req, res) => {
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
app.get("/", async(req, res) => {
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
app.get("/weekly", async(req, res) => {
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

app.listen(PORT, () => {
    console.log(`History Service listening on port ${PORT}`);
});