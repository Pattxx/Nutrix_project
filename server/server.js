import mongoose from "mongoose";
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import records from "./routes/record.js";
import path from "path";
import { fileURLToPath } from 'url';
import recipeRoutes from "./routes/recipe.js";

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

// Initialize env vars 
const __filename = fileURLToPath(
    import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, "config.env") });
//check
//console.log("Gemini key loaded:", !!process.env.GEMINI_API_KEY);

const PORT = process.env.PORT || 5050;
const app = express();


app.use(cors(corsOptions));
app.use(express.json());
app.use("/record", records);
app.use("/api/recipe", recipeRoutes);

app.use((err, req, res, next) => {
    console.error('Server error:', err && err.message ? err.message : err);

    const isJsonParseError = err && (err.type === 'entity.parse.failed' || err instanceof SyntaxError || err.status === 400);
    if (isJsonParseError) {
        return res.status(400).json({ message: 'Invalid JSON body' });
    }

    const status = (err && err.status) || 500;
    const message = (err && err.message) || 'Internal Server Error';
    res.status(status).json({ message });
});

//conect to MongoDB 
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("MongoDB connected");

    // Start the Express server AFTER DB connection
    app.listen(PORT, () => {
      console.log(`Server listening on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err);
    process.exit(1); //xxit if DB fails
  });