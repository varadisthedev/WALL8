# Wall8 Deployment Guide 🚀

Your project is now fully configured for deployment! Here are the Environment Variables you need to set on your hosting platforms.

## 1. Backend Deployment (Render / Heroku / Railway)

When deploying the `server` folder, set these **Environment Variables** in your dashboard:

| Variable | Value Example | Description |
|----------|--------------|-------------|
| `NODE_ENV` | `production` | Optimizes performance |
| `FRONTEND_URL` | `https://wall8-frontend.vercel.app` | **CRITICAL**: The URL of your deployed frontend (no trailing slash). Allows CORS access. |
| `MONGODB_URI` | `mongodb+srv://...` | Your database connection string (same as local .env) |
| `CLERK_SECRET_KEY` | `sk_...` | Your Clerk Secret Key (same as local .env) |
| `GEMINI_API_KEY` | `AIza...` | Your Gemini API Key (same as local .env) |

> **Note**: The backend will listen on port `5000` or the platform's default `PORT`.

---

## 2. Frontend Deployment (Vercel / Netlify)

When deploying the `client` folder, set these **Environment Variables**:

| Variable | Value Example | Description |
|----------|--------------|-------------|
| `VITE_CLERK_PUBLISHABLE_KEY` | `pk_...` | Your Clerk Publishable Key (same as local .env) |
| `VITE_API_URL` | `https://your-backend-app.onrender.com/api` | **CRITICAL**: The URL of your deployed backend **PLUS `/api`** at the end. |

### ⚠️ Important Note on VITE_API_URL
Make sure to include `/api` at the end of your backend URL. 
- ✅ Correct: `https://wall8-server.onrender.com/api`
- ❌ Incorrect: `https://wall8-server.onrender.com`

---

## 3. Post-Deployment Check
1. Open your hosted frontend app.
2. If you see "Network Error" or data not loading, check the **Console** (F12).
3. If you see "CORS error", verify that your `FRONTEND_URL` variable in the Backend matches your actual Frontend URL exactly.
