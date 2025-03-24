import React, { useEffect, useState } from 'react';

type FileData = {
  name: string;
  size: number;
  date: string;
};

const ControlCenter: React.FC = () => {
  const [files, setFiles] = useState<FileData[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>('');

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
          borderRadius: '4px',
        }}
      >
        <span>Aperçu indisponible</span>
      </div>
    );
  };

  return (
    <div style={{ textAlign: 'center' }}>
      <h2>Control Center</h2>
      <input
        type="text"
        placeholder="Rechercher par nom..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        style={{ padding: '10px', width: '80%', fontSize: '1em', margin: '20px 0' }}
      />
      <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '20px' }}>
        {filteredFiles.map(file => (
          <div
            key={file.name}
            style={{
              width: '150px',
              border: '1px solid #ddd',
              borderRadius: '8px',
              padding: '10px',
              background: '#fff',
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
            }}
          >
            <div style={{ width: '100%', marginBottom: '8px' }}>
              {renderPreview(file)}
            </div>
            <p style={{ fontSize: '0.8em', margin: 0 }}>{file.name}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ControlCenter;
