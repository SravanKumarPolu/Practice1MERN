const express = require("express");
const MongoClient = require("mongodb").MongoClient;
const cors = require("cors");
const multer = require("multer");

const app = express();
app.use(cors());
const PORT = 5038;

const CONNECTION_STRING =
  "mongodb+srv://admin:Yrskrmsr@cluster0.nwljkhx.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
const DATABASE_NAME = "famillydb";
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

app.get("/api/familly/GetInfo", (req, res) => {
  database
    .collection("famillycollection")
    .find({})
    .toArray((error, result) => {
      if (error) {
        console.error("Error fetching Info:", error);
        res.status(500).json({ error: "Internal server error" });
        return;
      }
      res.json(result);
    });
});

app.post("/api/familly/AddMembers", multer().none(), (req, res) => {
  const { name, work } = req.body;
  console.log("New member name:", name);
  console.log("New member work:", work);

  if (!name || !work) {
    res.status(400).json({ error: "Name and Work are required" });
    return;
  }

  database
    .collection("famillycollection")
    .countDocuments({}, (error, count) => {
      if (error) {
        console.error("Error counting documents:", error);
        res.status(500).json({ error: "Internal server error" });
        return;
      }
      const newMemberObject = {
        id: (count + 1).toString(),
        name: name,
        work: work,
      };
      database
        .collection("famillycollection")
        .insertOne(newMemberObject, (error) => {
          if (error) {
            console.error("Error inserting document:", error);
            res.status(500).json({ error: "Internal server error" });
            return;
          }
          res.json({ message: "Added successfully" });
        });
    });
});

app.put("/api/familly/UpdateMembers", (req, res) => {
  const id = req.body.id;
  const { name, work } = req.body;
  const updatedMember = { name, work };

  database
    .collection("famillycollection")
    .updateOne({ id: id }, { $set: updatedMember }, (err, result) => {
      if (err) {
        console.error("Error updating document:", err);
        res.status(500).send("Internal server error");
        return;
      }
      res.status(200).send("Member updated successfully");
    });
});

app.delete("/api/familly/DeleteMembers", (req, res) => {
  const memberId = req.query.id;

  database
    .collection("famillycollection")
    .deleteOne({ id: memberId }, (error) => {
      if (error) {
        console.error("Error deleting document:", error);
        res.status(500).json({ error: "Internal server error" });
        return;
      }
      res.json({ message: "Deleted Successfully" });
    });
});
