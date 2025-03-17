*Quiz Time Application*

*Frontend*

mdir Quizz_App
cd Quizz_App
npm create vite@latest
npm i
npm run dev

Different pages used to create , attend and view scores for the quizz

libraries : react-router , react-bootstrap , react-toastify

Backend
The backend is built with Express.js, using JWT for authentication and a database (PostgreSQL) 

<!-- Key Components -->
*Authentication System*

Login & Signup: User authentication with email and password.

JWT Token: Secure authentication with JSON Web Tokens.

Protected Routes: Unauthorized users are redirected to the login page.

*Frontend Components*

App.jsx: Main application component, sets up the router.

routes.jsx: Defines application routes with protected and public paths.

ProtectedRoute.jsx: Wrapper component that verifies authentication before rendering protected content.

Authentication Pages
Login.jsx: User login form with validation.

Signup.jsx: New user registration with validation.

*Dashboard*
MainDashboard.jsx: Layout component with sidebar and content area.

HomePage.jsx: Dashboard overview with stats (total exams, created exams, average score).

Sidebar.jsx: Navigation sidebar for logged-in users.

Exam Management
CreateExam.jsx: Interface for creating and editing exams with questions and multiple-choice answers.

ListExams.jsx: Display available exams for users to take.

Scores.jsx: View exam results and detailed answer analysis.

Context Provider
DashboardProvider.jsx: Centralized state management for the dashboard components.

*Backend Components*
Routes
authRoutes.js: User authentication endpoints.

examRoutes.js: Exam management endpoints.

scoreRoutes.js: Score submission and retrieval endpoints.

Controllers
authController.js: Authentication logic (signup, login).

examController.js: Exam management logic (CRUD operations).

scoreController.js: Score processing logic.

Models(query implementation)
User, Exam, and Score models 

Middleware
authMiddleware.js: JWT validation for protected routes.

*Key Features*

User Authentication
Secure signup and login.
Password hashing with bcrypt.
JWT token-based session management.
Exam Creation
Multi-question exam creation interface.
Multiple-choice questions with correct answer designation.
Exam duration setting.
Exam Taking

*Interactive exam interface with:*

Timer countdown.
Progress tracking.
Question navigation.
Answer selection.
Final submission confirmation.
Results and Analytics
Score calculation and display.
Detailed answer review (correct vs. selected answers).

For exam creators: view all attendees and their performances.

*UI/UX Features*

Responsive design using React Bootstrap.
Form validation using Yup and React Hook Form.
Toast notifications for user feedback.
Password visibility toggle.
Interactive sidebar navigation.
Modal dialogs for form input and confirmations.
Security Measures
Password hashing.
JWT authentication.
Protected routes.
Input validation.


*Future Improvement Opportunities*

Add pagination for exams and scores lists.
Add different question types (e.g., true/false, short answer).
Implement exam categories/tags.
Add file upload capability for questions (images, etc.).
Implement user roles (admin, teacher, student).


