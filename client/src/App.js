import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import DocumentEditor from './components/DocumentEditor';
import HomePage from './components/HomePage';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App min-h-screen bg-gray-50">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/document/:id" element={<DocumentEditor />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
