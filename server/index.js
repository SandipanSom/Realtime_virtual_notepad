const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"]
  }
});

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/collaborative-editor');

// Document Schema
const documentSchema = new mongoose.Schema({
  _id: String,
  title: String,
  content: String,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

const Document = mongoose.model('Document', documentSchema);

// Store active users for each document
const activeUsers = new Map();

// Socket.io connection handling
io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  // Join document room
  socket.on('join-document', async (documentId) => {
    socket.join(documentId);
    
    // Add user to active users
    if (!activeUsers.has(documentId)) {
      activeUsers.set(documentId, new Map());
    }
    
    const user = {
      id: socket.id,
      name: `User ${socket.id.slice(0, 6)}`,
      color: getRandomColor(),
      cursor: null
    };
    
    activeUsers.get(documentId).set(socket.id, user);
    
    // Send current document content
    try {
      const doc = await Document.findById(documentId);
      if (doc) {
        socket.emit('document-content', doc.content);
      } else {
        // Create new document if it doesn't exist
        const newDoc = new Document({
          _id: documentId,
          title: 'Untitled Document',
          content: ''
        });
        await newDoc.save();
        socket.emit('document-content', '');
      }
    } catch (error) {
      console.error('Error fetching document:', error);
    }
    
    // Send active users to all clients in the room
    io.to(documentId).emit('active-users', Array.from(activeUsers.get(documentId).values()));
  });

  // Handle text changes
  socket.on('text-change', async (data) => {
    const { documentId, content } = data;
    
    try {
      // Update document in database
      await Document.findByIdAndUpdate(documentId, {
        content: content,
        updatedAt: new Date()
      });
      
      // Broadcast changes to other users in the same document
      socket.to(documentId).emit('text-change', content);
    } catch (error) {
      console.error('Error updating document:', error);
    }
  });

  // Handle cursor position
  socket.on('cursor-position', (data) => {
    const { documentId, cursor } = data;
    
    if (activeUsers.has(documentId)) {
      const user = activeUsers.get(documentId).get(socket.id);
      if (user) {
        user.cursor = cursor;
        // Broadcast cursor position to other users
        socket.to(documentId).emit('user-cursor', {
          userId: socket.id,
          cursor: cursor,
          name: user.name,
          color: user.color
        });
      }
    }
  });

  // Handle selection
  socket.on('selection-change', (data) => {
    const { documentId, selection } = data;
    
    if (activeUsers.has(documentId)) {
      const user = activeUsers.get(documentId).get(socket.id);
      if (user) {
        user.selection = selection;
        // Broadcast selection to other users
        socket.to(documentId).emit('user-selection', {
          userId: socket.id,
          selection: selection,
          name: user.name,
          color: user.color
        });
      }
    }
  });

  // Handle disconnect
  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
    
    // Remove user from all documents
    for (const [documentId, users] of activeUsers.entries()) {
      if (users.has(socket.id)) {
        users.delete(socket.id);
        // Notify other users
        socket.to(documentId).emit('user-left', socket.id);
        // Send updated active users list
        io.to(documentId).emit('active-users', Array.from(users.values()));
      }
    }
  });
});

// Helper function to generate random colors
function getRandomColor() {
  const colors = [
    '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7',
    '#DDA0DD', '#98D8C8', '#F7DC6F', '#BB8FCE', '#85C1E9'
  ];
  return colors[Math.floor(Math.random() * colors.length)];
}

// API Routes
app.get('/api/documents/:id', async (req, res) => {
  try {
    const doc = await Document.findById(req.params.id);
    if (doc) {
      res.json(doc);
    } else {
      res.status(404).json({ error: 'Document not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

app.post('/api/documents', async (req, res) => {
  try {
    const { title } = req.body;
    const doc = new Document({
      _id: require('uuid').v4(),
      title: title || 'Untitled Document',
      content: ''
    });
    await doc.save();
    res.json(doc);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
