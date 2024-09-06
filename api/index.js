const express = require("express");
const MongoClient = require("mongodb").MongoClient;
const cors = require("cors");
const multer = require("multer");

const app = express();
app.use(cors({ origin: "*" }));
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

    try {
      // Fetch the existing member from the database
      const existingMember = await database
        .collection("famillycollection")
        .findOne({ id: id });

      if (!existingMember) {
        res.status(404).json({ error: "Member not found" });
        return;
      }

      // Prepare the updated member object
      const updatedMember = {
        name: name,
        work: work,
        salary: parseInt(salary),
        image: imageBuffer
          ? imageBuffer.toString("base64")
          : existingMember.image, // Use the existing image if a new one isn't provided
      };

      // Update the member in the database
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
