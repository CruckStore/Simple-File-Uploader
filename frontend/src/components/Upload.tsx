import React, { useRef, useState } from 'react';

interface UploadedFile {
  id: string;
  url: string;
  mimetype: string;
  name: string;
  size: number;
  progress: number;
  xhr?: XMLHttpRequest;
}

const Upload: React.FC = () => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [status, setStatus] = useState<string>('');
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [visibleCount, setVisibleCount] = useState<number>(10);

  const handleUpload = (file: File) => {
    const id = `${Date.now()}-${Math.random()}`;
    const xhr = new XMLHttpRequest();
    const newFile: UploadedFile = {
      id,
      url: '',
      mimetype: file.type,
      name: file.name,
      size: file.size,
      progress: 0,
      xhr: xhr,
    };

    setUploadedFiles(prev => [...prev, newFile]);

    const formData = new FormData();
    formData.append('file', file);

    xhr.open('POST', 'http://localhost:3000/upload');

    xhr.upload.onprogress = (event) => {
      if (event.lengthComputable) {
        const progress = Math.round((event.loaded / event.total) * 100);
        setUploadedFiles(prev =>
          prev.map(f => f.id === id ? { ...f, progress } : f)
        );
      }
    };

    xhr.onreadystatechange = () => {
      if (xhr.readyState === XMLHttpRequest.DONE) {
        if (xhr.status === 200) {
          try {
            const data = JSON.parse(xhr.responseText);
            if (data.success) {
              const url = `http://localhost:3000/uploads/${data.file.filename}`;
              setUploadedFiles(prev =>
                prev.map(f => f.id === id ? { ...f, url, progress: 100 } : f)
              );
              setStatus('Fichier(s) uploadé(s) avec succès !');
            } else {
              setStatus('Échec de l’upload.');
            }
          } catch (error) {
            setStatus('Erreur lors de l’upload.');
          }
        } else {
          setStatus('Erreur lors de l’upload.');
        }
      }
    };

    xhr.send(formData);
  };

  const handleCancel = (id: string) => {
    const fileToCancel = uploadedFiles.find(f => f.id === id);
    if (fileToCancel && fileToCancel.xhr) {
      fileToCancel.xhr.abort();
      setUploadedFiles(prev => prev.filter(f => f.id !== id));
      setStatus(`Upload annulé pour ${fileToCancel.name}`);
    }
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
    const { url, mimetype, name, size, progress, id } = uploadedFile;
    if (!url) {
      return (
        <div>
          <p>Upload en cours : {progress}%</p>
          <div style={{ width: '100%', background: '#eee', borderRadius: '4px' }}>
            <div
              style={{
                width: `${progress}%`,
                background: '#4caf50',
                height: '10px',
                borderRadius: '4px'
              }}
            ></div>
          </div>
          <button onClick={() => handleCancel(id)} style={{ marginTop: '5px' }}>
            Annuler
          </button>
        </div>
      );
    }
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
          {uploadedFiles.slice(0, visibleCount).map((file) => (
            <div
              key={file.id}
              style={{
                position: 'relative',
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
              <button
                onClick={() => setUploadedFiles(prev => prev.filter(f => f.id !== file.id))}
                style={{
                  position: 'absolute',
                  top: '10px',
                  right: '10px',
                  background: 'transparent',
                  border: 'none',
                  fontSize: '20px',
                  cursor: 'pointer',
                  color: 'rgb(136, 136, 136)',
                }}
              >
                ×
              </button>
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
