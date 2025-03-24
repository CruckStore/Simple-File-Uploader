import React, { useEffect, useState } from 'react';

type FileData = {
  name: string;
  size: number;
  date: string;
};

const ControlCenter: React.FC = () => {
  const [files, setFiles] = useState<FileData[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [boxSize, setBoxSize] = useState<number>(150);
  const [selectedFile, setSelectedFile] = useState<FileData | null>(null);

  useEffect(() => {
    fetch('http://localhost:3000/api/files')
      .then(response => response.json())
      .then(data => setFiles(data));
  }, []);

  const filteredFiles = files.filter(file =>
    file.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getFileExtension = (fileName: string): string => {
    const parts = fileName.split('.');
    return parts.length > 1 ? parts.pop()!.toLowerCase() : '';
  };

  const renderPreview = (file: FileData) => {
    const ext = getFileExtension(file.name);
    const url = `http://localhost:3000/uploads/${file.name}`;
    const imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'svg'];
    if (ext && imageExtensions.includes(ext)) {
      return <img src={url} alt={file.name} style={{ width: '100%', height: 'auto', borderRadius: '4px' }} />;
    }
    const videoExtensions = ['mp4', 'webm', 'ogg'];
    if (ext && videoExtensions.includes(ext)) {
      return <video controls src={url} style={{ width: '100%' }} />;
    }
    const audioExtensions = ['mp3', 'wav', 'ogg'];
    if (ext && audioExtensions.includes(ext)) {
      return <audio controls src={url} style={{ width: '100%' }} />;
    }
    const textExtensions = ['txt', 'html', 'htm', 'md'];
    if (ext && textExtensions.includes(ext)) {
      return (
        <iframe
          src={url}
          title={file.name}
          style={{ width: '100%', height: '100px', border: 'none' }}
          sandbox="allow-same-origin"
        />
      );
    }
    return (
      <div
        style={{
          height: '100px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#f0f0f0',
          borderRadius: '4px'
        }}
      >
        <span>Aperçu indisponible</span>
      </div>
    );
  };

  const renderLargePreview = (file: FileData) => {
    const ext = getFileExtension(file.name);
    const url = `http://localhost:3000/uploads/${file.name}`;
    const imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'svg'];
    if (ext && imageExtensions.includes(ext)) {
      return <img src={url} alt={file.name} style={{ maxWidth: '90vw', maxHeight: '90vh', borderRadius: '4px' }} />;
    }
    const videoExtensions = ['mp4', 'webm', 'ogg'];
    if (ext && videoExtensions.includes(ext)) {
      return <video controls src={url} style={{ maxWidth: '90vw', maxHeight: '90vh' }} />;
    }
    const audioExtensions = ['mp3', 'wav', 'ogg'];
    if (ext && audioExtensions.includes(ext)) {
      return <audio controls src={url} style={{ width: '90vw' }} />;
    }
    const textExtensions = ['txt', 'html', 'htm', 'md'];
    if (ext && textExtensions.includes(ext)) {
      return (
        <iframe
          src={url}
          title={file.name}
          style={{ width: '90vw', height: '70vh', border: 'none' }}
          sandbox="allow-same-origin"
        />
      );
    }
    return (
      <div
        style={{
          height: '200px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#f0f0f0',
          borderRadius: '4px'
        }}
      >
        <span>Aperçu indisponible</span>
      </div>
    );
  };

  return (
    <div style={{ textAlign: 'center' }}>
      <h2>Control Center</h2>
      <div style={{ marginBottom: '20px' }}>
        <input
          type="text"
          placeholder="Rechercher par nom..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{ padding: '10px', width: '80%', fontSize: '1em' }}
        />
      </div>
      <div style={{ marginBottom: '20px' }}>
        <label>
          Taille des boîtes :
          <input
            type="range"
            min="100"
            max="1000"
            value={boxSize}
            onChange={(e) => setBoxSize(Number(e.target.value))}
            style={{ marginLeft: '10px' }}
          />
          <span style={{ marginLeft: '10px' }}>{boxSize}px</span>
        </label>
      </div>
      <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '20px' }}>
        {filteredFiles.map(file => (
          <div
            key={file.name}
            style={{
              width: `${boxSize}px`,
              border: '1px solid #ddd',
              borderRadius: '8px',
              padding: '10px',
              background: '#fff',
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
              cursor: 'pointer'
            }}
            onClick={() => setSelectedFile(file)}
          >
            <div style={{ width: '100%', marginBottom: '8px' }}>
              {renderPreview(file)}
            </div>
            <p style={{ fontSize: '0.8em', margin: 0 }}>{file.name}</p>
          </div>
        ))}
      </div>

      {selectedFile && (
        <div
          onClick={() => setSelectedFile(null)}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            background: 'rgba(0,0,0,0.7)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              background: '#fff',
              padding: '20px',
              borderRadius: '8px',
              maxWidth: '95vw',
              maxHeight: '95vh',
              overflow: 'auto'
            }}
          >
            <h3>{selectedFile.name}</h3>
            {renderLargePreview(selectedFile)}
            <button onClick={() => setSelectedFile(null)} style={{ marginTop: '10px' }}>
              Fermer
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ControlCenter;
