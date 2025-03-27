const express = require("express");
const multer = require("multer");
const fs = require("fs");
const path = require("path");
const cors = require("cors");

const app = express();
const port = 3000;

app.use(cors());

const apiLogs = [];

app.use((req, res, next) => {
  if (req.originalUrl === '/api/logs') {
    return next();
  }
  const log = {
    time: new Date().toLocaleString(),
    method: req.method,
    url: req.originalUrl,
    userAgent: req.headers["user-agent"] || "unknown",
  };
  apiLogs.push(log);
  if (apiLogs.length > 1000) {
    apiLogs.shift();
  }
  next();
});

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
      return res.status(500).json({ error: "Impossible de lister les fichiers" });
    const fileList = files.map((file, index) => {
      const filePath = path.join(uploadFolder, file);
      const stats = fs.statSync(filePath);
      const fullFilename = file;
      const originalName = file.includes("-")
        ? file.split("-").slice(1).join("-")
        : file;
      return {
        id: (index + 1).toString(),
        filename: fullFilename,
        name: originalName,
        size: stats.size,
        date: stats.birthtime,
      };
    });
    res.json(fileList);
  });
});

app.get("/api/logs", (req, res) => {
  res.json(apiLogs);
});

app.get("/upload", (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="UTF-8">
        <title>Upload API Documentation</title>
        <style>
          body { background-color: #f9f9f9; font-family: Arial, sans-serif; padding: 30px; color: #333; }
          .container { max-width: 800px; margin: 0 auto; }
          h1 { font-size: 2.5em; margin-bottom: 10px; }
          p { font-size: 1.1em; }
          code { background: #eee; padding: 2px 4px; border-radius: 4px; }
        </style>
      </head>
      <body>
        <div class="container">
          <h1>Upload API</h1>
          <p>Utilisez ce endpoint pour uploader des fichiers.</p>
          <p><strong>Endpoint:</strong> <code>POST /upload</code></p>
          <p>Envoyez un formulaire avec le champ <code>file</code> contenant le fichier à uploader.</p>
          <p>La réponse renvoie un objet JSON contenant les informations du fichier uploadé.</p>
        </div>
      </body>
    </html>
  `);
});

app.get("/uploads", (req, res, next) => {
  if (req.originalUrl === "/uploads" || req.originalUrl === "/uploads/") {
    return res.send(`
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8">
          <title>Uploaded Files API</title>
          <style>
            body { background-color: #f9f9f9; font-family: Arial, sans-serif; padding: 30px; color: #333; }
            .container { max-width: 800px; margin: 0 auto; }
            h1 { font-size: 2.5em; margin-bottom: 10px; }
            p { font-size: 1.1em; }
            code { background: #eee; padding: 2px 4px; border-radius: 4px; }
          </style>
        </head>
        <body>
          <div class="container">
            <h1>Uploaded Files</h1>
            <p>Accédez à vos fichiers uploadés en naviguant vers <code>/uploads/&lt;filename&gt;</code>.</p>
            <p>Par exemple, si un fichier est uploadé avec le nom <code>1743033045755-fichier.jpg</code>, il sera accessible via :</p>
            <p><code>GET /uploads/1743033045755-fichier.jpg</code></p>
          </div>
        </body>
      </html>
    `);
  }
  next();
});

app.use("/uploads", express.static(uploadFolder));


app.get("/", (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="UTF-8">
        <title>API Status & Logs</title>
        <style>
          body { background-color: #f9f9f9; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; margin: 0; padding: 30px; color: #333; }
          .container { max-width: 900px; margin: 0 auto; text-align: center; }
          h1 { font-size: 2.5em; margin-bottom: 10px; }
          p.description { font-size: 1.1em; color: #666; }
          .status-cards, .frontend-links, .request-logs { display: flex; flex-wrap: wrap; justify-content: center; gap: 20px; margin-top: 30px; }
          .card, .link-card, .log-card { background: #fff; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1); padding: 20px; flex: 1 1 250px; max-width: 300px; transition: transform 0.2s ease; }
          .card:hover, .link-card:hover, .log-card:hover { transform: translateY(-5px); }
          .card h2, .link-card h2, .log-card h2 { font-size: 1.2em; margin: 0 0 10px; }
          .endpoint { display: block; margin-top: 10px; padding: 10px; border-radius: 4px; text-decoration: none; font-weight: bold; }
          .up { background-color: #e8f5e9; color: #2e7d32; }
          .down { background-color: #ffebee; color: #c62828; }
          #logs { max-height: 200px; overflow-y: auto; text-align: left; font-size: 0.9em; border: 1px solid #ddd; padding: 10px; border-radius: 4px; background: #fff; }
          footer { margin-top: 40px; font-size: 0.9em; color: #777; }
        </style>
        <script>
          // Rafraîchissement périodique des logs d'API
          function fetchLogs() {
            fetch('/api/logs')
              .then(response => response.json())
              .then(data => {
                const logsContainer = document.getElementById("logs");
                if(logsContainer) {
                  logsContainer.innerHTML = "";
                  data.forEach(log => {
                    const logItem = document.createElement("div");
                    logItem.textContent = "[" + log.time + "] " + log.method + " " + log.url + " (" + log.userAgent + ")";
                    logsContainer.appendChild(logItem);
                  });
                }
              });
          }
          setInterval(fetchLogs, 5000);
          window.onload = fetchLogs;
        </script>
      </head>
      <body>
        <div class="container">
          <h1>API Status & Logs</h1>
          <p class="description">
            Bienvenue sur l'API de gestion de fichiers. Vous trouverez ici l'état des endpoints et les logs de chaque appel d'API.
          </p>
          <div class="status-cards">
            <div class="card">
              <h2>Upload</h2>
              <a class="endpoint up" href="/upload" target="_blank">/upload</a>
            </div>
            <div class="card">
              <h2>Files</h2>
              <a class="endpoint up" href="/api/files" target="_blank">/api/files</a>
            </div>
            <div class="card">
              <h2>Static Files</h2>
              <a class="endpoint up" href="/uploads" target="_blank">/uploads</a>
            </div>
            <div class="card">
              <h2>Logs</h2>
              <a class="endpoint up" href="/api/logs" target="_blank">/api/logs</a>
            </div>
          </div>
          <h2 style="margin-top:40px;">Logs des appels d'API</h2>
          <div class="request-logs">
            <div class="log-card">
              <h2>Logs</h2>
              <div id="logs"></div>
            </div>
          </div>
          <footer>
            <p>Le serveur fonctionne correctement et est en écoute sur le port ${port}.</p>
          </footer>
        </div>
      </body>
    </html>
  `);
});

app.listen(port, () => {
  console.log(`Backend démarré sur http://localhost:${port}`);
});
