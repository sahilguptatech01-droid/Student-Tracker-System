# 📚 Library Management System (Backend)

A full-stack backend system for managing a library using **Node.js, Express, MongoDB, Zod, bcrypt, and JWT authentication**.

This system handles **admin login, student management, and fee tracking** with a scalable and secure architecture.

---

# 🚀 Features

## 👨‍💼 Admin Panel
- Secure admin login
- Password hashing using bcrypt
- JWT-based authentication
- Protected API routes

## 🎓 Student Management
- Add new students
- View all students
- Store student details (name, phone number, joining date)

## 💰 Fees Management
- Add monthly fee records
- Track paid / unpaid status
- Prevent duplicate fee entries for same month

## 📊 Dashboard Support
- Total students count
- Fees collection summary
- Ready for analytics integration

---

# 🏗️ Tech Stack

- Node.js
- Express.js
- MongoDB (Mongoose)
- Zod (Validation)

- JWT (Authentication)

---

# 📁 Project Structure

backend/
│
├── models/ # Database schemas (Admin, Student, Fees)
├── middleware/ # Auth & validation middleware
├── server.js



---

# 🔐 Authentication Flow

1. Admin sends login request
2. Server validates input using Zod
3. Admin is verified from database
4. Password checked using bcrypt
5. JWT token is generated
6. Token is used for accessing protected routes

---

# 🔄 API Flow

## ➤ Add Student Flow
```

Request → Zod Validation → Controller → MongoDB → Response

```

## ➤ Get Students Flow
```

JWT Auth → Fetch Data → Send Response


🧪 API Endpoints
POST   /api/admin/login
POST   /api/add_student
GET    /api/students
POST   /api/fees
GET    /api/fees_detail/:year