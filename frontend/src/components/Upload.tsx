import React, { useRef, useState } from 'react';

const Upload: React.FC = () => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [status, setStatus] = useState<string>('');
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

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
          if (file.type.startsWith('image/')) {
            const uploadedUrl = `http://localhost:3000/uploads/${data.file.filename}`;
            setPreviewUrl(uploadedUrl);
          } else {
            setPreviewUrl(null);
          }
        } else {
          setStatus('Échec de l’upload.');
          setPreviewUrl(null);
        }
      })
      .catch(() => {
        setStatus('Erreur lors de l’upload.');
        setPreviewUrl(null);
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
      {previewUrl && (
        <div>
          <h3>Aperçu :</h3>
          <img src={previewUrl} alt="Aperçu du fichier uploadé" style={{ maxWidth: '100%', height: 'auto' }} />
        </div>
      )}
    </div>
  );
};

export default Upload;
