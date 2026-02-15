# Bengal Education Ventures - EdTech Platform
*A Programme of BIOROBODRAI*

A full-stack EdTech platform for live, technical skill based learning in AI, Drone Technology, 3D Printing, Bio Technology and other areas.

## Tech Stack

### Backend
- Node.js & Express.js
- MongoDB with Mongoose
- JWT Authentication
- Multer for file uploads
- bcryptjs for password hashing

### Frontend
- Next.js 14 (App Router)
- React 19
- Tailwind CSS
- Axios

## Getting Started

### Prerequisites
- Node.js (v18 or higher)
- MongoDB Atlas account (or local MongoDB)
- npm or yarn

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Environment variables are already configured in `.env`:
   - MongoDB connection string is set
   - JWT_SECRET is configured
   - PORT is set to 5000

4. Create the admin user:
```bash
npm run seed
```

**Admin Credentials:**
- Email: `admin@bengaledu.com`
- Password: `Admin@123`

5. Start the backend server:
```bash
npm run dev
```

The backend will run on `http://localhost:5000`

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. The `.env.local` file is already configured with the API URL

4. Start the development server:
```bash
npm run dev
```

The frontend will run on `http://localhost:3000`

## Features

### For Students
- Browse available courses (AI, Drone Technology, 3D Printing)
- View course details and schedules
- Register and login
- Enroll in courses via Google Forms
- Access live Google Meet sessions (when enrolled)
- Download course resources (when enrolled)
- View seminar gallery

### For Admins
- Create, edit, and delete courses
- Manage live session schedules and Google Meet links
- Upload and manage course resources
- Upload seminar photos to gallery
- Full CRUD access to all content

## API Endpoints Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user

### Courses (Public read, Admin write)
- `GET /api/courses` - Get all courses
- `GET /api/courses/:id` - Get single course
- `POST /api/courses` - Create course (Admin)
- `PUT /api/courses/:id` - Update course (Admin)
- `DELETE /api/courses/:id` - Delete course (Admin)

### Live Sessions
- `GET /api/live-sessions/course/:courseId` - Get sessions for a course
- `POST /api/live-sessions` - Create session (Admin)
- `PUT /api/live-sessions/:id` - Update session (Admin)
- `DELETE /api/live-sessions/:id` - Delete session (Admin)

### Resources (Enrolled students only)
- `GET /api/resources/course/:courseId` - Get resources for a course
- `POST /api/resources` - Create resource (Admin)
- `PUT /api/resources/:id` - Update resource (Admin)
- `DELETE /api/resources/:id` - Delete resource (Admin)

### Gallery (Public read, Admin write)
- `GET /api/gallery` - Get all images
- `POST /api/gallery/upload` - Upload image (Admin)
- `DELETE /api/gallery/:id` - Delete image (Admin)

## Project Structure

```
edtech-platform/
├── backend/
│   ├── config/         # Database configuration
│   ├── models/         # Mongoose schemas
│   ├── middleware/     # Auth & RBAC middleware
│   ├── routes/         # API routes
│   ├── scripts/        # Seed scripts
│   ├── uploads/        # Uploaded images
│   └── server.js       # Express server
├── frontend/
│   ├── src/
│   │   ├── app/        # Next.js pages
│   │   ├── components/ # React components
│   │   ├── utils/      # Utilities (API, auth)
│   │   └── styles/     # Global styles
│   └── public/         # Static assets
└── README.md
```

## Key Features

1. **Role-Based Access Control**: Admin and Student roles with proper authorization
2. **JWT Authentication**: Secure token-based authentication
3. **Dynamic Course Management**: Admin can manage all course content
4. **Conditional Rendering**: Different views for public, enrolled students, and admins
5. **Image Upload**: Multer integration for gallery management
6. **Responsive Design**: Mobile-first, modern UI with Tailwind CSS
7. **Live Sessions**: Google Meet integration for virtual classes
8. **Enrollment System**: Google Forms integration for course enrollment

## Vision

"Empowering the youth of Bengal for the upcoming future. We are charging a minimal amount to ensure the sustainability and continuity of our operations."

## License

ISC

## Support

For questions or support, contact: info@bengaledu.com
