# ResuScan AI - Smart ATS Resume Analyzer

ResuScan AI is a full-stack, deployment-ready web application built using the MERN stack (MongoDB, Express, React, Node.js) and integrated with the Google Gemini API. It allows job seekers to upload a PDF resume, parse the contents, and instantly receive structured AI-powered evaluations, ATS readability grades, grammar ratings, missing critical skills, and career recommendations.

## Tech Stack

### Frontend
- **React 19 & Vite**: High-performance, reactive user interface.
- **Tailwind CSS**: Glassmorphic UI aesthetics and light/dark theme toggles.
- **Framer Motion**: Smooth entry layouts and interaction animations.
- **Chart.js & React-Chartjs-2**: Interactive doughnut and score breakdown bar charts.
- **React Hook Form**: Client-side field validations.
- **React Hot Toast**: Action alerts and process feedback triggers.
- **Lucide Icons & jsPDF**: Client-side professional PDF reports generation.

### Backend
- **Node.js & Express.js**: REST API server layer with ES modules.
- **MongoDB Atlas & Mongoose**: Secure schema models and analysis storage.
- **Google Gemini API SDK**: Structured parsing and keyword matching assessment.
- **JWT & bcryptjs**: Safe password hashing and stateful route protection.
- **Multer & pdf-parse**: In-memory PDF text extraction.
- **Helmet, Cors, & Morgan**: Enterprise-level security and logging middleware.

---

## Directory Structure

```
ai-resume-analyzer/
├── backend/
│   ├── config/          # Database connections & DNS configurations
│   ├── controllers/     # Authentication and resume handlers
│   ├── middleware/      # Protected endpoints and global error handling
│   ├── models/          # User, Resume, and Analysis Mongoose models
│   ├── routes/          # Express API route endpoints
│   ├── services/        # PDF extraction & Google Gemini AI integrations
│   ├── uploads/         # Temporary file uploads folder
│   ├── .env             # Backend variables (Port, Keys, DB)
│   ├── package.json     # Node scripts & dependencies
│   └── server.js        # Main API entry script
├── frontend/
│   ├── src/
│   │   ├── assets/      # Media and asset items
│   │   ├── components/  # ChartSection, StatCard, ProtectedRoute, Navbar, Footer
│   │   ├── context/     # AuthContext for session management
│   │   ├── hooks/       # useAuth hook
│   │   ├── layouts/     # MainLayout and DashboardLayout containers
│   │   ├── pages/       # Landing, Login, Register, Dashboard, Upload, Analysis, History
│   │   ├── services/    # api (axios client), authService, resumeService
│   │   ├── utils/       # Client-side PDF Exporter
│   │   ├── App.jsx      # Route switches
│   │   └── main.jsx     # Root mounting point
│   ├── index.html       # Single Page Application template
│   ├── tailwind.config.js
│   ├── postcss.config.js
│   └── package.json
└── README.md
```

---

## Setup & Running Locally

Follow these quick steps to get the application up and running on your system:

### Prerequisites
- Node.js installed (v18+ recommended)
- MongoDB Atlas cluster URL
- Google Gemini API Key

### 1. Configure the Backend
Navigate to the `backend` folder, install dependencies, and create the `.env` file:
```bash
cd backend
npm install
```

Create a `.env` file in the `backend/` directory:
```env
PORT=5000
MONGODB_URI=your_mongodb_atlas_connection_string
JWT_SECRET=your_jwt_signing_secret
GEMINI_API_KEY=your_google_gemini_api_key
frontend_url=http://localhost:5173
```

Run the backend server:
```bash
npm start
```
The server will boot and connect to MongoDB Atlas, listening on `http://localhost:5000`.

### 2. Configure the Frontend
In another terminal, navigate to the `frontend` folder, install dependencies, and run Vite:
```bash
cd frontend
npm install --legacy-peer-deps
npm run dev
```
The client will launch and serve on `http://localhost:5173`.

---

## API Endpoints

### Auth Routings (`/api/auth`)
- `POST /register` - Register new credentials.
- `POST /login` - Sign in and retrieve JWT.

### Resume Routings (`/api/resume`)
- `POST /upload` - Upload PDF and get raw text (Protected).
- `POST /analyze` - Feed text to Gemini and record scores in DB (Protected).
- `GET /history` - Get user submission stats & analysis log (Protected).
- `GET /:id` - Get detailed resume analysis document (Protected).
- `DELETE /:id` - Clear analysis and resume from logs (Protected).

---

## Deployment Guidelines

### 1. Backend (Render)
- Connect your GitHub repository to Render.
- Create a new **Web Service**.
- Select Node environment and set Build Command to `npm install` and Start Command to `node server.js` (inside `backend` directory, or configure root directory settings).
- Add all environment keys from `.env` in the environment settings dashboard.

### 2. Frontend (Vercel)
- Connect your GitHub repository to Vercel.
- Select the `frontend` folder as the project directory.
- Configure Framework Preset to **Vite**.
- Add environment variables:
  - `VITE_API_URL` = `https://your-backend-render-url.onrender.com/api`
- Deploy.
