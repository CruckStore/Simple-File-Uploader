import React, { useRef, useState } from 'react';

interface UploadedFile {
  url: string;
  mimetype: string;
  name: string;
}

const Upload: React.FC = () => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [status, setStatus] = useState<string>('');
  const [uploadedFile, setUploadedFile] = useState<UploadedFile | null>(null);

  const handleUpload = (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    fetch('http://localhost:3000/upload', {
      method: 'POST',
      body: formData,
    })
      .then(response => response.json())
      .then(data => {
        if (data.success) {
          setStatus('Fichier uploadé avec succès !');
          const url = `http://localhost:3000/uploads/${data.file.filename}`;
          setUploadedFile({
            url,
            mimetype: file.type,
            name: file.name,
          });
        } else {
          setStatus('Échec de l’upload.');
          setUploadedFile(null);
        }
      })
      .catch(() => {
        setStatus('Erreur lors de l’upload.');
        setUploadedFile(null);
      });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleUpload(e.target.files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleUpload(e.dataTransfer.files[0]);
    }
  };

  // Fonction pour afficher le bon aperçu selon le type MIME
  const renderPreview = () => {
    if (!uploadedFile) return null;
    const { url, mimetype, name } = uploadedFile;
    if (mimetype.startsWith('image/')) {
      return <img src={url} alt={name} style={{ maxWidth: '100%', height: 'auto' }} />;
    }
    if (mimetype.startsWith('video/')) {
      return <video controls src={url} style={{ maxWidth: '100%' }} />;
    }
    if (mimetype.startsWith('audio/')) {
      return <audio controls src={url} />;
    }
    // Pour d'autres types, afficher un lien
    return (
      <p>
        Aperçu indisponible pour ce type de fichier.{' '}
        <a href={url} target="_blank" rel="noopener noreferrer">
          Ouvrir le fichier
        </a>
      </p>
    );
  };

  return (
    <div>
      <h2>Uploader un fichier</h2>
      <div
        style={{
          border: '2px dashed #ccc',
          borderRadius: '10px',
          padding: '50px',
          cursor: 'pointer',
          margin: '20px auto',
          maxWidth: '500px',
        }}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
      >
        Déposez votre fichier ici ou cliquez pour sélectionner
      </div>
      <input
        type="file"
        ref={fileInputRef}
        style={{ display: 'none' }}
        onChange={handleFileChange}
      />
      <p>{status}</p>

      {uploadedFile && (
        <div
          style={{
            border: '1px solid #ddd',
            borderRadius: '8px',
            padding: '20px',
            marginTop: '20px',
            backgroundColor: '#fff',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
            maxWidth: '500px',
            margin: '20px auto'
          }}
        >
          <h3>{uploadedFile.name}</h3>
          {renderPreview()}
          <p>
            <a href={uploadedFile.url} target="_blank" rel="noopener noreferrer">
              Voir le fichier
            </a>
          </p>
        </div>
      )}
    </div>
  );
};

export default Upload;
