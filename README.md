# vShield — Background Verification Platform

vShield is an enterprise-grade, production-ready SaaS background verification platform designed for HR departments to automate candidate credential audits. The platform orchestrates secure validation pipelines calling mock Government ID APIs (Aadhaar & PAN), aggregates audit logs, and compiles PDF certificates using headless Puppeteer rendering.

---

## Technical Stack & Architecture

### Backend:
* **Runtime:** Node.js (v20) + Express framework (TypeScript)
* **Database:** PostgreSQL hosted on Neon Serverless, managed via Prisma ORM (v5.14.0)
* **PDF Compiler:** Puppeteer Headless layout rendering
* **Cloud Storage CDN:** Cloudinary SDK stream helper

### Frontend:
* **Framework:** React + Vite + TypeScript
* **Styling:** Tailwind CSS (Custom slate monochrome palette)
* **State Management:** Zustand
* **Form Validations:** React Hook Form + Zod resolvers
* **Navigation Routing:** React Router DOM (v6)

---

## Directory Structure

```text
vShield/
├── backend/
│   ├── prisma/
│   │   └── schema.prisma         # Prisma Schema models & relational configurations
│   ├── src/
│   │   ├── config/
│   │   │   └── cloudinary.ts     # Cloudinary asset integration stream helpers
│   │   ├── controllers/
│   │   │   ├── auth.controller.ts
│   │   │   ├── candidate.controller.ts
│   │   │   ├── report.controller.ts
│   │   │   └── verification.controller.ts
│   │   ├── lib/
│   │   │   └── prisma.ts         # Singleton database client instantiation
│   │   ├── middleware/
│   │   │   ├── auth.middleware.ts
│   │   │   └── error.middleware.ts
│   │   ├── routes/
│   │   │   ├── auth.routes.ts
│   │   │   ├── candidate.routes.ts
│   │   │   ├── report.routes.ts
│   │   │   └── verification.routes.ts
│   │   ├── services/
│   │   │   ├── auth.service.ts
│   │   │   ├── candidate.service.ts
│   │   │   ├── pdf.service.ts     # Puppeteer PDF layout generator
│   │   │   ├── report.service.ts
│   │   │   └── verification.service.ts # Verification pipeline orchestrator
│   │   ├── utils/
│   │   │   └── errors.ts         # Centralized HTTP status error models
│   │   ├── validations/
│   │   │   ├── auth.validation.ts
│   │   │   └── candidate.validation.ts
│   │   ├── app.ts                # Express application bootstrapping & CORS configuration
│   │   └── server.ts             # Server entry-point listener
│   ├── package.json
│   └── tsconfig.json
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Card.tsx          # Reusable analytics metrics layout cards
│   │   │   ├── Header.tsx        # Top status breadcrumbs navbar
│   │   │   ├── Sidebar.tsx       # Sidebar navigation dashboard menu
│   │   │   ├── Table.tsx         # Generic paginated table component
│   │   │   └── Toast.tsx         # Slide-in global notifications component
│   │   ├── layouts/
│   │   │   └── DashboardLayout.tsx # Protected session layout router guard
│   │   ├── pages/
│   │   │   ├── CandidateCreateEdit.tsx # Zod-validated registration form page
│   │   │   ├── CandidateDetails.tsx    # Candidate file detail panel & logs audit
│   │   │   ├── CandidateList.tsx       # Searchable & filterable directory grid
│   │   │   ├── Dashboard.tsx           # Workspaces metrics overview charts
│   │   │   ├── Login.tsx               # Sign-in authentication form page
│   │   │   ├── Register.tsx            # Sign-up account creation form page
│   │   │   ├── ReportViewer.tsx        # Web-rendered credential assessment viewer
│   │   │   └── VerificationLogs.tsx    # Audit logs expanded transaction logs
│   │   ├── services/
│   │   │   └── api.ts            # Axios interceptor configurations
│   │   ├── store/
│   │   │   ├── authStore.ts      # Zustand authentication actions & session state
│   │   │   └── candidateStore.ts # Zustand candidate queries & metrics
│   │   ├── types/
│   │   │   └── index.ts          # Unified TypeScript interfaces
│   │   ├── App.tsx               # React Router navigation tree
│   │   ├── index.css             # Tailwind base styles and overrides
│   │   └── main.tsx              # React mounting script
│   ├── package.json
│   ├── tailwind.config.js
│   └── tsconfig.json
└── vShield_Postman_Collection.json # Postman integration test requests collection
```

---

## Installation & Local Configuration

### 1. Database & Environments
Copy or configure environmental credentials in a `/backend/.env` file:
```env
DATABASE_URL=postgresql://<user>:<password>@<host>:<port>/neondb?sslmode=require
JWT_SECRET=vshield_super_secure_jwt_secret_key_101
PORT=5001

# Cloud Storage Credentials
CLOUDINARY_CLOUD_NAME=dbmqdfp5t
CLOUDINARY_API_KEY=252935166747232
CLOUDINARY_API_SECRET=TY9GYD1ntsZQv1Uu2ve0yLk5PBo

# Gateway URLs (Leave blank to use sandbox mock response behaviors)
AADHAAR_API_URL=
PAN_API_URL=

FRONTEND_URL=http://localhost:5173
```

### 2. Bootstrapping the Backend
Navigate to `/backend` folder:
```bash
cd backend
npm install
npx prisma db push       # Synchronize models with the Neon PostgreSQL database
npm run build            # Compile TypeScript files
npm run dev              # Run server under ts-node-dev on port 5001
```

### 3. Bootstrapping the Frontend
Navigate to `/frontend` folder:
```bash
cd ../frontend
npm install
npm run build            # Compile & verify client assets
npm run dev              # Launch development server on port 5173
```

Open `http://localhost:5173` on your browser to access the vShield application.

---

## API Documentation

### Authentication Routes
* `POST /api/auth/register` - Create user profile
* `POST /api/auth/login` - Authenticate profile and receive JWT token
* `GET /api/auth/me` - Fetch logged-in user profile details

### Candidate Routes
* `GET /api/candidates` - Search/page candidate filings
* `POST /api/candidates` - Register a candidate filing profile
* `GET /api/candidates/:id` - Fetch candidate records, logs, and reports
* `PUT /api/candidates/:id` - Update candidate identity details
* `DELETE /api/candidates/:id` - Delete candidate profile and related logs

### Verification Routes
* `POST /api/verifications/:id/start` - Execute background Aadhaar + PAN verification pipelines
* `GET /api/verifications/logs` - Audit system transactions

### Report Routes
* `GET /api/reports/:candidateId` - Fetch candidate digital assessment certificate

---

## Testing API Gateways via Postman
A pre-configured Postman JSON collection is provided at the root folder `/vShield_Postman_Collection.json`. 
To test:
1. Import `vShield_Postman_Collection.json` into Postman.
2. Select standard environment variables for port (`5001`) and host (`localhost`).
3. Execute registration and login endpoints to automatically cache the authorization header token variable.
4. Execute candidate filings and validation actions.
