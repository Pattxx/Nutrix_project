import express from "express";
import db from "../../connect.js";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(
    import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, "../../config.env") });

const PORT = process.env.PROFILE_SERVICE_PORT || 5054;
const app = express();

app.use(express.json());

// update user profile
app.put("/:email", async(req, res) => {
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

app.listen(PORT, () => {
    console.log(`Profile Service listening on port ${PORT}`);
});