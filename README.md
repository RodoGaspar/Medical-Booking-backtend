## Medical Appointment Booking System – Backend API

This is the backend for the Medical Appointment Booking System.
It provides secure admin authentication, CRUD operations for appointments, email notifications, and integrations for a frontend client.

---

## 🚀 Features
 - RESTful API using Express
 - Appointment creation, reading, updating, and deletion
 - Secure Admin Login using:
 - JWT
 - HttpOnly Cookies
 - Email notifications for:
 - Patients
 - Doctors
 - MongoDB & Mongoose integration
 - CORS configured for frontend integration
 - Global error handling middleware

## 📁 Tech Stack
 - Node.js
 - Express.js
 - MongoDB + Mongoose
 - JWT Authentication
 - bcryptjs
 - Nodemailer (email notifications)

## 🔧 Environment Variables
Create a .env file in the root directory with:
  PORT=5000
  MONGO_URI=
  CLIENT_URL=
  PROD_CLIENT_URL=
  NODE_ENV=
  EMAIL_USER=
  EMAIL_PASS=
  CLINIC_EMAIL=
  JWT_SECRET=

## 📦 Installation
  git clone <your-backend-repo-url>
  cd backend
  npm install
  npm run dev
  
- The server defaults to:
  http://localhost:5000

## 📚 API Endpoints
Appointments
  Method -	Endpoint -	Description
  POST -	/api/appointments -	Create a new appointment
  GET -	/api/appointments -	List appointments (admin only)
  PUT -	/api/appointments/:id -	Update appointment status/details
  DELETE -	/api/appointments/:id -	Delete appointment

Admin Auth
  Method -	Endpoint -	Description
  POST -	/api/admin/login -	Admin login (sets HttpOnly cookie)
  GET -	/api/admin/verify -	Verify login token
  POST -	/api/admin/logout -	Clear authentication cookie

## 📨 Email Notifications
When a patient books an appointment:
They receive a confirmation email
The clinic receives a notification email
Uses Nodemailer with the configured SMTP credentials.

## 🏗 Deployment
  The backend can be deployed on:
  Render
  Railway
  Fly.io
  Any Node.js-compatible hosting
  Be sure to set environment variables on the hosting platform.
