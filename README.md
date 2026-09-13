# 🚀 CareerAI - The Intelligent AI Resume Builder & Job Matching Platform

![CareerAI Banner](./placeholder-banner.png)

## 📖 Full Project Description

**CareerAI** is a premium, modern SaaS platform designed to bridge the gap between job seekers and their dream careers using the power of Artificial Intelligence. In today's highly competitive job market, candidates often struggle to tailor their resumes for specific job descriptions, and automated Applicant Tracking Systems (ATS) frequently filter out highly qualified candidates who lack specific keywords. 

CareerAI solves this problem by providing an intelligent, all-in-one ecosystem. It offers a comprehensive **Resume Builder** that securely stores a user's education, experience, skills, and projects. Using the **OpenAI API (GPT-3.5/4)**, it can automatically analyze, rewrite, and optimize a user's professional summary to be ATS-friendly. Furthermore, CareerAI includes a **Smart Job Board** where users can browse active listings. The platform dynamically calculates a **"Match Percentage"** between the user's resume and any job description in real-time, highlighting matching skills and suggesting missing keywords before the user even applies. 

Finally, it includes a robust **Application Tracker** to monitor job application statuses and an **Admin Dashboard** with Role-Based Access Control (RBAC) for administrators to manage the platform's job listings. 

---

## ✨ Key Features

- **🤖 AI Resume Builder & Optimizer**: Create a comprehensive profile. Use AI to automatically rewrite your professional summary and bullet points to maximize ATS visibility.
- **📊 Real-Time ATS Job Matching**: Instantly calculate a "Match Score" against any job listing. Discover exactly which skills you have and which ones you are missing.
- **💼 Smart Job Board**: Browse, search, and filter through active job listings with a responsive, premium UI built with Tailwind CSS v4 and Framer Motion.
- **📈 Application Kanban Tracker**: Securely apply for jobs and track your application lifecycle (Applied, Interview, Shortlisted, Rejected).
- **🛡️ Secure JWT Authentication**: Fully secure, stateless authentication system using JSON Web Tokens and bcrypt password hashing.
- **👑 Admin RBAC Interface**: A protected dashboard specifically for administrators to create, update, delete, and manage job listings across the platform.

---

## 🛠️ Technology Stack

**Frontend (Client)**
- **React.js 19** & **Vite** for blazing-fast HMR and optimized builds.
- **Tailwind CSS v4** for utility-first, highly responsive, and premium styling.
- **Framer Motion** for smooth, modern micro-animations.
- **Lucide React** for beautiful, consistent iconography.
- **React Router DOM v7** for seamless Single Page Application (SPA) routing.

**Backend (Server)**
- **Node.js** & **Express.js** for a robust, scalable RESTful API.
- **MongoDB** & **Mongoose ODM** for flexible, document-based data storage.
- **JSON Web Tokens (JWT)** for stateless, secure authentication.
- **OpenAI API / Gemini API** integration for advanced natural language processing.

---

## 🚀 Quick Start: How to Run the Project

Follow these simple steps to run CareerAI on your local machine.

### Prerequisites
- You must have **Node.js** (v18 or higher) installed on your system.
- You must have **Git** installed (if cloning the repository).
- You need a **MongoDB URI** (either a local MongoDB server or a free MongoDB Atlas cluster).
- You need an **AI API Key** (OpenAI or Google Gemini).

### Step 1: Clone the Repository
Open your terminal and clone the repository to your local machine:
```bash
git clone <your-github-repo-url>
cd "CLIENT PROJECT"
```

### Step 2: Set Up Environment Variables
Navigate to the `server` folder and create a `.env` file (if one doesn't exist). 
**WARNING: Never commit your `.env` file to GitHub!**

Create a file named `.env` inside the `server/` folder and add the following:
```env
NODE_ENV=development
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_secure_random_jwt_secret
GEMINI_API_KEY=your_gemini_api_key_here
```

### Step 3: Install Dependencies
You need to install the Node packages for **both** the frontend and the backend.

**Install Backend Dependencies:**
```bash
cd server
npm install
```

**Install Frontend Dependencies:**
Open a *new* terminal window, go to the root of the project, and run:
```bash
npm install
```

### Step 4: Seed the Database (Optional but Recommended)
To populate your database with 20 realistic mock jobs so you can test the platform immediately:
```bash
cd server
node seedJobs.js
```

### Step 5: Start the Application!
You will need two terminal windows open to run both the frontend and backend simultaneously.

**Terminal 1 (Start the Backend):**
```bash
cd server
npm run dev
# OR if the dev script is missing:
npx nodemon server.js
```
*You should see "Server running on port 5000" and "Connected to MongoDB".*

**Terminal 2 (Start the Frontend):**
```bash
# From the root project directory
npm run dev
# OR if using Vite directly:
npx vite
```
*The frontend will start at `http://localhost:5173`. Open this URL in your browser!*

---

## 📁 Project Structure

```text
CareerAI/
├── src/                    # React Frontend Code
│   ├── components/         # UI Components (Pages, Dashboard, Forms)
│   ├── context/            # Global State (AuthContext)
│   ├── utils/              # Helper functions (API interceptors)
│   ├── App.jsx             # Main Application Router
│   └── main.jsx            # React Entry Point (with Error Boundary)
├── server/                 # Node.js Backend Code
│   ├── config/             # DB Connection configuration
│   ├── controllers/        # Route logic & Business rules
│   ├── middleware/         # Auth protection & Error handling
│   ├── models/             # Mongoose DB Schemas (User, Job, Resume)
│   ├── routes/             # API Route definitions
│   ├── server.js           # Express Server Entry Point
│   ├── seedJobs.js         # Database Seeding Script
│   └── .env                # Secret Environment Variables
├── package.json            # Frontend Dependencies
└── vite.config.js          # Vite Configuration
```

---

## 📡 Core API Endpoints

**Auth API (`/api/auth`)**
- `POST /register` - Create a new account
- `POST /login` - Authenticate and receive JWT
- `GET /me` - Get current user profile (Protected)

**Jobs API (`/api/jobs`)**
- `GET /` - Fetch all active jobs
- `GET /:id` - Get specific job details
- `POST /` - Create a new job (Admin Only)

**Resume & AI API (`/api/resumes` & `/api/ai`)**
- `GET /api/resumes/me` - Fetch user's resume data
- `POST /api/ai/job-match` - Calculate resume ATS score against a job
- `POST /api/ai/improve-summary` - Use AI to rewrite resume summary

---

## 🤝 Contributing
Contributions, issues, and feature requests are welcome! Feel free to check the issues page if you want to contribute.

## 📝 License
This project is licensed under the MIT License - see the LICENSE file for details.
