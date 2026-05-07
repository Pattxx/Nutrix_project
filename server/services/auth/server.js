import express from "express";
import bcrypt from "bcrypt";
import db from "../../connect.js";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(
    import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, "../../config.env") });

const PORT = process.env.AUTH_SERVICE_PORT || 5051;
const app = express();

app.use(express.json());

// registration. check if email exists, hash password, save user
app.post("/register", async(req, res) => {
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
app.post("/login", async(req, res) => {
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

app.listen(PORT, () => {
    console.log(`Auth Service listening on port ${PORT}`);
});