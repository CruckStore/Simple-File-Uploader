import React, { useEffect, useState } from 'react';

type FileData = {
  id: string;
  filename: string;
  name: string;
  size: number;
  date: string;
};

const ControlCenter: React.FC = () => {
  const [files, setFiles] = useState<FileData[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [boxSize, setBoxSize] = useState<number>(300);
  const [selectedFile, setSelectedFile] = useState<FileData | null>(null);
  const [visibleCount, setVisibleCount] = useState<number>(50);

  useEffect(() => {
    fetch('http://localhost:3000/api/files')
      .then((response) => response.json())
      .then((data) => setFiles(data));
  }, []);

  const filteredFiles = files.filter(file =>
    file.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  useEffect(() => {
    setVisibleCount(50);
  }, [searchQuery]);

  useEffect(() => {
    const handleScroll = () => {
      if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 500) {
        setVisibleCount(prev => Math.min(prev + 50, filteredFiles.length));
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [filteredFiles]);

  const getFileExtension = (fileName: string): string => {
    const parts = fileName.split('.');
    return parts.length > 1 ? parts.pop()!.toLowerCase() : '';
  };

  const docExtensions = ['html', 'htm', 'txt', 'md', 'ts', 'tsx', 'js', 'jsx', 'c', 'cpp', 'java', 'css', 'scss', 'sql', 'py', 'rb', 'php'];

  const videoExtensions = ['mp4', 'webm', 'ogg'];

  const renderPreview = (file: FileData) => {
    const ext = getFileExtension(file.name);
    const url = `http://localhost:3000/uploads/${file.filename}`;
    
    // Images
    const imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'svg'];
    if (ext && imageExtensions.includes(ext)) {
      return <img src={url} alt={file.name} style={{ width: '100%', height: 'auto', borderRadius: '4px' }} />;
    }

    // Vidéos
    if (ext && videoExtensions.includes(ext)) {
      return (
        <div style={{ position: 'relative', width: '100%', height: '150px', background: '#000' }}>
          <div
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              color: '#fff',
              fontSize: '32px'
            }}
          >
            ▶
          </div>
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '150px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: 'rgba(0,0,0,0.3)',
              color: '#fff',
              fontSize: '14px'
            }}
          >
            Cliquez pour voir
          </div>
        </div>
      );
    }

    // Audio
    const audioExtensions = ['mp3', 'wav', 'ogg'];
    if (ext && audioExtensions.includes(ext)) {
      return <audio controls src={url} style={{ width: '100%' }} />;
    }

    if (ext && docExtensions.includes(ext)) {
      return (
        <div style={{ position: 'relative', width: '100%', height: '150px' }}>
          <iframe
            src={url}
            title={file.name}
            style={{ width: '100%', height: '150px', border: 'none' }}
            sandbox="allow-scripts allow-same-origin"
          />
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '150px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: 'rgba(0,0,0,0.3)',
              color: '#fff',
              fontSize: '14px'
            }}
          >
          </div>
        </div>
      );
    }

    return (
      <div
        style={{
          height: '150px',
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

    // Images
    const imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'svg'];
    if (ext && imageExtensions.includes(ext)) {
      return <img src={url} alt={file.name} style={{ maxWidth: '90vw', maxHeight: '90vh', borderRadius: '4px' }} />;
    }

    // Vidéos
    if (ext && videoExtensions.includes(ext)) {
      return <video controls src={url} style={{ maxWidth: '90vw', maxHeight: '90vh' }} />;
    }

    // Audio
    const audioExtensions = ['mp3', 'wav', 'ogg'];
    if (ext && audioExtensions.includes(ext)) {
      return <audio controls src={url} style={{ width: '90vw' }} />;
    }

    // Documents / Code
    if (ext && docExtensions.includes(ext)) {
      return (
        <iframe
          src={url}
          title={file.name}
          style={{ width: '90vw', height: '80vh', border: 'none' }}
          sandbox="allow-scripts allow-same-origin"
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
    <div style={{ textAlign: 'center', padding: '20px' }}>
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
            min="200"
            max="1000"
            value={boxSize}
            onChange={(e) => setBoxSize(Number(e.target.value))}
            style={{ marginLeft: '10px' }}
          />
          <span style={{ marginLeft: '10px' }}>{boxSize}px</span>
        </label>
      </div>
      <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '20px' }}>
        {filteredFiles.slice(0, visibleCount).map(file => (
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
