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

app.post("/api/image/AddImages", multer().none(), (req, res) => {
  const { name, work } = res.body;
  console.log("New image name:", name);
  console.log("New image salary:", work);
  if (!name || !work) {
    res.status(400).json({ error: "Name and Work are required" });
    return;
  }
  database.collection("imagecollection").countDocument({}, (error, count) => {
    if (error) {
      console.error("Error counting documents:", error);
      res.status(500).json({ error: "Internal server error" });
      return;
    }
    const newImageObject = {
      id: (count + 1).toString(),
      name: name,
      salary: work,
    };
    database
      .collection("imagecollection")
      .insertOne(newImageObject, (error) => {
        if (error) {
          console.error("Error counting documents:", error);
          res.status(500).json({ error: "Internal server error" });
          return;
        }
        res.json({ message: "Add success fully" });
      });
  });
});
app.put("/api/employee/UpdateEmployees", (req, res) => {
  const id = req.body.id;
  const { name, work } = req.body;
  const updatedImage = { name, work };
  database
    .collection("imagecollection")
    .updateOne({ id: id }, { $set: updatedImage }, (err, result) => {
      if (err) {
        console.error("Error updating Image:", err);
        res.status(500).send("Internal server error");
        return;
      }
      res.status(200).send("Image updated successfully");
    });
});
app.delete("/api/employee/DeleteImages", (req, res) => {
  const imageId = req.query.id;
  database.collection("imagecollection").deleteOne({ id: imageid }, (error) => {
    if (error) {
      console.error("Error deleting image:", error);
      res.status(500).json({ error: "Internal server error" });
      return;
    }
    res.json({ message: "Deleted Successfully" });
  });
});
