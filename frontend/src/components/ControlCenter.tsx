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

  return (
    <div>
      <h2>Control Center</h2>
      <input
        type="text"
        placeholder="Rechercher par nom..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        style={{ padding: '10px', width: '80%', fontSize: '1em', margin: '20px 0' }}
      />
      <div>
        {filteredFiles.map(file => {
          const link = `http://localhost:3000/uploads/${file.name}`;
          return (
            <div key={file.name} style={{ padding: '10px', borderBottom: '1px solid #ddd', textAlign: 'left' }}>
              <strong>{file.name}</strong> - <a href={link} target="_blank" rel="noopener noreferrer">{link}</a>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ControlCenter;
