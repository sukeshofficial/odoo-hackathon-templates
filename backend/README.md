# 🔐 Authentication Backend (Node.js + Express + PostgreSQL)

This is a production-ready authentication backend built using **Node.js, Express, PostgreSQL**, and **JWT (HttpOnly cookies)**.

It supports:
- User registration & login
- Secure JWT authentication
- Session persistence via cookies
- Protected routes
- Forgot & reset password flow with **real Gmail email delivery**

---

## 🚀 Tech Stack

- **Node.js**
- **Express**
- **PostgreSQL**
- **pg** (Postgres client)
- **bcrypt** (password hashing)
- **jsonwebtoken (JWT)**
- **Nodemailer** (email sending)
- **crypto** (secure token generation)

---

## 📂 Folder Structure

```
backend/
├── src/
│   ├── controllers/
│   │   └── auth.controller.js
│   ├── routes/
│   │   └── auth.routes.js
│   ├── middleware/
│   │   └── auth.middleware.js
│   ├── utils/
│   │   └── sendEmail.js
│   ├── config/
│   │   ├── db.js
│   │   └── migrate.js
│   └── server.js
├── .env
└── package.json

````

---

## ⚙️ Environment Variables

Create a `.env` file in the backend root:

```env
PORT=5000
DATABASE_URL=postgresql://username:password@localhost:5432/dbname
JWT_SECRET=your_jwt_secret

EMAIL_USER=yourgmail@gmail.com
EMAIL_PASS=your_gmail_app_password
FRONTEND_URL=http://localhost:5173
````

---

## 🛠️ Database Schema

### `users` table

```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  reset_token TEXT,
  reset_token_expiry TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

---

## 🔑 API Endpoints

### Auth Routes (`/api/auth`)

| Method | Endpoint                 | Description                     |
| ------ | ------------------------ | ------------------------------- |
| POST   | `/register`              | Register a new user             |
| POST   | `/login`                 | Login & set HttpOnly JWT cookie |
| POST   | `/logout`                | Clear auth cookie               |
| GET    | `/me`                    | Restore session from cookie     |
| POST   | `/forgot-password`       | Send reset link to email        |
| POST   | `/reset-password/:token` | Reset password                  |

---

## 🔐 Security Features

* Passwords hashed using **bcrypt**
* JWT stored in **HttpOnly cookies**
* CSRF-safe cookie configuration
* Reset tokens are:

  * Cryptographically random
  * Hashed before storing
  * Expire after 15 minutes
  * Single-use only
* Email enumeration protection

---

## ▶️ Running the Backend

```bash
npm install
npm run dev
```

Backend runs on:

```
http://localhost:5000
```

---

## 🧪 Testing

* Use **Postman** for API testing
* Use browser DevTools → Application → Cookies to verify auth cookie
* Email reset links are delivered via Gmail using Nodemailer

---

## 📌 Notes

* Designed for **cookie-based authentication**
* Works seamlessly with React frontend
* Production-ready architecture

---