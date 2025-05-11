# YourTube - A YouTube Clone

YourTube is a full-stack YouTube clone built with React and Node.js, featuring video upload, playback, user channels, and real-time video calls.

## Features

- Video Upload & Management
- User Channels & Subscriptions
- Video Playback with Controls
- Like/Dislike & Save Videos
- Watch History
- Watch Later
- Real-time Video Calls
- Responsive Design

## Tasks given by NullClass

- Video Quality Feature
- Download and Premium Feature
- VoIP Feature

## Implementation

### Video Quality Feature

#### Server-Side (Node.js)
- Uses FFmpeg for video processing
- Generates multiple quality versions during upload
- Stores processed videos in `uploads/qualities/` directory
- Saves quality metadata in MongoDB
- Quality versions named as: `${videoId}-${quality}.mp4`

#### Frontend (React)
- VideoPlayer component with quality selector
- Dynamic video source URL generation
- Smooth quality switching without page reload
- Quality state management using React hooks

### Technical Stack
- FFmpeg for video processing
- React for frontend UI
- Node.js with Express for backend
- MongoDB for video metadata storage
---
### Download and Premium Feature

##### Frontend (React)
- GoPremiumModal component for subscription
- Download button visibility based on:
  - User login status
  - Premium status
  - Daily download limit
- Premium button integration
- Modal handling for subscription

##### Backend (Node.js)
- Download endpoint with authentication
- Premium status verification
- File streaming for downloads
- Download limit tracking
- Error handling for:
  - User authentication
  - Premium status
  - File existence
  - Download limits

##### Technical Implementation
- File streaming for downloads
- Quality selection (720p only for downloads)
- Authentication middleware
- Premium status verification
- Download limit tracking (commented out in current code)
---
### VoIP Feature

##### Frontend (React)
- CallRoom component with:
  - Local and remote video display
  - Screen sharing interface
  - Recording controls
  - Audio/video controls

##### WebRTC
- STUN server configuration
- Socket.IO for signaling
- Peer-to-peer connection handling
- Media stream management

##### Features
- Screen sharing
- Audio/video controls
- Call recording
- Multiple user support


## Tech Stack

### Frontend
- React.js
- Redux for State Management
- React Router for Navigation
- Socket.IO for Real-time Communication
- Styled Components for Styling

### Backend
- Node.js with Express
- MongoDB for Database
- FFmpeg for Video Processing
- Socket.IO for Real-time Features

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- MongoDB
- FFmpeg

### Installation

1. Clone the repository:
```bash
git clone [https://github.com/yourusername/yourtube.git](https://github.com/yourusername/yourtube.git)
cd yourtube
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
# Client .env
REACT_APP_API_URL=http://localhost:5000

# Server .env
PORT=5000
MONGODB_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
```

4.Start the application:
```bash
# Start the server
cd Server
npm start

# In a new terminal, start the client
cd client
npm start
```

### Project Structure

