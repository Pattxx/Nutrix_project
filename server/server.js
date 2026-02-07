import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import records from "./routes/record.js";
import path from "path";
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(
    import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, "config.env") });

const PORT = process.env.PORT || 5050;
const app = express();

app.use(cors());
app.use(express.json());
app.use("/record", records);

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

// start the Express server
app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});