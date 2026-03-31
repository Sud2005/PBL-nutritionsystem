# How to Run the Project

## Quick Start

### Option 1: Full Stack (Backend + Frontend)

```powershell
# Terminal 1 — Backend (Spring Boot)
cd backend
.\mvnw.cmd spring-boot:run

# Terminal 2 — Frontend (React + Vite)
cd frontend
npm install
npm run dev
```

Then open **http://localhost:5173** in a browser.

### Option 2: Frontend Only (Demo Mode)

If the backend is not available, the frontend is configured with mock data:

```powershell
cd frontend
npm install
npm run dev
```

Open **http://localhost:5173** — automatically loads the Dashboard with mock health data.

---

## Configuration

### Groq API Key (for AI Chat)

Edit `backend/src/main/resources/application.properties`:
```
groq.api.key=YOUR_KEY_HERE
```

---

## Features Overview

| Feature | Route | Description |
|---------|-------|-------------|
| Dashboard | `/dashboard` | BMI/BMR/TDEE cards with animated gauges |
| Diet Engine | `/diet` | Rule-based Indian diet plan generator |
| AI Chat (Priya) | `/chat` | Groq LLM nutritionist with health context |
| Plan History | `/history` | Compare past diet plans |
| Admin Panel | `/admin` | Manage food database and dietary rules |
| Nutritionist Hub | `/nutritionist` | Patient monitoring dashboard |
| Health Profile | `/profile` | Multi-step health data wizard |
| Login / Register | `/login`, `/register` | JWT authentication |
