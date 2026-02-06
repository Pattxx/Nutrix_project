import express from "express";
import db from "../connect.js";
import { ObjectId } from "mongodb";

const router = express.Router();

// This section will help you get a single record by id
router.get("/:name", async(req, res) => {
    let collection = await db.collection("records");
    let query = { _id: new ObjectId(req.params.id) };
    let result = await collection.findOne(query);

    if (!result) res.send("Not found").status(404);
    else res.send(result).status(200);
});

// This section will help you create a new record.
router.post("/", async(req, res) => {
    const collection = db.collection("Users");
    const { email } = req.body;

    // Sprawdzenie unikalności
    const existingUser = await collection.findOne({ email: email });
    if (existingUser) {
        return res.status(409).json({ message: "Ten email jest już zarejestrowany!" });
    }

    const result = await collection.insertOne(req.body);
    res.status(201).json(result);
});

// This section will help you update a record by id.
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

// This section will help you delete a record
router.delete("/:id", async(req, res) => {
    try {
        const query = { _id: new ObjectId(req.params.id) };

        const collection = db.collection("records");
        let result = await collection.deleteOne(query);

        res.send(result).status(200);
    } catch (err) {
        console.error(err);
        res.status(500).send("Error deleting record");
    }
});

export default router;