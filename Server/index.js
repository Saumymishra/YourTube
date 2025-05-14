import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import bodyParser from "body-parser";
import videoroutes from './Routes/video.js';
import userroutes from "./Routes/User.js";
import commentroutes from './Routes/comment.js';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import http from 'http'; // <-- NEW
import { Server } from 'socket.io'; // <-- NEW

const __dirname = dirname(fileURLToPath(import.meta.url));

dotenv.config();
const app = express();
const server = http.createServer(app); // <-- Use HTTP server for Socket.IO

// Socket.IO setup
const io = new Server(server, {
    cors: {
        origin: "https://your-tube-01.netlify.app", // your frontend origin
        methods: ["GET", "POST"]
    }
});

// Socket.IO signaling handlers
io.on('connection', socket => {
    console.log('New user connected:', socket.id);

    socket.on('join-room', roomId => {
        socket.join(roomId);
        console.log(`Socket ${socket.id} joined room ${roomId}`);
        socket.to(roomId).emit('user-joined', socket.id);
    });

    socket.on('offer', (roomId, offer) => {
        socket.to(roomId).emit('offer', offer);
    });

    socket.on('answer', (roomId, answer) => {
        socket.to(roomId).emit('answer', answer);
    });

    socket.on('ice-candidate', (roomId, candidate) => {
        socket.to(roomId).emit('ice-candidate', candidate);
    });

    socket.on('disconnect', () => {
        console.log('User disconnected:', socket.id);
    });
});

// CORS Configuration
const corsOptions = {
    origin: 'https://your-tube-01.netlify.app',
    methods: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS'],
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization'],
};

app.use(cors(corsOptions));

app.options('*', cors(corsOptions)) // ✅ Preflight handling

// Middleware for JSON body parsing
app.use(express.json({ limit: "30mb", extended: true }));
app.use(express.urlencoded({ limit: "30mb", extended: true }));

// Static file serving for uploads
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Root route
app.get('/', (req, res) => {
    res.send("YourTube is working");
});

// Additional middlewares
app.use(bodyParser.json());

// Routes
app.use('/user', userroutes);
app.use('/video', videoroutes);
app.use('/comment', commentroutes);

// Cross-Origin headers (for screen sharing, etc.)
app.use((req, res, next) => {
    res.setHeader('Cross-Origin-Opener-Policy', 'same-origin');
    res.setHeader('Cross-Origin-Embedder-Policy', 'unsafe-none');
    next();
});

// Server start
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
    console.log(`Server running on Port ${PORT}`);
});

// DB connection
const DB_URL = process.env.DB_URL;
mongoose.connect(DB_URL)
    .then(() => {
        console.log("MongoDB Database connected");
    })
    .catch((error) => {
        console.error("MongoDB connection error:", error);
    });
