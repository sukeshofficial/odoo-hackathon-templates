# 🖥️ Authentication Frontend (React + Vite)

This is a modern, clean **React authentication frontend** built using **Vite**.  
It integrates with a Node.js backend using **cookie-based JWT authentication**.

---

## 🚀 Tech Stack

- **React**
- **Vite**
- **React Router**
- **Axios**
- **Context API**
- **Pure CSS (Light Mode, SaaS-style UI)**

---

## 📂 Folder Structure

````

frontend/
├── src/
│   ├── api/
│   │   ├── api.js
│   │   └── auth.js
│   ├── context/
│   │   ├── AuthContext.jsx
│   │   └── useAuth.js
│   ├── components/
│   │   ├── Navbar.jsx
│   │   └── ProtectedRoute.jsx
│   ├── pages/
│   │   ├── Login.jsx
│   │   ├── Register.jsx
│   │   ├── Dashboard.jsx
│   │   ├── ForgotPassword.jsx
│   │   └── ResetPassword.jsx
│   ├── styles/
│   │   ├── index.css
│   │   ├── App.css
│   │   ├── auth.css
│   │   ├── navbar.css
│   │   └── dashboard.css
│   ├── App.jsx
│   └── main.jsx
└── package.json

````

---

## 🔐 Authentication Flow

- Login sets JWT in **HttpOnly cookie**
- On page refresh:
  - Frontend calls `/api/auth/me`
  - Backend validates cookie
  - User session is restored
- Protected routes redirect unauthenticated users
- Logout clears cookie securely

---

## 🌐 Routes

| Route | Description |
|-----|------------|
| `/login` | Login page |
| `/register` | Registration page |
| `/forgot-password` | Request password reset |
| `/reset-password/:token` | Reset password |
| `/` | Protected dashboard |

---

## ⚙️ Axios Configuration

All API calls use a single Axios instance with cookies enabled:

```js
const api = axios.create({
  baseURL: "http://localhost:5000",
  withCredentials: true,
});
````

---

## ▶️ Running the Frontend

```bash
npm install
npm run dev
```

Frontend runs on:

```
http://localhost:5173
```

---

## 🎨 UI Features

* Clean **light-mode** SaaS-style UI
* Responsive layout
* Accessible form inputs
* Loading & error states
* Modular CSS (no framework lock-in)

---

## 📌 Notes

* No JWT stored in localStorage (security-first)
* Backend-driven session validation
* Easy to extend with roles, permissions, or refresh tokens

---