import { MongoClient, ServerApiVersion } from "mongodb";

const uri = process.env.URI || "";
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    },
});

try {

    await client.connect();
    await client.db("admin").command({ ping: 1 });
    console.log(
        "Pinged your deployment. You successfully connected to MongoDB!"
    );
} catch (err) {
    console.error(err);
}

let db = client.db("Nutrix_data");

export default db;