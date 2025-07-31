# 🔐 MERN 2FA Authentication App

This is a full-stack authentication system using **MERN** stack with **Two-Factor Authentication (2FA)** using OTPs generated via Google Authenticator. Built with **Node.js**, **Express**, **MongoDB**, **React**, **TailwindCSS**, and **Speakeasy**.

---

## 🚀 Tech Stack

- **Frontend**: React, Vite, Tailwind CSS
- **Backend**: Node.js, Express, Passport.js
- **Authentication**: Passport-local + 2FA (Speakeasy + QR Code)
- **Database**: MongoDB (via Mongoose)
- **Testing**: Postman
- **Session Handling**: express-session + cookie-based login

---

## ✅ Features

- 👤 User registration and login
- 🔐 Session-based authentication with Passport.js
- 📲 Two-Factor Authentication using QR code and Google Authenticator
- 📷 QR Code generation using `qrcode` npm package
- ✅ OTP verification via `speakeasy`
- 🔄 Option to reset 2FA
- 🔒 Protected dashboard route (post-login + OTP verified)

---

## 🧪 How 2FA Works

1. User registers via `/register`
2. Logs in with username and password
3. Server responds with a **QR code**
4. User scans it using **Google Authenticator**
5. Enters the generated **6-digit OTP**
6. If valid → allowed into the **main dashboard**

---

## 📦 Installation

```bash
git clone https://github.com/yourusername/2fa-authentication-app.git
cd 2fa-authentication-app
