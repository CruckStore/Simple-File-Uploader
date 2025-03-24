import React, { useEffect, useState } from 'react';

type FileData = {
  name: string;
  size: number;
  date: string;
};

type SortField = 'name' | 'size' | 'date';

type SortConfig = {
  field: SortField;
  order: 'asc' | 'desc';
};

const Download: React.FC = () => {
  const [files, setFiles] = useState<FileData[]>([]);
  const [sortConfig, setSortConfig] = useState<SortConfig | null>(null);

  useEffect(() => {
    fetch('http://localhost:3000/api/files')
      .then(response => response.json())
      .then(data => setFiles(data));
  }, []);

  const formatBytes = (bytes: number, decimals = 2): string => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
  };

  const sortFiles = (field: SortField, order: 'asc' | 'desc') => {
    const sorted = [...files].sort((a, b) => {
      let result = 0;
      if (field === 'size') {
        result = a.size - b.size;
      } else if (field === 'date') {
        result = new Date(a.date).getTime() - new Date(b.date).getTime();
      } else {
        result = a.name.localeCompare(b.name);
      }
      return order === 'asc' ? result : -result;
    });
    setFiles(sorted);
  };

  const handleSort = (field: SortField) => {
    let newOrder: 'asc' | 'desc';
    if (sortConfig && sortConfig.field === field) {
      newOrder = sortConfig.order === 'asc' ? 'desc' : 'asc';
    } else {
      // Par défaut, pour la date on veut du plus récent au moins récent (descendant)
      newOrder = field === 'date' ? 'desc' : 'asc';
    }
    setSortConfig({ field, order: newOrder });
    sortFiles(field, newOrder);
  };

  const getSortIndicator = (field: SortField) => {
    if (sortConfig?.field === field) {
      return sortConfig.order === 'asc' ? '↑' : '↓';
    }
    return '';
  };

  return (
    <div>
      <h2>Liste des fichiers</h2>
      <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '20px' }}>
        <thead>
          <tr>
            <th
              style={{ padding: '10px', border: '1px solid #ddd', cursor: 'pointer' }}
              onClick={() => handleSort('name')}
            >
              Nom {getSortIndicator('name')}
            </th>
            <th
              style={{ padding: '10px', border: '1px solid #ddd', cursor: 'pointer' }}
              onClick={() => handleSort('size')}
            >
              Taille {getSortIndicator('size')}
            </th>
            <th
              style={{ padding: '10px', border: '1px solid #ddd', cursor: 'pointer' }}
              onClick={() => handleSort('date')}
            >
              Date {getSortIndicator('date')}
            </th>
            <th style={{ padding: '10px', border: '1px solid #ddd' }}>Lien</th>
          </tr>
        </thead>
        <tbody>
          {files.map((file) => (
            <tr key={file.name}>
              <td style={{ padding: '10px', border: '1px solid #ddd' }}>{file.name}</td>
              <td style={{ padding: '10px', border: '1px solid #ddd' }}>{formatBytes(file.size)}</td>
              <td style={{ padding: '10px', border: '1px solid #ddd' }}>
                {new Date(file.date).toLocaleString()}
              </td>
              <td style={{ padding: '10px', border: '1px solid #ddd' }}>
                <a
                  href={`http://localhost:3000/uploads/${file.name}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
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
