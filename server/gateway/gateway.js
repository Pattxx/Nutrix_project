import express from "express";
import cors from "cors";
import axios from "axios";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(
    import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, "../config.env") });

const PORT = process.env.PORT || 5050;
const app = express();

// all Service URLs
const AUTH_SERVICE = process.env.AUTH_SERVICE_URL || "http://localhost:5051";
const HISTORY_SERVICE = process.env.HISTORY_SERVICE_URL || "http://localhost:5052";
const RECIPE_SERVICE = process.env.RECIPE_SERVICE_URL || "http://localhost:5053";
const PROFILE_SERVICE = process.env.PROFILE_SERVICE_URL || "http://localhost:5054";

const allowedOrigins = [
    "http://localhost:3000",
    process.env.FRONTEND_URL
].filter(Boolean);

const corsOptions = {
    origin: (origin, callback) => {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error("Not allowed by CORS"));
        }
    },
    credentials: true,
};

app.use(cors(corsOptions));
app.use(express.json());

const forwardRequest = async(req, res, serviceUrl, path) => {
    try {
        const method = req.method.toLowerCase();
        const config = {
            method,
            url: `${serviceUrl}${path}`,
            headers: {
                "Content-Type": "application/json",
            },
        };

        if (method === "get" || method === "delete") {
            config.params = req.query;
        } else {
            config.data = req.body;
        }

        const response = await axios(config);
        res.status(response.status).json(response.data);
    } catch (err) {
        const status = err.response?.status || 500;
        const message = err.response?.data?.message || "Service error";
        console.error(`Service error from ${serviceUrl}:`, message);
        res.status(status).json({ message });
    }
};

// Auth Service
app.post("/record/login", (req, res) => {
    forwardRequest(req, res, AUTH_SERVICE, "/login");
});

app.post("/record/register", (req, res) => {
    forwardRequest(req, res, AUTH_SERVICE, "/register");
});

// History Service
app.post("/record/history", (req, res) => {
    forwardRequest(req, res, HISTORY_SERVICE, "/");
});

app.get("/record/history", (req, res) => {
    forwardRequest(req, res, HISTORY_SERVICE, "/");
});

app.get("/record/history/weekly", (req, res) => {
    forwardRequest(req, res, HISTORY_SERVICE, "/weekly");
});

// Profile Service 
app.put("/record/user/:email", (req, res) => {
    forwardRequest(req, res, PROFILE_SERVICE, `/${req.params.email}`);
});

// Recipe Service
app.post("/api/recipe/generate", (req, res) => {
    forwardRequest(req, res, RECIPE_SERVICE, "/generate");
});

app.get("/health", (req, res) => {
    res.json({ status: "API Gateway is running" });
});

app.listen(PORT, () => {
    console.log(`API Gateway listening on port ${PORT}`);
    console.log(`Auth Service: ${AUTH_SERVICE}`);
    console.log(`History Service: ${HISTORY_SERVICE}`);
    console.log(`Recipe Service: ${RECIPE_SERVICE}`);
    console.log(`Profile Service: ${PROFILE_SERVICE}`);
});