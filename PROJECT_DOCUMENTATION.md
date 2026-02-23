# Project Documentation: Bengal Education Ventures EdTech Platform

## 1. Executive Summary
The **Bengal Education Ventures EdTech Platform** is a custom-built, full-stack educational web application designed to deliver technical skills training in modern domains such as Artificial Intelligence, Drone Technology, and 3D Printing. The platform provides a seamless administrative dashboard for course management and an intuitive student portal for learning, enrolling, and joining live classes.

## 2. Architecture & Technology Stack
The project follows a modern decoupled architecture, separating the client-side presentation layer from the server-side business logic and database.

### Frontend (Client-Side)
- **Framework:** Next.js 14 (App Router)
- **Library:** React 19
- **Styling:** Tailwind CSS for rapid, responsive, and modern UI capabilities.
- **State Management & Routing:** React Hooks (`useState`, `useEffect`) and Next.js native navigation.
- **HTTP Client:** Axios for robust API requests and interceptors.

### Backend (Server-Side)
- **Environment:** Node.js
- **Framework:** Express.js
- **Database:** MongoDB (using Mongoose ODM)
- **Authentication:** JSON Web Tokens (JWT) & bcryptjs for password hashing.
- **File Uploads:** Multer for handling image and resource uploads.
- **Other Dependencies:** `cors`, `dotenv`, `groq-sdk` (for AI integrations).

## 3. Core Modules & Features

### 3.1. Authentication & Role-Based Access Control (RBAC)
- **Two User Roles:** `Admin` and `Student`.
- **Security:** Passwords are encrypted using `bcryptjs` before entering the database. Protected routes verify the user's JWT via an authentication middleware. Role-check middlewares ensure that only `Admin` users can access administrative endpoints.

### 3.2. Course Management System
- **Admin Capabilities:** Admins can Create, Read, Update, and Delete (CRUD) courses. They can upload course thumbnail images, define summaries, and categorize courses.
- **Student View:** Students can browse available courses conditionally based on their enrollment status. Enrolled students gain exclusive access to private course resources.

### 3.3. Live Sessions (Google Meet Integration)
- **Scheduling:** Admins can schedule live classes linked to a specific course, setting the title, date, time, and Google Meet URL.
- **Embedded Viewing:** Students view an embedded, in-app Google Meet room (via an `iframe`) that allows them to attend classes without leaving the ecosystem. A fallback button is included to open Google Meet externally if necessary.

### 3.4. Resource Management
- **Study Materials:** Admins can upload resources (PDFs, PPTs, code files) mapped to specific courses.
- **Access:** Only authenticated users explicitly enrolled in a course can view and download these resources.

### 3.5. Gallery & Portfolio
- **Seminar Gallery:** Admins can upload photos from physical seminars or events to showcase engagement.
- **Web Projects:** A dynamically rendering portfolio where the user can showcase their agency's or personal web projects with external links (GitHub, Drive, etc.).

## 4. System Requirements & Setup Guide

### 4.1. Prerequisites
- **Node.js:** v18 or higher
- **Database:** MongoDB URI (e.g., MongoDB Atlas cluster)
- **Package Manager:** npm

### 4.2. Local Development Server
1. **Clone/Download** the repository.
2. **Backend:**
   ```bash
   cd backend
   npm install
   # Create a .env file with PORT=5000, MONGO_URI, and JWT_SECRET
   npm run seed # Seeds the initial admin account
   npm run dev
   ```
3. **Frontend:**
   ```bash
   cd frontend
   npm install
   # Create a .local.env with NEXT_PUBLIC_API_URL=http://localhost:5000/api
   npm run dev
   ```

## 5. API Reference Guide

### Authentication
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/auth/register` | Register Student | No |
| POST | `/api/auth/login` | Login | No |

### Courses
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/courses` | Fetch all courses | No |
| POST | `/api/courses` | Create a course | Admin Only |
| PUT | `/api/courses/:id` | Update a course | Admin Only |
| DELETE | `/api/courses/:id` | Delete a course | Admin Only |

### Live Sessions
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/live-sessions/course/:id`| Get sessions by course | Yes |
| POST | `/api/live-sessions` | Schedule session | Admin Only |
| PUT | `/api/live-sessions/:id` | Update session | Admin Only |
| DELETE | `/api/live-sessions/:id`| Remove session | Admin Only |

### Resources & Gallery
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/resources/course/:id`| Get resources by course | Yes |
| POST | `/api/resources` | Upload Resource | Admin Only |
| POST | `/api/gallery/upload` | Upload Image | Admin Only |
| DELETE | `/api/gallery/:id` | Delete Image | Admin Only |

## 6. Directory Structure
```text
edtech-platform/
│
├── backend/
│   ├── config/          # Environment & DB connection
│   ├── middleware/      # Auth & Role verification
│   ├── models/          # Mongoose Schemas (User, Course, LiveSession...)
│   ├── routes/          # Express API controllers/routers
│   ├── scripts/         # Seed database utilities
│   ├── uploads/         # Local file storage for uploads
│   └── server.js        # Main entry point
│
├── frontend/
│   ├── src/
│   │   ├── app/         # Next.js App Router (Pages & Layouts)
│   │   ├── components/  # Reusable UI elements (Navbar, Footer, Modals)
│   │   ├── context/     # React Context providers (ThemeContext)
│   │   └── utils/       # Axios API handlers & Auth helpers
│   ├── public/          # Static assets (Favicon, logos)
│   ├── tailwind.config.js # Styling configurations
│   └── package.json     # Client dependencies
│
└── README.md            # Quick start instructions
```

## 7. Security Best Practices Implemented
- Passwords are strictly hashed, never stored in plain-text.
- Sensitive environment variables (`JWT_SECRET`, `MONGO_URI`) are kept out of source code.
- Backend APIs enforce role-checking natively so malicious users cannot bypass the UI to perform admin actions.
- Cross-Origin Resource Sharing (CORS) is configured to connect the decoupled environments safely.
