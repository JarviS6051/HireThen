📊 Finance Tracker
Finance Tracker is a cross-platform mobile application designed to help users efficiently manage their personal finances. The app is built using React Native (via Expo) for the frontend and Node.js, Express, and MongoDB for the backend.

🔗 Expo App Link: https://expo.dev/artifacts/eas/eEnDyjsmJXSQZwfKGbpcxP.aab

✨ Features
🔐 User Authentication
Secure login and registration using JWT

Passwords are securely encrypted with bcrypt

Persistent user sessions

📈 Dashboard
Visual overview of financial health

Income vs Expense chart

Categorized expense breakdown

Display of recent transactions

Real-time balance calculation

💸 Transaction Management
Add, edit, and delete transactions

Filter by income or expense

Support for one-time and recurring transactions

Transaction categorization

Pagination for large datasets

🧾 Budget Tracking
Create budgets for different categories

Custom budget periods: daily, weekly, monthly, yearly

Alerts for overspending

Visual comparison of actual vs budgeted expenses

🎨 UI/UX Enhancements
Cross-platform support (iOS & Android)

Modern and intuitive UI

Interactive charts for data visualization

Pull-to-refresh functionality

Offline data access support

🛠 Technology Stack
🖥 Frontend (Mobile App)
React Native – Cross-platform mobile development

Expo – App deployment and development

React Navigation – Seamless screen navigation

React Native Chart Kit – Financial data visualization

AsyncStorage – Local data storage

Axios – API communication

🌐 Backend (API Server)
Node.js – Backend runtime

Express.js – REST API framework

MongoDB – NoSQL database

Mongoose – ODM for MongoDB

JWT – Token-based authentication

Bcrypt – Password encryption

📁 Project Structure
bash
Copy
Edit
finance-tracker/
│
├── backend/                 # Backend API
│   ├── config/              # Configurations (DB, env)
│   ├── controllers/         # Business logic handlers
│   ├── middleware/          # Authentication and validations
│   ├── models/              # Mongoose schemas
│   ├── routes/              # API endpoints
│   └── utils/               # Helper functions
│
└── frontend/                # Mobile app
    ├── assets/              # Static files
    └── src/
        ├── api/             # API service methods
        ├── app/             # Main app wrapper
        ├── components/      # Reusable components
        ├── context/         # Global state (Context API)
        ├── navigation/      # Navigation config
        ├── screens/         # App screens (Dashboard, etc.)
        └── utils/           # Utility functions and constants
⚙️ Setup & Installation
Prerequisites
Node.js

MongoDB

Expo CLI

📦 Backend Setup
Navigate to the backend directory:

bash
Copy
Edit
cd backend
Install dependencies:

bash
Copy
Edit
npm install
Create a .env file with the following variables:

ini
Copy
Edit
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
PORT=3000
Start the backend server:

bash
Copy
Edit
npm run dev
📱 Frontend Setup
Navigate to the frontend directory:

bash
Copy
Edit
cd frontend
Install dependencies:

bash
Copy
Edit
npm install
Update API base URL in src/utils/constants.js:

js
Copy
Edit
export const API_URL = 'http://<your-backend-ip>:3000/api';
Start the Expo development server:

bash
Copy
Edit
npm start
Run the app on a device:

Use Expo Go to scan the QR code

Or launch it on an emulator

🔌 API Endpoints
🔐 Authentication
Method	Endpoint	Description
POST	/api/auth/register	Register new user
POST	/api/auth/login	Login user
GET	/api/auth/me	Fetch current user details
💳 Transactions
Method	Endpoint	Description
GET	/api/transactions	Get all transactions
GET	/api/transactions/:id	Get a specific transaction
POST	/api/transactions	Add new transaction
PUT	/api/transactions/:id	Update a transaction
DELETE	/api/transactions/:id	Delete a transaction
GET	/api/transactions/summary	Get transaction summary
📊 Budgets
Method	Endpoint	Description
GET	/api/budgets	Get all budgets
GET	/api/budgets/:id	Get specific budget
POST	/api/budgets	Create new budget
PUT	/api/budgets/:id	Update budget
DELETE	/api/budgets/:id	Delete budget
GET	/api/budgets/status	Get budget status and alerts
