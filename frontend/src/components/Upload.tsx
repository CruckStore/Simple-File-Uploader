import React, { useRef, useState } from 'react';

interface UploadedFile {
  url: string;
  mimetype: string;
  name: string;
  size: number;
}

const Upload: React.FC = () => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [status, setStatus] = useState<string>('');
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [visibleCount, setVisibleCount] = useState<number>(10);

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
          setStatus('Fichier(s) uploadé(s) avec succès !');
          const url = `http://localhost:3000/uploads/${data.file.filename}`;
          setUploadedFiles(prev => [
            ...prev,
            {
              url,
              mimetype: file.type,
              name: file.name,
              size: data.file.size,
            },
          ]);
        } else {
          setStatus('Échec de l’upload.');
        }
      })
      .catch(() => {
        setStatus('Erreur lors de l’upload.');
      });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      Array.from(e.target.files).forEach(file => handleUpload(file));
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      Array.from(e.dataTransfer.files).forEach(file => handleUpload(file));
    }
  };

  const isPreviewable = (mimetype: string) =>
    mimetype.startsWith('image/') ||
    mimetype.startsWith('video/') ||
    mimetype.startsWith('audio/');

  const handleDownload = (url: string, size: number) => {
    if (window.confirm(`C'est un fichier de ${formatBytes(size)}. Voulez-vous le télécharger ?`)) {
      window.open(url, '_blank');
    }
  };

  const formatBytes = (bytes: number, decimals = 2): string => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
  };

  const renderPreview = (uploadedFile: UploadedFile) => {
    const { url, mimetype, name, size } = uploadedFile;
    if (isPreviewable(mimetype)) {
      if (mimetype.startsWith('image/')) {
        return <img src={url} alt={name} style={{ maxWidth: '100%', height: 'auto' }} />;
      }
      if (mimetype.startsWith('video/')) {
        return <video controls src={url} style={{ maxWidth: '100%' }} />;
      }
      if (mimetype.startsWith('audio/')) {
        return <audio controls src={url} />;
      }
    }
    return (
      <div>
        <p>Ce fichier n'est pas prévisualisable (taille : {formatBytes(size)}).</p>
        <button onClick={() => handleDownload(url, size)}>Télécharger le fichier</button>
      </div>
    );
  };

  return (
    <div>
      <h2>Uploader des fichiers</h2>
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
        Déposez vos fichiers ici ou cliquez pour sélectionner
      </div>
      <input
        type="file"
        multiple
        ref={fileInputRef}
        style={{ display: 'none' }}
        onChange={handleFileChange}
      />
      <p>{status}</p>

      {uploadedFiles.length > 0 && (
        <div>
          <h3>Fichiers uploadés :</h3>
          {uploadedFiles.slice(0, visibleCount).map((file, index) => (
            <div
              key={index}
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
              <h4>{file.name}</h4>
              {renderPreview(file)}
            </div>
          ))}
          {visibleCount < uploadedFiles.length && (
            <button onClick={() => setVisibleCount(visibleCount + 20)} style={{ margin: '20px' }}>
              Charger plus
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default Upload;
