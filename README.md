Personal Finance Tracker

A cross-platform mobile application designed to help users manage their personal finances efficiently. Built with React Native for the frontend and Node.js with Express & MongoDB for the backend.

Features

User Authentication

Secure authentication using JWT

User registration and login functionality

Password encryption with bcrypt for added security

Dashboard

Overview of financial health

Income vs expense visualization

Categorized expense breakdown

Recent transactions display

Real-time balance calculation

Transaction Management

Add, edit, and remove transactions

Filter transactions by type (income/expense)

Support for recurring and one-time transactions

Categorization for better tracking

Pagination for managing large datasets

Budget Tracking

Create and manage budgets for various categories

Custom budget periods (daily, weekly, monthly, yearly)

Alert system for overspending

Visual representation of budget utilization

Comparison of budgeted vs actual expenses

UI/UX Enhancements

Cross-platform support (iOS & Android)

Modern and intuitive interface

Interactive financial charts

Pull-to-refresh for updated data

Offline data access for seamless experience

Technology Stack

Frontend

React Native - Mobile app framework

Expo - Development and deployment tool

React Navigation - Smooth navigation system

React Native Chart Kit - Graphical data representation

AsyncStorage - Local data storage

Axios - API request handling

Backend

Node.js - Backend runtime environment

Express - Web application framework

MongoDB - NoSQL database for efficient data storage

Mongoose - ORM for database management

JWT - Secure authentication mechanism

Bcrypt - User password encryption

Project Structure

finance-tracker/
   backend/               # Backend API
   config/            # Configurations
   controllers/       # API controllers
   middleware/        # Authentication & validation
   models/            # Database models
   routes/            # API route handlers
   utils/             # Utility functions

 frontend/              # Mobile application
   assets/            # Static assets
   src/
   api/           # API services
   app/           # Navigation setup
   components/    # Reusable UI elements
   context/       # Global state management
   navigation/    # Routing system
   screens/       # Application screens
   utils/         # Utility functions

Setup and Installation

npm

MongoDB

Expo CLI

Backend Setup

Navigate to the backend directory:

cd backend

Install dependencies:

npm install

Configure environment variables in .env:

PORT=3000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=jwt_secret

Start the backend server:

npm run dev

Frontend Setup

Navigate to the frontend directory:

cd frontend

Install dependencies:

npm install

Set the API URL in src/utils/constants.js:

export const API_URL = 'http://backend-url:3000/api';

Start the Expo development server:

npm start

Run on a device or emulator:

Scan the QR code using the Expo Go app

API Endpoints

Authentication

POST /api/auth/register - Register a new account

POST /api/auth/login - Authenticate user

GET /api/auth/me - Retrieve user details

Transactions

GET /api/transactions - Retrieve all transactions

GET /api/transactions/:id - Retrieve a specific transaction

POST /api/transactions - Add a new transaction

PUT /api/transactions/:id - Modify a transaction

DELETE /api/transactions/:id - Remove a transaction

GET /api/transactions/summary - Get transaction summary

Budgets

GET /api/budgets - List all budgets

GET /api/budgets/:id - Retrieve a specific budget

POST /api/budgets - Create a budget plan

PUT /api/budgets/:id - Update an existing budget

DELETE /api/budgets/:id - Remove a budget

GET /api/budgets/status - Check budget health & alerts