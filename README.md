# CodeTech LMS

CodeTech is a full-stack learning management system for discovering, creating, purchasing, and completing online courses. It provides separate experiences for students, instructors, and administrators, with course media, quizzes, certificates, real-time meeting workflows, an in-app coding playground, and an AI help assistant.

## Highlights

- Role-based authentication for **students**, **instructors**, and **administrators**
- Course catalogue with search, filters, course details, pricing, and protected learning access
- Instructor workspace to create, edit, and delete courses; upload thumbnails and lessons; and create quiz questions
- Razorpay checkout, server-side payment verification, webhook handling, and automatic enrollment after payment
- Student dashboard, enrolled-course library, lesson progress, course completion, quizzes, and downloadable certificates
- Instructor and admin dashboards with course, user, enrollment, and revenue views
- One-to-one meeting-request workflow with scheduled ZegoCloud video rooms and in-app notifications
- AI assistant powered by the Gemini API, scoped to platform help and rate-limited per user
- Browser-based coding playground backed by the Piston execution API
- Responsive React interface with Tailwind CSS, reusable Radix UI components, charts, animations, and toast feedback
- Installable PWA with update prompts and Cloudinary course-media caching

## Tech Stack

| Layer | Technologies |
| --- | --- |
| Frontend | React 19, Vite, React Router, Tailwind CSS, Radix UI, Axios |
| Backend | Node.js, Express, Mongoose, JWT, bcrypt |
| Database | MongoDB |
| Media | Cloudinary and Multer |
| Payments | Razorpay |
| Video meetings | ZegoCloud UIKit |
| AI | Google Gemini API |
| Code execution | Piston API |

## User Roles

| Role | Capabilities |
| --- | --- |
| Student | Browse and purchase courses, learn from lessons, take quizzes, complete courses, receive certificates, request meetings, and manage a profile. |
| Instructor | Create and manage courses and lessons, build quizzes, review dashboard data, respond to meeting requests, and host scheduled meetings. |
| Admin | Access platform reporting, view students and instructors, and inspect instructor course information. |

## Project Structure

```text
CodeTech-LMS/
├── Backend/
│   ├── middleware/       # Authentication and role guards
│   ├── models/           # MongoDB schemas
│   ├── routes/           # REST API endpoints
│   ├── utils/            # Database, Cloudinary, and token helpers
│   ├── server.js         # Express application entry point
│   └── package.json
├── Frontend/
│   ├── public/           # PWA and static assets
│   ├── src/
│   │   ├── component/    # Shared application components
│   │   ├── components/ui/# Reusable UI primitives
│   │   ├── pages/        # Public, student, instructor, and admin views
│   │   └── utils/        # API client and route guards
│   ├── vite.config.js    # Vite and PWA configuration
│   └── package.json
└── README.md
```

## Getting Started

### Prerequisites

- Node.js 18 or later
- npm
- A MongoDB database (local or Atlas)
- Cloudinary account for course media
- Razorpay account for payments

The following integrations are optional but required to enable their corresponding features: Google Gemini (AI assistant) and ZegoCloud (video meetings).

### 1. Clone the repository

```bash
git clone https://github.com/rehansk09/codetech-lms.git
cd codetech-lms
```

### 2. Configure the backend

```bash
cd Backend
npm install
```

Create `Backend/.env`:

```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb+srv://<username>:<password>@<cluster>/<database>
SECRET_KEY=replace_with_a_long_random_secret
FRONTEND_URL=http://localhost:5173

CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret

RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret
RAZORPAY_WEBHOOK_SECRET=your_razorpay_webhook_secret

GEMINI_API_KEY=your_gemini_api_key
# Optional; defaults to gemini-3.5-flash in the application
GEMINI_CHAT_MODEL=gemini-3.5-flash

ZEGO_APP_ID=your_zego_app_id
ZEGO_SERVER_SECRET=your_zego_server_secret
```

Start the API server:

```bash
npm run dev
```

The backend runs at `http://localhost:5000` by default.

### 3. Configure the frontend

In a second terminal:

```bash
cd Frontend
npm install
```

Create `Frontend/.env`:

```env
VITE_API_URL=http://localhost:5000
VITE_RAZORPAY_KEY_ID=your_razorpay_key_id
```

Start the development server:

```bash
npm run dev
```

Open the local URL printed by Vite (normally `http://localhost:5173`).

## Available Scripts

| Location | Command | Purpose |
| --- | --- | --- |
| `Backend` | `npm start` | Start the Express API. |
| `Backend` | `npm run dev` | Start the API with Nodemon. |
| `Frontend` | `npm run dev` | Start the Vite development server. |
| `Frontend` | `npm run build` | Produce an optimized production build. |
| `Frontend` | `npm run preview` | Preview the production build locally. |
| `Frontend` | `npm run lint` | Run ESLint. |

## API Overview

The API is organized by resource and is consumed by the React client.

| Base path | Responsibility |
| --- | --- |
| `/user` | Registration, login/logout, profiles, users, enrollment, and completion |
| `/course` | Course and lesson management, instructor reporting |
| `/lecture` | Course lesson retrieval and deletion |
| `/api/payments` | Razorpay orders, verification, payment status, and webhook processing |
| `/api/questions` | Quiz questions, submissions, and results |
| `/api/certificates` | Certificate creation and retrieval data |
| `/api/notifications` | Notifications and meeting requests |
| `/api/meetings` | Meeting scheduling, joining, and completion |
| `/api/assistant` | Authenticated Gemini-powered platform assistant |
| `/api/playground` | Coding playground execution proxy |


## Security

- Passwords are hashed with bcrypt and authenticated sessions use HTTP-only JWT cookies.
- Protected routes use authentication and role-based middleware.
- Razorpay payments are verified on the server, including webhook signature validation.
- Keep API keys, database URIs, and payment secrets only in environment variables.

## Contributing

Contributions are welcome. Fork the repository, create a focused branch, make and verify your changes, then open a pull request with a clear description.

