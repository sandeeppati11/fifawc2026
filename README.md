# FIFA World Cup 2026 Prediction System

A responsive, mobile-first web application for building and downloading predictions for the FIFA World Cup 2026 tournament. It handles the official 48-team, 12-group format, wildcard qualification of the 8 best third-place teams, and an interactive knockout bracket.

## Tech Stack
* **Frontend**: React.js, Vite, Tailwind CSS, html2pdf.js (client-side PDF generation)
* **Backend**: Node.js, Express, MongoDB (Mongoose)

---

## Directory Structure
```
wc2026/
├── backend/
│   ├── config/db.js                 # MongoDB connection using Mongoose
│   ├── models/Prediction.js         # Mongoose prediction schema
│   ├── routes/predictionRoutes.js   # Express routing endpoints
│   ├── server.js                    # Server entry point
│   └── .env                         # Backend port & database configuration
├── frontend/
│   ├── index.html                   # HTML Entry Point
│   ├── src/
│   │   ├── components/              # Shared UI components (GroupCard, Navbar)
│   │   ├── data/tournamentData.js   # Static initial groups dataset
│   │   ├── screens/                 # Workflow screens (Onboarding, GroupStage, Wildcard, KnockoutStage, Summary, Community)
│   │   ├── App.jsx                  # Main router controller
│   │   ├── index.css                # Global styles and Tailwind setups
│   │   └── main.jsx                 # Client entry point
│   ├── vite.config.js               # Dev proxy and building rules
│   └── tailwind.config.js           # Theme settings
└── package.json                     # Monorepo coordinator script
```

---

## Getting Started

### 1. Prerequisite Setup
* Make sure you have **Node.js** (v16+) installed.
* You need a running MongoDB instance. Update the environment variables in `backend/.env`:
  ```env
  PORT=5000
  MONGO_URI=your_mongodb_connection_string
  ```

### 2. Dependency Installation
Run the following commands in the root directory to install development and sub-project dependencies:
```bash
# Install root script orchestrator (concurrently)
npm install

# Install both backend and frontend dependencies in one go
npm run install:all
```

### 3. Running the App
Start both the Vite dev server (frontend) and the Nodemon Express API server (backend) concurrently with:
```bash
npm run dev
```

* Frontend is accessible at: [http://localhost:3000](http://localhost:3000)
* Backend API healthcheck is accessible at: [http://localhost:5000/api/health](http://localhost:5000/api/health)
