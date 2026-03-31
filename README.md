# Indian Diet Decision System

A comprehensive Full-Stack Health & Nutrition Application tailored for Indian dietary habits. It features dual role-based access (User vs. Nutritionist vs. Admin), dynamic Groq-powered AI interaction, and an algorithmic rule-based Diet Engine.

## Tech Stack
- **Backend:** Java 17 + Spring Boot 3 + Spring Security (JWT)
- **Database:** SQLite (file-based local database)
- **Frontend:** React + Vite + Recharts + React-Markdown
- **AI Integration:** Groq API (`llama3-70b-8192`)

## Features
- **Health Profile Wizard:** Multi-step wizard securely logging age, allergies, BMI calculations, and BMR / TDEE projections natively.
- **Rule-Based Diet Inference Engine:** Selects from 80+ populated Indian Food Items natively handling Vegan, Jain, and condition-related filtering (e.g. limiting rice for Diabetics) while adjusting portions dynamically for ±500kcals based on your previous weekly check-ins.
- **Interactive Dashboards:** Custom Recharts rings & visual matrices breaking down macro arrays and Historical Diet validations.
- **Priya AI Nutritionist:** Contextually injected chatbot via Groq that inherently understands your active calorie targets and medical bounds natively.
- **Role Control Hubs:** Protected routing to a Nutritionist Drilldown Hub and Admin Rule/Food SQLite configurators.

## Prerequisites
- Node.js (v18+)
- Java 17+
- A valid Groq API Key

## Setup & Quick Start
1. Add your Groq API Key to `backend/src/main/resources/application.properties`:
   `groq.api.key=YOUR_KEY_HERE`
2. Run the platform natively using Windows PowerShell:
   `.\start.ps1`

### Default Admin Flow
Currently, user roles default to `USER`. You can edit the SQLite database directly using tools like DB Browser for SQLite on `backend/data/app.db` to change a user's role string to `ROLE_ADMIN` or `ROLE_NUTRITIONIST` to unlock the role-gated dashboards!

*Disclaimer: This application provides general dietary and fitness guidance. It is not a substitute for professional medical advice, diagnosis, or treatment.*
