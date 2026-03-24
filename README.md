# HostelMS Frontend

A modern, responsive web application for the Hostel Management System, built with React 19, Vite, and Tailwind CSS.

## Features

- **User Authentication** - Secure login and registration for students and administrators.
- **Student Dashboard** - View room details, track payment history, submit complaints, and manage visitor requests.
- **Admin Dashboard** - Comprehensive overview of hostel statistics, user management, and room occupancy.
- **Room Allocation** - Streamlined flow for students to request rooms and administrators to review and approve allocations.
- **Payment Management** - Upload proof of payments and track approval status.
- **Complaint System** - Submit and track maintenance or security complaints with real-time updates.
- **Visitor Management** - Register and manage visitor entries and exits.
- **Real-time Notifications** - Receive instant updates on room approvals, payment reminders, and system announcements.

## Tech Stack

- **React 19** + **TypeScript**
- **Vite** - High-performance build tool
- **Tailwind CSS 3** - Utility-first styling for a premium UI
- **TanStack Query (React Query)** - Efficient server state management
- **GSAP** - Smooth animations and transitions
- **Lucide React** - Icon library
- **React Router 7** - Modern routing system
- **Sonner** - Beautiful toast notifications

## Quick Start

### 1. Clone and Navigate

```bash
cd hostel-ms
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Setup Environment Variables

Copy `example.env` to `.env.local` (or `.env`):

```bash
cp example.env .env.local
```

Update the `VITE_API_URL` to point to your backend server:

```
VITE_API_URL=http://localhost:8000/api/v1
```

### 4. Run Development Server

```bash
npm run dev
```

The application will be available at: **http://localhost:5173**

## Project Structure

```
src/
├── api/            # API integration and hooks
├── components/     # Reusable UI components
├── layouts/        # Page layouts (Admin, Student, Auth)
├── pages/          # Full page components
├── store/          # Global state management
├── types/          # TypeScript definitions
├── utils/          # Utility functions and constants
└── App.tsx         # Main application entry
```

## Build for Production

```bash
npm run build
```

The production-ready files will be in the `dist/` directory.

## License

MIT
