import React, { useEffect, useState } from 'react';

type FileData = {
  name: string;
  size: number;
  date: string;
};

const Download: React.FC = () => {
  const [files, setFiles] = useState<FileData[]>([]);

  useEffect(() => {
    fetch('http://localhost:3000/api/files')
      .then(response => response.json())
      .then(data => setFiles(data));
  }, []);

  const sortFiles = (field: 'name' | 'size' | 'date') => {
    const sorted = [...files].sort((a, b) => {
      if (field === 'size') {
        return a.size - b.size;
      } else if (field === 'date') {
        return new Date(a.date).getTime() - new Date(b.date).getTime();
      } else {
        return a.name.localeCompare(b.name);
      }
    });
    setFiles(sorted);
  };

  return (
    <div>
      <h2>Liste des fichiers</h2>
      <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '20px' }}>
        <thead>
          <tr>
            <th style={{ padding: '10px', border: '1px solid #ddd', cursor: 'pointer' }} onClick={() => sortFiles('name')}>Nom</th>
            <th style={{ padding: '10px', border: '1px solid #ddd', cursor: 'pointer' }} onClick={() => sortFiles('size')}>Taille (octets)</th>
            <th style={{ padding: '10px', border: '1px solid #ddd', cursor: 'pointer' }} onClick={() => sortFiles('date')}>Date</th>
            <th style={{ padding: '10px', border: '1px solid #ddd' }}>Lien</th>
          </tr>
        </thead>
        <tbody>
          {files.map((file) => (
            <tr key={file.name}>
              <td style={{ padding: '10px', border: '1px solid #ddd' }}>{file.name}</td>
              <td style={{ padding: '10px', border: '1px solid #ddd' }}>{file.size}</td>
              <td style={{ padding: '10px', border: '1px solid #ddd' }}>{new Date(file.date).toLocaleString()}</td>
              <td style={{ padding: '10px', border: '1px solid #ddd' }}>
                <a href={`http://localhost:3000/uploads/${file.name}`} target="_blank" rel="noopener noreferrer">
                  Voir
                </a>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Download;
