# ProTask — IT Project Management System

A full-stack task management web application built with React, Node.js, and PostgreSQL.

## 🔗 Live Links
- **Frontend:** https://webapp-two-teal-79.vercel.app
- **Backend API:** https://webapp-production-d767.up.railway.app
- **API Docs:** https://webapp-production-d767.up.railway.app/api-docs

## 🛠️ Technologies Used

### Frontend
- React + Vite
- Tailwind CSS
- Axios
- React Router DOM
- Socket.io Client

### Backend
- Node.js + Express.js
- Prisma ORM v5
- PostgreSQL (Supabase)
- JWT Authentication
- bcryptjs
- Socket.io
- Swagger UI

## 👥 Roles
- **Admin** — Full system access, user management
- **Project Manager** — Create and manage tasks, assign to users
- **Collaborator** — View and update assigned tasks

## 🚀 Setup Instructions

### Prerequisites
- Node.js v18+
- PostgreSQL database (Supabase)

### Backend Setup
```bash
cd backend
npm install
cp .env.example .env
# Add your DATABASE_URL and JWT_SECRET to .env
npx prisma db push
npm run dev
```

### Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

## 📁 Folder Structure
task-management-system/
├── backend/
│   ├── src/
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── routes/
│   │   └── index.js
│   ├── prisma/
│   │   └── schema.prisma
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── api/
│   │   ├── components/
│   │   ├── context/
│   │   ├── pages/
│   │   └── App.jsx
│   └── package.json
└── README.md

## ✨ Features
- ✅ User authentication with JWT
- ✅ Role-based access control (Admin, PM, Collaborator)
- ✅ Create, assign, update, delete tasks
- ✅ Real-time notifications with WebSockets
- ✅ Task filtering by status and priority
- ✅ Swagger API documentation
- ✅ Deployed on Railway + Vercel

## 🔐 Test Credentials
- Email: test@test.com
- Password: Test1234!