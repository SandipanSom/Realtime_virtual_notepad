import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';

const HomePage = () => {
  const [documentId, setDocumentId] = useState('');
  const navigate = useNavigate();

  const createNewDocument = () => {
    const newId = uuidv4();
    navigate(`/document/${newId}`);
  };

  const joinDocument = () => {
    if (documentId.trim()) {
      navigate(`/document/${documentId.trim()}`);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Collaborative Editor
          </h1>
          <p className="text-gray-600">
            Create or join a document to start collaborating in real-time
          </p>
        </div>

        <div className="space-y-6">
          {/* Create New Document */}
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl p-6 text-white">
            <h2 className="text-xl font-semibold mb-3">Create New Document</h2>
            <p className="text-blue-100 mb-4">
              Start a new collaborative document and share the link with others
            </p>
            <button
              onClick={createNewDocument}
              className="w-full bg-white text-blue-600 font-semibold py-3 px-4 rounded-lg hover:bg-gray-100 transition-colors duration-200"
            >
              Create Document
            </button>
          </div>

          {/* Join Existing Document */}
          <div className="bg-white border-2 border-gray-200 rounded-xl p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-3">
              Join Existing Document
            </h2>
            <p className="text-gray-600 mb-4">
              Enter a document ID to join an existing collaborative session
            </p>
            <div className="space-y-3">
              <input
                type="text"
                value={documentId}
                onChange={(e) => setDocumentId(e.target.value)}
                placeholder="Enter document ID..."
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                onKeyPress={(e) => e.key === 'Enter' && joinDocument()}
              />
              <button
                onClick={joinDocument}
                disabled={!documentId.trim()}
                className="w-full bg-blue-600 text-white font-semibold py-3 px-4 rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors duration-200"
              >
                Join Document
              </button>
            </div>
          </div>
        </div>

        {/* Features */}
        <div className="mt-8 pt-6 border-t border-gray-200">
          <h3 className="text-lg font-semibold text-gray-800 mb-3">
            Features
          </h3>
          <ul className="space-y-2 text-sm text-gray-600">
            <li className="flex items-center">
              <span className="w-2 h-2 bg-green-500 rounded-full mr-3"></span>
              Real-time text synchronization
            </li>
            <li className="flex items-center">
              <span className="w-2 h-2 bg-green-500 rounded-full mr-3"></span>
              Live cursor tracking
            </li>
            <li className="flex items-center">
              <span className="w-2 h-2 bg-green-500 rounded-full mr-3"></span>
              User presence indicators
            </li>
            <li className="flex items-center">
              <span className="w-2 h-2 bg-green-500 rounded-full mr-3"></span>
              Rich text editing
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
