# Social Media Web Application

A production-grade, responsive, and robust Social Media web application built with modern React.

## 🚀 Features

- **Advanced Interactions**: Facebook-style Like/Unlike toggling with instantaneous optimistic UI updates.
- **Dynamic User Profiles**: Dedicated profile pages (`/profile/:userId`) with user stats, connections, and personal post feeds.
- **Connections / Follow System**: Follow and Unfollow other users to curate your network.
- **Stories System**: View interactive, auto-advancing stories and seamlessly create your own using a modal interface.
- **Real-time Search**: Search bar in the navigation header to instantly find users and posts.
- **Robust Commenting**: Add and delete comments seamlessly with optimistic updates.
- **Premium UI/UX**: Dark mode support, glassmorphism elements, loading skeletons, error boundaries, and fully responsive Tailwind CSS design.

## 🛠 Tech Stack

- **Framework**: [React 19](https://react.dev/) + [Vite](https://vitejs.dev/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Routing**: [React Router DOM](https://reactrouter.com/) (v7)
- **State Management**: 
  - [Zustand](https://github.com/pmndrs/zustand) (Global UI State: Auth & Theme)
  - [TanStack Query / React Query](https://tanstack.com/query/latest) (Server State & Optimistic Updates)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Form Handling**: [React Hook Form](https://react-hook-form.com/) + [Zod](https://zod.dev/)
- **Backend Mock**: [JSON Server](https://github.com/typicode/json-server)

## 🏗 Architecture & Data Flow

This application adheres to a strict separation of concerns:
- **Zustand** is utilized exclusively for client-side global UI states, such as the active theme (Dark/Light mode) and the current authenticated user session.
- **TanStack React Query** handles all asynchronous server state. It fetches data, manages caching, synchronizes data, and executes **Optimistic Updates**. When a user likes a post, adds a comment, or follows someone, the UI updates instantly before the server confirms the mutation, ensuring a snappy, seamless experience.

## 📦 Getting Started

### Prerequisites
- Node.js (v18+ recommended)
- npm or yarn

### 1. Install Dependencies
```bash
npm install
```

### 2. Run the Mock Backend (JSON Server)
In a new terminal window, start the JSON server to serve `db.json`:
```bash
npx json-server db.json --port 3000
```

### 3. Start the Development Server
In another terminal window, start the Vite development server:
```bash
npm run dev
```

The application will be available at `http://localhost:5173`.

## 📂 Project Structure

```
src/
├── apis/          # Axios instances and API call definitions (Posts, Users, Auth)
├── assets/        # Static assets (images, icons)
├── components/    # Reusable UI components (PostCard, CommentCard, Skeletons, Navbar, etc.)
├── interfaces/    # TypeScript interfaces and types
├── pages/         # Route components (Home, Profile, PostDetails, Login, Register)
├── schema/        # Zod validation schemas for forms
├── Stores/        # Zustand stores (useAuthStore, useThemeStore)
├── App.tsx        # Main application component and routing configuration
└── main.tsx       # Entry point and React Query Provider
```
