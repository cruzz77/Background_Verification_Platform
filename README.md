# vShield — Background Verification Platform

## Live Demo

### Frontend (Vercel)

[https://background-verification-platform-smcd-amafwcony.vercel.app](https://background-verification-platform-smcd-amafwcony.vercel.app)

### Backend API (Render)

[https://background-verification-platform-778v.onrender.com](https://background-verification-platform-778v.onrender.com)

---

## Example Login Credentials 

Email: test@gmail.com
Password: 1234567

---

# Overview

vShield is a full-stack enterprise-grade Background Verification Platform built to streamline candidate identity verification workflows for recruiters, HR teams, and organizations.

The platform enables secure candidate onboarding, Aadhaar and PAN verification workflows, verification audit logging, PDF report generation, and professional dashboard analytics.

The project follows scalable SaaS architecture principles with modular backend services, secure authentication, REST APIs, relational database modeling, and production deployment.

---

# Features

## Authentication & Security

* JWT-based Authentication
* User Registration & Login
* Protected Routes
* Password Hashing using bcrypt
* Rate Limiting
* Helmet Security Middleware
* Secure CORS Configuration
* Centralized Error Handling

---

## Candidate Management

* Create Candidate Profiles
* Edit Candidate Details
* Delete Candidates
* Search & Filter Candidates
* Paginated Candidate Listing
* Candidate Status Tracking

---

## Verification System

### Aadhaar Verification

* Aadhaar Number Validation
* Verification Workflow Simulation
* Verification Status Tracking

### PAN Verification

* PAN Format Validation
* PAN Verification Workflow
* Active/Inactive PAN Checks

---

## Verification Workflow Engine

* Automated Verification Pipeline
* Verification Audit Logs
* Status Classification:

  * VERIFIED
  * FAILED
  * PARTIAL
  * PENDING

---

## Professional Reports

* PDF Verification Report Generation
* Report Storage & Retrieval
* Cloudinary Integration
* Downloadable Reports

---

## Dashboard & UI

* Enterprise Dashboard UI
* Verification Statistics
* Status Cards
* Responsive Design
* Toast Notifications
* Clean SaaS-style User Experience

---

# Tech Stack

## Frontend

* React.js
* TypeScript
* Vite
* Tailwind CSS
* Axios
* Zustand
* React Router DOM

---

## Backend

* Node.js
* Express.js
* TypeScript
* Prisma ORM
* JWT Authentication
* Zod Validation

---

## Database

* PostgreSQL (Neon)

---

## Cloud & Deployment

* Frontend: Vercel
* Backend: Render
* Database: Neon
* File Storage: Cloudinary

---

# System Architecture

```text
Frontend (Vercel)
        ↓
Backend API (Render)
        ↓
PostgreSQL Database (Neon)
        ↓
Cloudinary File Storage
```

---

# Project Structure

## Backend Structure

```text
backend/
│
├── prisma/
├── src/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── routes/
│   ├── services/
│   ├── utils/
│   ├── validations/
│   ├── lib/
│   ├── app.ts
│   └── server.ts
│
├── package.json
└── tsconfig.json
```

---

## Frontend Structure

```text
frontend/
│
├── src/
│   ├── assets/
│   ├── components/
│   ├── layouts/
│   ├── pages/
│   ├── services/
│   ├── store/
│   ├── types/
│   ├── App.tsx
│   └── main.tsx
│
├── package.json
└── vite.config.ts
```

---

# Core Modules

## Authentication Module

### APIs

```http
POST /api/auth/register
POST /api/auth/login
GET /api/auth/me
```

---

## Candidate Module

### APIs

```http
GET    /api/candidates
POST   /api/candidates
GET    /api/candidates/:id
PUT    /api/candidates/:id
DELETE /api/candidates/:id
```

---

## Verification Module

### APIs

```http
POST /api/verifications/:id/start
GET  /api/verifications/logs
```

---

## Report Module

### APIs

```http
GET /api/reports/:id
GET /api/reports/details/:id
```

---

# Database Schema

## Main Entities

* User
* Candidate
* VerificationLog
* Report

---

# Security Features

* JWT Authentication
* Password Hashing
* Request Rate Limiting
* Secure CORS Policy
* Input Validation
* Centralized Error Middleware
* Protected API Routes
* Sensitive Data Handling

---

# Environment Variables

## Backend `.env`

```env
DATABASE_URL=

JWT_SECRET=

AADHAAR_API_URL=
PAN_API_URL=

CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=

FRONTEND_URL=
```

---

## Frontend `.env`

```env
VITE_API_URL=
```

---

# Local Setup Instructions

## 1. Clone Repository

```bash
git clone https://github.com/cruzz77/Background_Verification_Platform.git
```

---

## 2. Setup Backend

```bash
cd backend

npm install
```

### Create `.env`

```env
DATABASE_URL=
JWT_SECRET=
FRONTEND_URL=
```

### Run Backend

```bash
npm run dev
```

---

## 3. Setup Frontend

```bash
cd frontend

npm install
```

### Create `.env`

```env
VITE_API_URL=http://localhost:5003/api
```

### Run Frontend

```bash
npm run dev
```

---

# Production Deployment

## Frontend Deployment

* Vercel

## Backend Deployment

* Render

## Database Hosting

* Neon PostgreSQL

## File Storage

* Cloudinary

---

# Assignment Requirements Covered

| Requirement                 | Status |
| --------------------------- | ------ |
| Authentication System       | ✅      |
| Candidate CRUD APIs         | ✅      |
| Aadhaar Verification        | ✅      |
| PAN Verification            | ✅      |
| REST APIs                   | ✅      |
| PostgreSQL Integration      | ✅      |
| Prisma ORM                  | ✅      |
| JWT Authentication          | ✅      |
| PDF Report Generation       | ✅      |
| Secure Backend Architecture | ✅      |
| Responsive Frontend UI      | ✅      |
| Deployment                  | ✅      |
| Verification Workflow       | ✅      |
| Audit Logging               | ✅      |

---

# Scalability Considerations

* Modular Service Layer Architecture
* RESTful API Design
* ORM-based Database Access
* Centralized Error Handling
* Production-ready Deployment Architecture
* Async-ready Verification Flow
* Cloud-based Infrastructure

---

# Future Enhancements

* OCR Document Upload
* Face Match Verification
* Email Notification System
* Redis Caching
* Queue-based Verification Workers
* Admin Analytics Dashboard
* Multi-tenant Architecture
* Bulk CSV Upload
* Webhook Integrations

---

# API Testing

Postman Collection included:

```text
vShield_Postman_Collection.json
```

---

# Author

Built by [Aditya Chopra](https://github.com/cruzz77)

---

# License

This project was developed as part of a Full Stack Engineering Assignment for educational and evaluation purposes.
