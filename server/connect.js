import { MongoClient, ServerApiVersion } from "mongodb";
import dotenv from "dotenv";
import path from "path";
dotenv.config({ path: "./config.env" });
// Create a new MongoClient
const uri = process.env.URI || "";
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    },
});
// Connect the client to the server 
try {
    await client.connect();
    await client.db("admin").command({ ping: 1 });
    console.log(
        "Pinged your deployment. You successfully connected to MongoDB!"
    );
} catch (err) {
    console.error(err);
}

let db = client.db("Nutrix_Data");

export default db;