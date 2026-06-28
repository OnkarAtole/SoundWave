# 🎵 Media Player Application

A full-stack MERN-based music streaming application that allows users to browse, play, search, and organize songs while providing administrators with secure song upload and management capabilities.

---

## 🚀 Features

### 👤 Authentication & Authorization
- User Registration & Login
- JWT-based Authentication
- Role-Based Access Control (Admin/User)
- Protected Routes
- Secure Password Hashing using bcrypt

### 🎵 Music Features
- Play/Pause Songs
- Global Music Player
- Search Songs
- Upload Songs (Admin Only)
- Cover Image Upload
- Audio Streaming
- Recently Played History
- Favorite Songs
- Playlist Management

### 📊 Dashboard
- Total Songs
- Total Users
- Total Playlists
- Total Favorites
- User Statistics

### ☁️ Cloud Storage
- Audio Upload using Cloudinary
- Cover Image Upload
- Large File Upload Support

---

# 🛠️ Tech Stack

## Frontend
- React.js
- React Router DOM
- Axios
- Context API
- Tailwind CSS

## Backend
- Node.js
- Express.js
- JWT Authentication
- bcrypt.js
- Multer
- Cloudinary

## Database
- MongoDB
- Mongoose

---



# ⚙️ Installation

## Clone Repository

```bash
git clone https://github.com/OnkarAtole/SoundWave.git
```

Move into project

```bash
cd media-player-app
```

---

# Backend Setup

```bash
cd server
npm install
```

Create `.env`

```env
PORT=5000

MONGO_URL=your_mongodb_connection_string

JWT_SECRET=your_secret_key
JWT_EXPIRES_IN=1d

CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

Start Server

```bash
npm run dev
```

---

# Frontend Setup

```bash
cd client

npm install

npm run dev
```

---

# API Endpoints

## Authentication

```
POST /api/auth/register

POST /api/auth/login

GET /api/auth/profile
```

## Songs

```
GET /api/songs

GET /api/songs/:id

POST /api/songs

DELETE /api/songs/:id

GET /api/songs/search
```

## Favorites

```
POST /api/favorites/:songId

GET /api/favorites
```

## Playlists

```
POST /api/playlists

GET /api/playlists

PUT /api/playlists/:id

DELETE /api/playlists/:id
```

## History

```
POST /api/history

GET /api/history
```

## Dashboard

```
GET /api/dashboard
```

---

# User Roles

## User

- Register/Login
- Browse Songs
- Search Songs
- Play Music
- Manage Favorites
- Create Playlists
- View Recently Played

## Admin

Includes all User permissions plus:

- Upload Songs
- Upload Cover Images
- Delete Songs
- Manage Music Library

---

# Screenshots

- Login Page
- Register Page
- Home Page
- Music Player
- Playlist Page
- Favorites Page
- Dashboard
- Upload Song Page

(Add screenshots here)

---

# Future Improvements

- Lyrics Support
- Dark/Light Theme
- Audio Waveform Visualization
- Comments & Likes
- Song Recommendations
- Shuffle & Repeat
- Social Sharing
- Real-Time Notifications
- Progressive Web App (PWA)
- Mobile Responsive Improvements

---

# Author

**Onkar Atole**

GitHub:
https://github.com/OnkarAtole

LinkedIn:
https://www.linkedin.com/in/onkar-atole-524a47276/

Email:
atoleonkar24@gmail.com

---

## ⭐ If you like this project, don't forget to star the repository!
