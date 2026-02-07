import express from "express";
import db from "../connect.js";
import { ObjectId } from "mongodb";

const router = express.Router();


router.get("/:name", async(req, res) => {
    let collection = await db.collection("records");
    let query = { _id: new ObjectId(req.params.id) };
    let result = await collection.findOne(query);

    if (!result) res.send("Not found").status(404);
    else res.send(result).status(200);
});

// registration.
router.post("/", async(req, res) => {
    const collection = db.collection("Users");
    const { email } = req.body;

    const existingUser = await collection.findOne({ email: email });
    if (existingUser) {
        return res.status(409).json({ message: "Ten email jest już zarejestrowany!" });
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

router.patch("/:email", async(req, res) => {
    try {
        const query = { _id: new ObjectId(req.params.id) };
        const updates = {
            $set: {
                name: req.body.name,
                position: req.body.position,
                level: req.body.level,
            },
        };

        let collection = await db.collection("records");
        let result = await collection.updateOne(query, updates);
        res.send(result).status(200);
    } catch (err) {
        console.error(err);
        res.status(500).send("Error updating record");
    }
});

export default router;