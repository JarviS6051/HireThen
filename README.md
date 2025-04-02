# Personal Finance Tracker

A cross-platform mobile application for personal finance management built with React Native (frontend) and Node.js with Express & MongoDB (backend).

## Features

### User Authentication
- Secure JWT-based authentication
- User registration and login
- Password encryption using bcrypt

### Dashboard
- Overview of financial status
- Income vs expense visualization
- Expense breakdown by category
- Recent transactions display
- Current balance calculation

### Transaction Management
- Add, edit, and delete transactions
- Filter transactions by type (income/expense)
- Support for one-time and recurring transactions
- Transaction categorization
- Pagination for large transaction lists

### Budget Tracking
- Create budgets for different expense categories
- Set budget periods (daily, weekly, monthly, yearly)
- Configurable alert thresholds
- Visual indicators for budget status
- Budget vs actual spending comparison

### UI/UX Features
- Cross-platform compatibility (iOS & Android)
- Intuitive user interface
- Interactive charts and visualizations
- Pull-to-refresh for data updates
- Offline data persistence

## Technology Stack

### Frontend
- **React Native** - Cross-platform mobile framework
- **Expo** - React Native development platform
- **React Navigation** - Navigation library
- **React Native Chart Kit** - Data visualization
- **AsyncStorage** - Local data persistence
- **Axios** - HTTP client for API requests

### Backend
- **Node.js** - JavaScript runtime
- **Express** - Web application framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB object modeling
- **JWT** - Authentication mechanism
- **Bcrypt** - Password hashing

## Project Structure

```
finance-tracker/
├── backend/               # Backend Node.js application
│   ├── config/            # Configuration files
│   ├── controllers/       # API controllers
│   ├── middleware/        # Custom middleware
│   ├── models/            # Mongoose models
│   ├── routes/            # API routes
│   └── utils/             # Utility functions
│
└── frontend/              # React Native mobile application
    ├── assets/            # App assets (images, fonts)
    └── src/
        ├── api/           # API service functions
        ├── app/           # Expo Router configuration
        ├── components/    # Reusable UI components
        ├── context/       # Global state management
        ├── navigation/    # Navigation configuration
        ├── screens/       # App screens
        └── utils/         # Utility functions
```

## Setup and Installation

### Prerequisites
- Node.js (v14+)
- npm or yarn
- MongoDB
- Expo CLI

### Backend Setup
1. Navigate to the backend directory:
   ```
   cd backend
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Create a `.env` file with the following variables:
   ```
   PORT=5000
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   ```

4. Start the server:
   ```
   npm run dev
   ```

### Frontend Setup
1. Navigate to the frontend directory:
   ```
   cd frontend
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Update the API URL in `src/utils/constants.js` to point to your backend server:
   ```javascript
   export const API_URL = 'http://backend-url:5000/api';
   ```

4. Start the Expo development server:
   ```
   npm start
   ```

5. Run on a device or emulator:
   - Scan the QR code with the Expo Go app on your device
   - Press 'a' to run on an Android emulator
   - Press 'i' to run on an iOS simulator

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user info

### Transactions
- `GET /api/transactions` - Get all transactions
- `GET /api/transactions/:id` - Get a single transaction
- `POST /api/transactions` - Create a transaction
- `PUT /api/transactions/:id` - Update a transaction
- `DELETE /api/transactions/:id` - Delete a transaction
- `GET /api/transactions/summary` - Get transaction summary

### Budgets
- `GET /api/budgets` - Get all budgets
- `GET /api/budgets/:id` - Get a single budget
- `POST /api/budgets` - Create a budget
- `PUT /api/budgets/:id` - Update a budget
- `DELETE /api/budgets/:id` - Delete a budget
- `GET /api/budgets/status` - Get budget status with alerts

## Key Features Implementation

### Transaction Management
The app allows users to track their income and expenses with detailed categorization. Each transaction can be one-time or recurring with various frequency options (daily, weekly, monthly, yearly). The transaction list provides filtering capabilities and shows the total income and expenses at the top.

### Budget System
Users can set budgets for different expense categories with customizable periods and alert thresholds. The app calculates spending against each budget and provides visual feedback when spending approaches or exceeds the set threshold. The budget screen provides an overall view of all budgets and their current status.

### Data Visualization
The dashboard presents financial information through interactive charts:
- Pie chart showing expense distribution by category
- Bar chart comparing income vs expenses
- Progress indicators for budget utilization

### Offline Support
The app implements a caching strategy using AsyncStorage to provide offline access to previously loaded data. This ensures users can view their financial information even without an internet connection.

## Future Enhancements
- Push notifications for budget alerts
- Expense forecasting
- Financial goal setting
- Data export functionality


## License
This project is licensed under the MIT License.
