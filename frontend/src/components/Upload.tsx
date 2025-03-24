import React, { useRef, useState } from 'react';

const Upload: React.FC = () => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [status, setStatus] = useState<string>('');

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
        } else {
          setStatus('Echec de l’upload.');
        }
      })
      .catch(() => {
        setStatus('Erreur lors de l’upload.');
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
    </div>
  );
};

export default Upload;
