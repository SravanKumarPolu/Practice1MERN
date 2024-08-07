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

const upload = multer();

app.listen(PORT, () => {
  MongoClient.connect(
    CONNECTION_STRING,
    { useNewUrlParser: true, useUnifiedTopology: true },
    (error, client) => {
      if (error) {
        console.error("Error connecting to MongoDB:", error);
        return;
      }
      database = client.db(DATABASE_NAME);
      console.log("MongoDB Connection Successful");
    }
  );
});

app.use(express.json());

app.get("/api/familly/GetInfo", (req, res) => {
  database
    .collection("famillycollection")
    .find({})
    .toArray((error, documents) => {
      if (error) {
        console.error("Error fetching Info:", error);
        res.status(500).json({ error: "Internal server error" });
        return;
      }
      res.json(documents);
    });
});

app.post("/api/familly/AddMembers", upload.single("image"), (req, res) => {
  const { name, work, salary } = req.body;
  const imageBuffer = req.file?.buffer;

  if (!name || !work || !salary) {
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
        salary: salary,
        image: imageBuffer ? imageBuffer.toString("base64") : null,
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
