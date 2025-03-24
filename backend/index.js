const express = require("express");
const multer = require("multer");
const fs = require("fs");
const path = require("path");
const cors = require("cors");

const app = express();
const port = 3000;

app.use(cors());

const uploadFolder = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadFolder)) {
  fs.mkdirSync(uploadFolder);
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadFolder);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});
const upload = multer({ storage });

app.post("/upload", upload.single("file"), (req, res) => {
  res.json({ success: true, file: req.file });
});

app.delete("/api/files/:filename", (req, res) => {
  const filePath = path.join(uploadFolder, req.params.filename);
  fs.unlink(filePath, (err) => {
    if (err)
      return res
        .status(500)
        .json({ success: false, error: "Erreur lors de la suppression" });
    res.json({ success: true });
  });
});

app.get("/api/files", (req, res) => {
  fs.readdir(uploadFolder, (err, files) => {
    if (err)
      return res
        .status(500)
        .json({ error: "Impossible de lister les fichiers" });
    const fileList = files.map((file, index) => {
      const filePath = path.join(uploadFolder, file);
      const stats = fs.statSync(filePath);
      return {
        id: (index + 1).toString(),
        name: file,
        size: stats.size,
        date: stats.birthtime,
      };
    });
    res.json(fileList);
  });
});

app.use("/uploads", express.static(uploadFolder));

app.listen(port, () => {
  console.log(`Backend démarré sur http://localhost:${port}`);
});