```
YourTube/
├── Server/                         # Backend Node.js Application
│   ├── Controllers/               # API Controllers
│   │   ├── Auth.js               # Authentication controller
│   │   ├── Comment.js            # Comment management
│   │   ├── History.js            # View history
│   │   ├── channel.js            # Channel management
│   │   ├── like.js               # Like management
│   │   ├── likedvideo.js         # Liked videos
│   │   ├── paymentController.js  # Payment processing
│   │   ├── video.js              # Video management
│   │   └── views.js              # View tracking
│   │
│   ├── Helper/                   # Helper Functions
│   │   └── filehelper.js         # File handling utilities
│   │
│   ├── Models/                   # Database Models
│   │   ├── Auth.js               # User authentication
│   │   ├── comment.js            # Comment schema
│   │   ├── history.js            # View history
│   │   ├── likevideo.js          # Like tracking
│   │   ├── videofile.js          # Video storage
│   │   └── watchlater.js         # Watch later list
│   │
│   ├── Routes/                   # API Routes
│   │   ├── User.js               # User routes
│   │   ├── comment.js            # Comment routes
│   │   └── video.js              # Video routes
│   │
│   ├── middleware/               # Express Middleware
│   │   └── auth.js              # Authentication middleware
│   │
│   ├── uploads/                  # Video Upload Directory
│   ├── index.js                 # Server Entry Point
│   ├── package.json
│   └── .env                     # Environment Variables
│
└── client/                        # Frontend React Application
    ├── src/
    │   ├── Component/            # Reusable React Components
    │   │   ├── Comment/         # Comment components
    │   │   │   ├── Comment.css
    │   │   │   ├── Comment.jsx
    │   │   │   └── Displaycommment.jsx
    │   │   │
    │   │   ├── GoPremiumButton.jsx  # Premium subscription
    │   │   │
    │   │   ├── Leftsidebar/     # Sidebar components
    │   │   │   ├── Drawersliderbar.jsx
    │   │   │   ├── Leftsidebar.css
    │   │   │   └── Leftsidebar.jsx
    │   │   │
    │   │   ├── Navbar/          # Navigation components
    │   │   │   ├── Navbar.css
    │   │   │   ├── Navbar.jsx
    │   │   │   ├── Searchbar/
    │   │   │   │   ├── Searchbar.css
    │   │   │   │   ├── Searchbar.jsx
    │   │   │   │   ├── Searchlist.css
    │   │   │   │   └── Searchlist.jsx
    │   │   │
    │   │   ├── Showvideo/       # Video display
    │   │   │   ├── Showvideo.css
    │   │   │   └── Showvideo.jsx
    │   │   │
    │   │   ├── Showvideogrid/   # Video grid
    │   │   │   ├── Showvideogrid.css
    │   │   │   └── Showvideogrid.jsx
    │   │   │
    │   │   ├── Showvideolist/   # Video list
    │   │   │   └── Showvideolist.jsx
    │   │   │
    │   │   ├── Video/           # Video player
    │   │   │   ├── GoPremiumModal.css
    │   │   │   ├── GoPremiumModal.jsx
    │   │   │   ├── VideoPlayer.css
    │   │   │   └── VideoPlayer.jsx
    │   │   │
    │   │   └── WHL/             # Watch History/Later
    │   │       ├── WHL.css
    │   │       ├── WHL.jsx
    │   │       └── WHLvideolist.jsx
    │   │
    │   ├── Pages/               # Page Components
    │   │   ├── Auth/           # Authentication
    │   │   │   ├── Auth.css
    │   │   │   └── Auth.jsx
    │   │   │
    │   │   ├── CallRoom/       # Video Call
    │   │   │   ├── CallRoom.css
    │   │   │   └── CallRoom.jsx
    │   │   │
    │   │   ├── Channel/        # Channel pages
    │   │   │   ├── Channel.jsx
    │   │   │   ├── Createeditchannel.css
    │   │   │   ├── Createeditchannel.jsx
    │   │   │   ├── Describechannel.css
    │   │   │   └── Describechannel.jsx
    │   │   │
    │   │   ├── Home/          # Home page
    │   │   │   ├── Home.css
    │   │   │   └── Home.jsx
    │   │   │
    │   │   ├── Library/       # Library page
    │   │   │   ├── Library.css
    │   │   │   └── Library.jsx
    │   │   │
    │   │   ├── Likedvideo/    # Liked videos
    │   │   │   └── Likedvideo.jsx
    │   │   │
    │   │   ├── Search/        # Search page
    │   │   │   └── Search.jsx
    │   │   │
    │   │   ├── Videopage/     # Video page
    │   │   │   ├── Likewatchlatersavebtn.css
    │   │   │   ├── Likewatchlatersavebtns.jsx
    │   │   │   ├── Videopage.css
    │   │   │   └── Videopage.jsx
    │   │   │
    │   │   ├── Videoupload/   # Video upload
    │   │   │   ├── Videoupload.css
    │   │   │   └── Videoupload.jsx
    │   │   │
    │   │   └── Yourvideo/     # User's videos
    │   │       └── Yourvideo.jsx
    │   │
    │   ├── Reducers/          # Redux Reducers
    │   │   ├── authReducer.js
    │   │   ├── videoReducer.js
    │   │   └── ...
    │   │
    │   ├── action/            # Redux Actions
    │   │   ├── authActions.js
    │   │   ├── videoActions.js
    │   │   └── ...
    │   │
    │   ├── Api/              # API Service Layer
    │   │   └── index.js
    │   │
    │   ├── Allroutes.jsx     # Route Configuration
    │   ├── App.js            # Main App Component
    │   ├── App.css           # App Styles
    │   ├── index.js          # Client Entry Point
    │   ├── index.css         # Global Styles
    │   └── logo.svg          # App Logo
    │
    ├── public/              # Static Assets
    │   └── uploads/        # Client-side Video Thumbnails
    │
    ├── package.json        # Frontend Dependencies
    ├── .env               # Frontend Environment Variables
    └── .gitignore        # Git Ignore Rules
```

### API Endpoints
```bash
POST /api/videos/upload - Upload video
GET /api/videos - Get all videos
GET /api/videos/:id - Get video by ID
DELETE /api/videos/:id - Delete video
```

### User Management
```bash
POST /api/auth/register - Register new user
POST /api/auth/login - Login user
GET /api/auth/user - Get current user
```

### Real-time Features
```bash
GET /api/call - Video call socket connection
POST /api/call/start - Start video call
POST /api/call/stop - End video call
```

### Contributing
1. Fork the repository
2. Create your feature branch (git checkout -b feature/AmazingFeature)
3. Commit your changes (git commit -m 'Add some AmazingFeature')
4. Push to the branch (git push origin feature/AmazingFeature)
5. Open a Pull Request

### License
This project is licensed under the MIT License - see the LICENSE file for details

### Acknowledgments
1. React Router for routing
2. Socket.IO for real-time features
3. FFmpeg for video processing
