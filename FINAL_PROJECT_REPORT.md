# FINAL PROJECT REPORT: CareerAI

## 1. Introduction
CareerAI is a comprehensive, modern Software-as-a-Service (SaaS) platform designed to revolutionize the job search and application process. By combining a highly interactive React frontend with a robust Node.js backend and OpenAI integration, the platform serves as an intelligent bridge between candidates and employers. It provides users with an intuitive environment to build dynamic resumes, analyze their fit for specific roles, and track their application lifecycle in one unified dashboard.

## 2. Problem Statement
The contemporary job market is highly competitive and increasingly reliant on Applicant Tracking Systems (ATS). Candidates often struggle to manually tailor their resumes to match specific job descriptions, leading to qualified applicants being rejected due to missing keywords. Furthermore, managing multiple applications across various platforms is disorganized and stressful. There is a critical need for an intelligent system that automatically analyzes a candidate's resume against job requirements, provides actionable optimization feedback, and centralizes the application process.

## 3. Objectives
- Develop a responsive, premium Single Page Application (SPA) for job seekers.
- Implement an AI-powered Resume Builder that dynamically suggests improvements.
- Create an intelligent Job Matching algorithm using OpenAI to simulate an ATS.
- Build a secure, scalable RESTful API to handle user data, job listings, and applications.
- Provide a Role-Based Access Control (RBAC) Admin Dashboard for job management.

## 4. Functional Requirements
- **User Authentication:** Users must be able to securely register, log in, and manage their profiles.
- **Resume Management:** Users can perform CRUD operations on their Education, Experience, Skills, and Projects.
- **Job Board:** Users can search and filter active job postings by location, skills, and type.
- **AI Services:** The system must evaluate a resume against a job description and output a match percentage and actionable feedback.
- **Application Tracking:** Users can apply to jobs and monitor their status (Applied, Interview, Selected).
- **Admin Controls:** Administrators can post new jobs, edit existing ones, and delete outdated listings.

## 5. Technology Stack
- **Frontend:** React.js, Vite, Tailwind CSS, Framer Motion (for animations), Lucide React (for iconography), React Router DOM.
- **Backend:** Node.js, Express.js.
- **Database:** MongoDB, Mongoose (ODM).
- **Security & Authentication:** JSON Web Tokens (JWT), bcryptjs.
- **Artificial Intelligence:** OpenAI API (gpt-3.5-turbo).

## 6. System Architecture
CareerAI operates on a decoupled Client-Server architecture:
- **Client (Frontend):** A React SPA that manages global state via Context API. It handles UI rendering, route protection, and asynchronous API calls using a centralized `api.js` utility.
- **Server (Backend):** An Express.js REST API that processes business logic, interacts with the MongoDB cluster, and securely communicates with the OpenAI API.
- **Data Flow:** The client attaches a JWT to the `Authorization` header. The server's `protect` middleware intercepts this, decodes the user ID, and securely processes the request against the database.

## 7. System Modules
- **Authentication Module:** Manages registration, login, and token issuance.
- **Resume Builder Module:** A multi-step form interface for capturing candidate history.
- **Job Discovery Module:** A searchable interface for browsing active listings.
- **AI Matching Module:** The core engine that correlates candidate data with job requirements.
- **Application Tracker Module:** A dashboard for candidates to view application statuses.
- **Admin Dashboard Module:** A protected interface for administrators to manage job inventory.

## 8. Database Design
The MongoDB database relies on four highly relational Mongoose schemas:
1. **User:** Stores credentials (`password_hash`), profile data, and RBAC `role`.
2. **Resume:** A one-to-one relationship with `User`. Stores embedded arrays for `education`, `experience`, `skills`, and `projects`.
3. **Job:** Stores listing details (title, company, description, required skills).
4. **Application:** A junction collection linking a `User` and a `Job`. Stores the application `status` (Enum) and `applied_at` timestamp to prevent duplicate applications.

