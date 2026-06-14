# FIFA World Cup 2026 Prediction System - Deployment Guide

This guide provides instructions to deploy your application to production. The codebase has been fully updated to support two flexible hosting options:

* **Option A: Monolith Deployment (Recommended)** - Deploy both the React frontend and Express backend together as a single web service.
* **Option B: Separated Deployment** - Host the React frontend on a static hosting provider (e.g. Vercel, Netlify) and the Node.js backend on a backend web service.

---

## 1. Database Setup: MongoDB Atlas

Before deploying the application, you need a cloud-hosted MongoDB database:

1. **Sign Up / Log In**: Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) and log in.
2. **Create a Cluster**: Set up a free-tier cluster (e.g., M0) in your preferred region.
3. **Configure Database Access (Database User)**:
   - Go to **Database Access** under **Security** in the sidebar.
   - Click **Add New Database User**.
   - Select **Password Authentication**. Add a username and password. Make note of these details.
   - Assign the user the role **Read and write to any database**.
4. **Configure Network Access (IP Access List)**:
   - Go to **Network Access** under **Security**.
   - Click **Add IP Address**.
   - Select **Allow Access From Anywhere** (IP `0.0.0.0/0`).
     > [!IMPORTANT]
     > Allowing access from anywhere is required for cloud hosting services (like Render or Vercel) whose outbound IP addresses change dynamically.
5. **Get Connection String**:
   - Click on your cluster's **Connect** button.
   - Choose **Drivers** under "Connect to your application".
   - Copy the connection string. Replace `<username>` and `<password>` with your database user's credentials, and set the database name (e.g. `wc2026`) before the query parameters (e.g., `mongodb+srv://.../wc2026?retryWrites=true...`).

---

## 2. Option A: Monolith Deployment (Single Web Service)

This is the simplest and recommended deployment method. The Express backend compiles and serves the React frontend, eliminating CORS issues and requiring only a single cloud service deployment.

### Deploying to Render (render.com)

1. **Create Account**: Register on [Render](https://render.com/).
2. **New Web Service**: Click **New +** and select **Web Service**.
3. **Connect Repository**: Connect your GitHub or GitLab repository containing the code.
4. **Configure Web Service Settings**:
   - **Name**: `wc2026-predictor` (or your preferred name)
   - **Environment**: `Node`
   - **Region**: Select region closest to your audience.
   - **Branch**: `main` (or whichever branch you want to deploy)
   - **Root Directory**: *Keep empty* (run from the root repository directory)
   - **Build Command**: `npm run install:all && npm run build`
   - **Start Command**: `npm start`
5. **Set Environment Variables**:
   Under **Environment**, add the following keys and values:
   - `MONGO_URI`: *Your MongoDB Atlas connection string (obtained in Step 1)*
   - `NODE_ENV`: `production`
   - `PORT`: `10000` (Render's default port, or leave blank; Render binds dynamically)
6. **Deploy**: Click **Create Web Service**. Render will install dependencies, build the React frontend, start the backend, and host your entire application.

---

## 3. Option B: Separated Deployment (Vercel/Netlify + Render/Railway)

If you prefer to host your frontend assets on a global CDN like Vercel or Netlify and run the backend API separately, use this option.

### Phase 1: Deploy Backend (e.g. Render Web Service)

1. Go to [Render](https://render.com/), select **New +** > **Web Service**, and connect your repo.
2. Configure settings:
   - **Name**: `wc2026-backend`
   - **Environment**: `Node`
   - **Root Directory**: `backend` *(Runs commands inside backend folder)*
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
3. Configure Environment Variables:
   - `MONGO_URI`: *Your MongoDB Atlas connection string*
   - `PORT`: `5000` (or leave blank)
4. Click **Create Web Service**. Wait for the build to finish and copy your live backend URL (e.g., `https://wc2026-backend.onrender.com`).

### Phase 2: Deploy Frontend (e.g. Vercel)

1. Sign up/log in to [Vercel](https://vercel.com/).
2. Click **Add New** > **Project** and import your repository.
3. Configure settings:
   - **Framework Preset**: `Vite` (or Other)
   - **Root Directory**: `frontend` *(Runs commands inside frontend folder)*
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
4. Configure Environment Variables:
   Add the following variables:
   - Key: `VITE_API_URL`
   - Value: *Your live backend URL copied from Phase 1* (e.g., `https://wc2026-backend.onrender.com` - **do not** add a trailing slash)
5. Click **Deploy**. Vercel will build your React app and host it. The app will communicate across origins with the backend API.

---

## 4. Local Production Test (Simulation)

You can test the production monolithic build locally before deploying to the cloud:

1. **Build Frontend**: Build the client application:
   ```bash
   npm run build
   ```
2. **Start Backend in Production**:
   - On Windows (PowerShell):
     ```powershell
     $env:NODE_ENV="production"; node backend/server.js
     ```
   - On Mac/Linux (Terminal):
     ```bash
     NODE_ENV=production node backend/server.js
     ```
3. **Verify**: Open your browser to `http://localhost:5000`. You will see the compiled client app running. Submit a prediction and check if it successfully saves to MongoDB.
