const express = require("express");
const MongoClient = require("mongodb").MongoClient;
const cors = require("cors");
const multer = require("multer");

const app = express();
app.use(cors());
const PORT = 5038;

const CONNECTION_STRING =
  "mongodb+srv://admin:Yrskrmsr@cluster0.nwljkhx.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
const DATABASE_NAME = "imagedb";
let database;

app.listen(PORT, () => {
  MongoClient.connect(CONNECTION_STRING, (error, client) => {
    if (error) {
      console.error("Error connecting to MongoDB:", error);
      return;
    }
    database = client.db(DATABASE_NAME);
    console.log("MongoDB Connection Successful");
  });
});
app.use(express.json());
app.get("/api/image/GetInfo", (req, res) => {
  database
    .collection("imagecollection")
    .find({})
    .toArray((error, result) => {
      if (error) {
        console.error("Error fetching notes:", error);
        res.status(500), json({ error: "Internal server error" });
        return;
      }
      res.json(result);
    });
});
