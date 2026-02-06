import express from "express";
import cors from "cors";
import dotenv from "dotenv"; // 1. Importuj dotenv
import records from "./routes/record.js";

// 2. Skonfiguruj dotenv, wskazując na Twój plik config.env
dotenv.config({ path: "./config.env" });

const PORT = process.env.PORT || 5050;
const app = express();

app.use(cors());
app.use(express.json());
app.use("/record", records);

// start the Express server
app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});