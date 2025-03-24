const express = require('express');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const cors = require('cors');

const app = express();
const port = 3000;

// Active CORS pour permettre les appels depuis le frontend Vite
app.use(cors());

const uploadFolder = path.join(__dirname, 'uploads');
// Crée le dossier uploads s'il n'existe pas
if (!fs.existsSync(uploadFolder)) {
  fs.mkdirSync(uploadFolder);
}

// Configuration de Multer pour l'upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadFolder);
  },
  filename: (req, file, cb) => {
    // Précède le nom de fichier d'un timestamp pour éviter les collisions
    cb(null, Date.now() + '-' + file.originalname);
  }
});
const upload = multer({ storage });

// Route POST pour l'upload d'un fichier
app.post('/upload', upload.single('file'), (req, res) => {
  res.json({ success: true, file: req.file });
});

// API pour récupérer la liste des fichiers
app.get('/api/files', (req, res) => {
  fs.readdir(uploadFolder, (err, files) => {
    if (err) return res.status(500).json({ error: 'Impossible de lister les fichiers' });
    const fileList = files.map(file => {
      const filePath = path.join(uploadFolder, file);
      const stats = fs.statSync(filePath);
      return {
        name: file,
        size: stats.size,
        date: stats.birthtime
      };
    });
    res.json(fileList);
  });
});

// Sert les fichiers uploadés statiquement
app.use('/uploads', express.static(uploadFolder));

app.listen(port, () => {
  console.log(`Backend démarré sur http://localhost:${port}`);
});
