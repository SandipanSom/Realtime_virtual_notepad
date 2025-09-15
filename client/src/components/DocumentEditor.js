import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import io from 'socket.io-client';
import UserList from './UserList';
import ShareModal from './ShareModal';

const DocumentEditor = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [content, setContent] = useState('');
  const [socket, setSocket] = useState(null);
  const [activeUsers, setActiveUsers] = useState([]);
  const [isConnected, setIsConnected] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const quillRef = useRef(null);
  const socketRef = useRef(null);

  useEffect(() => {
    // Initialize socket connection
    const newSocket = io('http://localhost:5000');
    socketRef.current = newSocket;
    setSocket(newSocket);

    newSocket.on('connect', () => {
      console.log('Connected to server');
      setIsConnected(true);
      newSocket.emit('join-document', id);
    });

    newSocket.on('disconnect', () => {
      console.log('Disconnected from server');
      setIsConnected(false);
    });

    newSocket.on('document-content', (docContent) => {
      setContent(docContent);
    });

    newSocket.on('text-change', (newContent) => {
      if (newContent !== content) {
        setContent(newContent);
      }
    });

    newSocket.on('active-users', (users) => {
      setActiveUsers(users);
    });

    newSocket.on('user-cursor', (data) => {
      // Handle cursor position from other users
      // This would require more complex implementation with Quill's selection API
    });

    newSocket.on('user-selection', (data) => {
      // Handle selection from other users
      // This would require more complex implementation with Quill's selection API
    });

    newSocket.on('user-left', (userId) => {
      setActiveUsers(prev => prev.filter(user => user.id !== userId));
    });

    return () => {
      newSocket.close();
    };
  }, [id]);


  const handleContentChange = (value) => {
    setContent(value);
    if (socket && socket.connected) {
      socket.emit('text-change', {
        documentId: id,
        content: value
      });
    }
  };

  const handleSelectionChange = (range, source, editor) => {
    if (socket && socket.connected && source === 'user') {
      socket.emit('selection-change', {
        documentId: id,
        selection: range
      });
    }
  };

  const copyDocumentLink = () => {
    const link = `${window.location.origin}/document/${id}`;
    navigator.clipboard.writeText(link);
    setShowShareModal(false);
    // You could add a toast notification here
  };

  const modules = {
    toolbar: [
      [{ 'header': [1, 2, 3, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ 'color': [] }, { 'background': [] }],
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      [{ 'indent': '-1'}, { 'indent': '+1' }],
      ['link', 'blockquote', 'code-block'],
      ['clean']
    ]
  };

  const formats = [
    'header', 'bold', 'italic', 'underline', 'strike',
    'color', 'background', 'list', 'bullet', 'indent',
    'link', 'blockquote', 'code-block'
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate('/')}
                className="text-gray-600 hover:text-gray-900 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
              </button>
              <h1 className="text-xl font-semibold text-gray-900">
                Collaborative Document
              </h1>
              <div className="flex items-center space-x-2">
                <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`}></div>
                <span className="text-sm text-gray-600">
                  {isConnected ? 'Connected' : 'Disconnected'}
                </span>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <UserList users={activeUsers} />
              <button
                onClick={() => setShowShareModal(true)}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
                </svg>
                <span>Share</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Editor */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <ReactQuill
            ref={quillRef}
            value={content}
            onChange={handleContentChange}
            onSelectionChange={handleSelectionChange}
            modules={modules}
            formats={formats}
            placeholder="Start typing your document..."
            style={{ height: '500px' }}
            theme="snow"
            preserveWhitespace={true}
          />
        </div>
      </div>

      {/* Share Modal */}
      {showShareModal && (
        <ShareModal
          documentId={id}
          onClose={() => setShowShareModal(false)}
          onCopyLink={copyDocumentLink}
        />
      )}
    </div>
  );
};

export default DocumentEditor;
