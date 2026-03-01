# 🧩 Maze – MERN Stack Application  

![Node.js](https://img.shields.io/badge/Node.js-18+-green)
![MongoDB](https://img.shields.io/badge/MongoDB-Database-brightgreen)
![React](https://img.shields.io/badge/React-Vite-blue)
![Express](https://img.shields.io/badge/Express-Backend-lightgrey)
![License](https://img.shields.io/badge/License-MIT-yellow)

A full-stack MERN application featuring:

- 🎮 User Frontend  
- 🔐 Admin Dashboard  
- ⚙️ REST API Backend  
- ☁️ Cloudinary image upload  
- 🔑 JWT Authentication  

---

## 📌 Features

- User authentication (JWT-based)
- Admin authentication
- Secure API routes
- Image upload via Cloudinary
- Modular folder structure
- Environment-based configuration

---

## 🏗️ Project Structure

```
maze/
│
├── frontend/    # React (Vite) User Application
├── backend/     # Node.js + Express API
├── admin/       # React (Vite) Admin Panel
```

---

## 🚀 Getting Started

### 1️⃣ Prerequisites

Make sure you have installed:

- Node.js (v18+ recommended)
- MongoDB (Local installation or MongoDB Atlas)

---

### 2️⃣ Clone the Repository

```bash
git clone https://github.com/<your-username>/maze.git
cd maze
```

---

## ⚙️ Backend Setup

```bash
cd backend
npm install
```

### Create `.env` file inside `/backend`

```env
MONGODB_URI="<your-mongodb-url>"

CLOUDINARY_API_KEY="<your-cloudinary-api-key>"
CLOUDINARY_API_SECRET="<your-cloudinary-secret>"
CLOUDINARY_NAME="<your-cloudinary-name>"

JWT_SECRET="<your-jwt-secret>"

ADMIN_EMAIL="<admin-email>"
ADMIN_PASSWORD="<admin-password>"
```

### Start Backend

```bash
npm run server
```

Backend runs at:
```
http://localhost:3000
```

---

## 💻 Frontend Setup

```bash
cd frontend
npm install
```

### Create `.env` file inside `/frontend`

```env
VITE_BACKEND_URL="http://localhost:3000"
```

### Start Frontend

```bash
npm run dev
```

---

## 🛡️ Admin Panel Setup

```bash
cd admin
npm install
```

### Create `.env` file inside `/admin`

```env
VITE_BACKEND_URL="http://localhost:3000"
```

### Start Admin Panel

```bash
npm run dev
```

---

## 🔐 Environment Variables

| Variable | Description |
|-----------|-------------|
| MONGODB_URI | MongoDB connection string |
| CLOUDINARY_API_KEY | Cloudinary API key |
| CLOUDINARY_API_SECRET | Cloudinary secret |
| CLOUDINARY_NAME | Cloudinary cloud name |
| JWT_SECRET | JWT authentication secret |
| ADMIN_EMAIL | Default admin email |
| ADMIN_PASSWORD | Default admin password |
| VITE_BACKEND_URL | Backend API URL |

---

## 🧪 Development Workflow

1. Start MongoDB (if local)
2. Run backend (`npm run server`)
3. Run frontend (`npm run dev`)
4. Run admin panel (`npm run dev`)

---

## 🌍 Recommended Deployment

- Frontend & Admin: Vercel / Netlify  
- Backend: Render / Railway  
- Database: MongoDB Atlas  
- Media Storage: Cloudinary  

Make sure to update environment variables in production.

---

## 📸 Screenshots (Optional)

Add screenshots for better GitHub presentation:

```
![Homepage](./screenshots/home.png)
![Admin Dashboard](./screenshots/admin.png)
```

---

## 🤝 Contributing

1. Fork the repository  
2. Create a feature branch  
3. Commit changes  
4. Open a Pull Request  

---

## 📄 License

This project is licensed under the MIT License.
