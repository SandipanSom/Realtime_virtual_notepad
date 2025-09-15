# Collaborative Document Editor

A real-time collaborative document editor that enables multiple users to edit simultaneously with synchronized changes.

## Features

- ✅ **Real-time synchronization** - See changes as they happen
- ✅ **Live user presence** - See who's currently editing
- ✅ **Rich text editing** - Bold, italic, headers, lists, and more
- ✅ **Document sharing** - Share via URL
- ✅ **Modern UI** - Clean, responsive design
- ✅ **User cursors** - Track other users' cursor positions

## Tech Stack

### Frontend
- **React** - UI framework
- **Tailwind CSS** - Styling
- **React Quill** - Rich text editor
- **Socket.io Client** - Real-time communication
- **React Router** - Navigation

### Backend
- **Node.js + Express** - Server framework
- **Socket.io** - Real-time communication
- **MongoDB** - Document storage
- **Mongoose** - Database modeling

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or MongoDB Atlas)

### Installation

1. **Install dependencies for all packages:**
   ```bash
   npm run install-all
   ```

2. **Set up environment variables:**
   - Copy `server/.env` and update `MONGODB_URI` if needed
   - Default MongoDB URI: `mongodb://localhost:27017/collaborative-editor`

3. **Start the development servers:**
   ```bash
   npm run dev
   ```

   This will start:
   - Backend server on `http://localhost:5000`
   - Frontend development server on `http://localhost:3000`

### Usage

1. **Open your browser** and go to `http://localhost:3000`
2. **Create a new document** or **join an existing one** using a document ID
3. **Share the document URL** with others to collaborate
4. **Start editing** - changes will sync in real-time!

## Project Structure

```
collaborative-editor/
├── client/                 # React frontend
│   ├── public/
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── App.js         # Main app component
│   │   └── index.js       # Entry point
│   └── package.json
├── server/                 # Express backend
│   ├── index.js           # Server entry point
│   ├── .env              # Environment variables
│   └── package.json
├── package.json           # Root package.json
└── README.md
```

## API Endpoints

- `GET /api/documents/:id` - Get document by ID
- `POST /api/documents` - Create new document

## Socket Events

### Client → Server
- `join-document` - Join a document room
- `text-change` - Send text changes
- `cursor-position` - Send cursor position
- `selection-change` - Send selection changes

### Server → Client
- `document-content` - Receive document content
- `text-change` - Receive text changes from others
- `active-users` - Receive list of active users
- `user-cursor` - Receive cursor position from other users
- `user-selection` - Receive selection from other users
- `user-left` - User disconnected

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

MIT License - see LICENSE file for details
