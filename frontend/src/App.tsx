import React from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import Upload from './components/Upload';
import Download from './components/Download';
import ControlCenter from './components/ControlCenter';

const App: React.FC = () => {
  return (
    <div className="container">
      <header>
        <h1>CDN API</h1>
        <nav>
          <Link to="/upload">Upload</Link> |{' '}
          <Link to="/download">Download</Link> |{' '}
          <Link to="/view">Control Center</Link>
        </nav>
      </header>
      <main>
        <Routes>
          <Route path="/upload" element={<Upload />} />
          <Route path="/download" element={<Download />} />
          <Route path="/view" element={<ControlCenter />} />
          <Route path="*" element={<Upload />} />
        </Routes>
      </main>
      <footer>&copy; CDN API Demo</footer>
    </div>
  );
};

export default App;
