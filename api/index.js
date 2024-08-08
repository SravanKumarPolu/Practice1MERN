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

app.get("/api/familly/GetInfo", async (req, res) => {
  try {
    const documents = await database
      .collection("famillycollection")
      .find({})
      .toArray();
    res.json(documents);
  } catch (error) {
    console.error("Error fetching info:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.post(
  "/api/familly/AddMembers",
  upload.single("image"),
  async (req, res) => {
    const { name, work, salary } = req.body;
    const imageBuffer = req.file?.buffer;

    if (!name || !work || !salary) {
      res.status(400).json({ error: "Name, Work, and Salary are required" });
      return;
    }

    try {
      const count = await database
        .collection("famillycollection")
        .countDocuments({});
      const newMemberObject = {
        id: (count + 1).toString(),
        name: name,
        work: work,
        salary: parseInt(salary),
        image: imageBuffer ? imageBuffer.toString("base64") : null,
      };

      await database.collection("famillycollection").insertOne(newMemberObject);
      res.json({ message: "Added successfully" });
    } catch (error) {
      console.error("Error adding member:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }
);

app.put(
  "/api/familly/UpdateMembers",
  upload.single("image"),
  async (req, res) => {
    const id = req.query.id;
    const { name, work, salary } = req.body;
    const imageBuffer = req.file?.buffer;

    if (!id || !name || !work || !salary) {
      res
        .status(400)
        .json({ error: "ID, Name, Work, and Salary are required" });
      return;
    }

    const updatedMember = {
      name: name,
      work: work,
      salary: parseInt(salary),
      image: imageBuffer ? imageBuffer.toString("base64") : req.body.image,
    };

    try {
      const result = await database
        .collection("famillycollection")
        .updateOne({ id: id }, { $set: updatedMember });
      if (result.matchedCount === 0) {
        res.status(404).json({ error: "Member not found" });
        return;
      }
      res.status(200).json({ message: "Member updated successfully" });
    } catch (error) {
      console.error("Error updating member:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }
);

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
