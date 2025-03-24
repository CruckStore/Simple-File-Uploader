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

  const isImage = (fileName: string) => {
    const imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'svg'];
    const ext = fileName.split('.').pop()?.toLowerCase();
    return ext ? imageExtensions.includes(ext) : false;
  };

  return (
    <div style={{ textAlign: 'center' }}>
      <h2>Control Center</h2>
      <input
        type="text"
        placeholder="Rechercher par nom..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        style={{
          padding: '10px',
          width: '80%',
          fontSize: '1em',
          margin: '20px 0'
        }}
      />
      <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '20px' }}>
        {filteredFiles.map(file => {
          const link = `http://localhost:3000/uploads/${file.name}`;
          return (
            <div
              key={file.name}
              style={{
                width: '150px',
                border: '1px solid #ddd',
                borderRadius: '8px',
                padding: '10px',
                background: '#fff',
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
              }}
            >
              {isImage(file.name) ? (
                <img
                  src={link}
                  alt={file.name}
                  style={{ width: '100%', height: 'auto', borderRadius: '4px' }}
                />
              ) : (
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
                  <span>Non image</span>
                </div>
              )}
              <p style={{ fontSize: '0.8em', marginTop: '8px' }}>{file.name}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ControlCenter;
