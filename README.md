# 💬 Chat App

A **Realtime Chat Application** built with **NodeJS** (backend) and **ReactJS** (frontend), featuring authentication, file upload, and real-time messaging using **Socket.io**.

## 🚀 Features

- 🔐 **Authentication & Authorization**:  
  - JWT-based auth.  
  - Secure password hashing with bcryptjs.

- 💬 **Realtime Chat**:  
  - Bi-directional messaging using Socket.io.  
  - Typing indicators and message status.

- 📁 **File Uploads**:  
  - Image upload & storage via **Cloudinary**.

- 🔒 **Security & Validation**:  
  - Input validation with express-validator.  
  - Data encryption using crypto-js.

- 🗄️ **Database**:  
  - MongoDB (via Mongoose) for user & message data.

- 🌐 **Frontend**:  
  - Built with ReactJS + Vite.  
  - Zustand for state management.  
  - TailwindCSS + DaisyUI for responsive UI.  
  - Realtime updates with socket.io-client.

---

## 🛠 Tech Stack

| Layer       | Technologies                                                     |
|-------------|------------------------------------------------------------------|
| **Frontend**| ReactJS, Zustand, Vite, TailwindCSS, DaisyUI, Lucide-react       |
| **Backend** | NodeJS, ExpressJS, MongoDB (Mongoose), Socket.io, Cloudinary     |
| **Others**  | JWT, bcryptjs, express-validator, crypto-js, dotenv, axios       |

---

## 📸 Screenshots

*(Add your app screenshots here if available for a better look!)*

---

## 📦 Installation

### 1️⃣ Backend

```bash
git clone https://github.com/TaDat10062002/chat-app.git
cd chat-app/backend
npm install
```

Create a `.env` file with:

```env
PORT=5000
MONGO_URL=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

Start the server:

```bash
npm run dev
```

---

### 2️⃣ Frontend

```bash
cd ../frontend
npm install
npm run dev
```

---

## 🔗 Project Structure

```
chat-app/
├── backend/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   └── ...
├── frontend/
│   ├── components/
│   ├── pages/
│   └── ...
└── README.md
```

---

## 🙌 Author

**Tạ Linh Đạt**  
📧 talinhdat03@gmail.com  
🔗 [GitHub](https://github.com/TaDat10062002)
