# Zuba House Stock Management System

A full-stack Stock Management System developed for Zuba House to streamline inventory management, sales tracking, purchase recording, expense monitoring, reporting, and user access control.

---

## Live Application

**Frontend URL:** [https://project-onlvk.vercel.app]

**Backend API URL:** [https://stock-management-system-73kh.onrender.com]

---

## Features

### Inventory Management

* Add new products
* Edit product information
* Delete products
* Product categorization
* Stock quantity tracking
* Duplicate product prevention
* Real-time inventory updates

### Purchase Management

* Record purchases
* Track purchase history
* Automatic stock updates after purchases

### Sales Management

* Record sales transactions
* Automatic stock deduction
* Revenue tracking

### Expense Management

* Record business expenses
* Expense categorization
* Expense history tracking

### Reports & Analytics

* Inventory reports
* Sales reports
* Purchase reports
* Expense reports
* Profit analysis
* Monthly business summaries

### Notifications

* Success notifications
* Error notifications
* Inventory-related alerts
* User activity feedback

### Authentication & Security

* Email and password authentication
* Google OAuth authentication
* JWT-based authentication
* Protected routes
* Secure API access

### User Management & Access Control

#### Administrator Capabilities

* Full system access
* Manage products
* Manage purchases
* Manage sales
* Manage expenses
* View all reports
* Manage authorized users
* Add approved email addresses for Google authentication
* Remove authorized users
* Access application settings
* Manage user permissions

#### Standard User Capabilities

* View inventory information
* View purchases
* View sales
* View expenses
* View reports
* Access operational data
* Cannot manage users
* Cannot access administrative settings

---

## User Roles

### Admin

Administrators have complete control over the system including inventory management, sales management, expense management, reporting, settings, and user management.

### User

Users can access stock management information and operational reports according to their assigned permissions but cannot modify administrative settings or manage other users.

## Technology Stack

### Frontend

* React
* TypeScript
* Vite
* Tailwind CSS
* Axios
* React Router

### Backend

* Node.js
* Express.js
* PostgreSQL
* Neon Database
* Passport.js
* JWT Authentication

### Deployment

* Frontend: Vercel
* Backend: Render
* Database: Neon PostgreSQL

---

## Project Structure

```text
Stock_Management_System
│
├── Frontend
│   ├── src
│   ├── public
│   └── ...
│
├── Backend
│   ├── src
│   ├── scripts
│   └── ...
│
└── README.md
```

---

## Environment Variables

### Backend

Create a `.env` file inside the Backend directory:

```env
PORT=
NODE_ENV=
DATABASE_URL=

JWT_SECRET=
JWT_EXPIRES_IN=

REFRESH_TOKEN_SECRET=
REFRESH_TOKEN_EXPIRES_IN=

GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
GOOGLE_CALLBACK_URL=

CLIENT_URL=
```

### Frontend

Create a `.env` file inside the Frontend directory:

```env
VITE_API_URL=
```

---

## Local Installation

### Clone Repository

```bash
git clone <[https://github.com/Unejumutima/Stock_Management_System.git]>
cd Stock_Management_System
```

### Backend Setup

```bash
cd Backend
npm install
npm run dev
```

### Frontend Setup

```bash
cd Frontend
npm install
npm run dev
```

---

## Production Build

### Frontend

```bash
npm run build
```

### Backend

```bash
npm start
```

---

## Project Purpose

This project was developed for Zuba House as an internal stock management solution to improve inventory control, sales tracking, expense monitoring, reporting, and user administration.

---

## Author

**Honorine Ikirezi**

GitHub: https://github.com/Unejumutima