## 9. Authentication
Authentication is strictly stateless and handled via JWT.
- Passwords are never stored in plain text; they are hashed using `bcryptjs` before insertion into MongoDB.
- Upon successful login, the server issues a signed JWT valid for 30 days.
- The React client stores this token in `localStorage` and automatically attaches it to all outgoing API requests.
- The backend utilizes a custom `protect` middleware to verify the token signature and attach the authenticated user object to the request.

## 10. AI Integration
The OpenAI integration is completely abstracted within the backend (`aiService.js`) to ensure the `OPENAI_API_KEY` is never exposed to the client.
- **Summary Optimization:** The system prompts the AI to rewrite the user's professional summary to be more impactful based on their provided skills and experience.
- **Job Matching:** The system acts as a virtual ATS, passing the candidate's full resume and the target job description to the AI. Strict prompt engineering forces the AI to return a precise, predictable JSON structure containing a `matchPercentage` and a categorized `breakdown` of skills.

## 11. API Design
The REST API follows strict naming conventions and HTTP method standards:
- **Auth:** `POST /api/auth/register`, `POST /api/auth/login`, `GET /api/auth/me`
- **Resumes:** `GET`, `POST`, `PUT`, `DELETE` at `/api/resumes/me`
- **Jobs:** `GET /api/jobs`, `POST /api/jobs` (Admin), `PUT /api/jobs/:id` (Admin)
- **Applications:** `POST /api/applications`, `GET /api/applications/me`, `PUT /api/applications/:id/status` (Admin)
- **AI:** `POST /api/ai/improve-summary`, `POST /api/ai/job-match`

## 12. User Interface Screenshots
*(Note: Please insert your application screenshots here prior to submission. Recommended screenshots include: Landing Page, AI Match Radial Dashboard, Application Tracker Kanban, and Admin Job Form.)*

## 13. Testing
Testing was conducted across multiple layers:
- **Component Testing:** Verified responsive design and form validation (e.g., email format, password strength) in React.
- **API Testing:** Used tools (like Postman) to ensure standard HTTP status codes (200, 201, 400, 401, 404, 500) were returned accurately.
- **Security Testing:** Attempted to access protected routes without a JWT and attempted to modify jobs without an Admin role to verify RBAC integrity.
- **Error Handling:** Intentionally removed the OpenAI API key to verify that the application degrades gracefully rather than crashing.

## 14. Results
The final product successfully meets all outlined objectives. The application is highly performant, visually engaging due to the premium design system, and securely integrated with a MongoDB backend. The AI features provide genuine, actionable value to job seekers, making the platform a significant upgrade over traditional job boards.

## 15. Limitations
- **File Uploads:** Currently, users must manually input their resume data. The system does not yet support uploading and parsing raw PDF/Word documents.
- **AI Latency:** Because the system relies on external OpenAI API calls, generating the Job Match analysis can take 3-5 seconds, requiring loading spinners in the UI.
- **Session Expiration:** The current JWT implementation does not utilize refresh tokens, meaning users will be forcefully logged out after 30 days regardless of activity.

## 16. Future Enhancements
- **Resume Parsing:** Implement OCR and PDF parsing libraries (e.g., `pdf-parse`) to auto-fill the Resume Builder from uploaded files.
- **Employer Portal:** Develop a dedicated external portal for employers to register, pay for job slots, and review incoming candidate applications directly.
- **Real-Time Notifications:** Integrate WebSockets (`Socket.io`) to push instant notifications to candidates when an employer updates their application status.

## 17. Conclusion
Developing CareerAI was a rigorous exercise in full-stack engineering, demonstrating the power of the MERN stack when coupled with modern AI APIs. The project successfully navigated the complexities of secure authentication, relational database design in a NoSQL environment, and robust prompt engineering. CareerAI stands as a complete, scalable blueprint for next-generation recruitment software.
