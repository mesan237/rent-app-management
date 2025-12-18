# MOKCPA - Rental Management System

## 📝 Project Overview

**MOKCPA** is a rental management application designed to help manage apartment buildings, track tenant information, handle rent payments, and manage expenses. It's built with the **MERN Stack** (MongoDB, Express, React, Node.js).

This system is perfect for property managers or landlords who need to organize tenant data, monitor rent payments, track building expenses, and maintain a complete history of all transactions.

---

## 🎯 Main Features

### 👥 Tenant Management
- Add and manage tenant information
- Track tenant payment status
- Organize tenants by room/apartment numbers
- View tenant payment history
- Monitor arrears (outstanding payments)

### 💰 Payment Tracking
- Record rent payments from tenants
- Track payment dates and amounts
- Monitor payment status in real-time
- Generate payment history reports
- Identify overdue payments

### 📊 Expense Management
- Record building expenses (maintenance, repairs, utilities, etc.)
- Categorize expenses by type and building
- Track expenses by date
- Generate expense reports and analytics
- Manage expenses for different buildings (A and B)

### 📈 Dashboard & Analytics
- View key metrics (total payments, expenses, active tenants)
- Interactive charts and graphs for financial overview
- Payment trends visualization
- Expense breakdown by category
- Quick statistics overview

### 📋 Audit & Logging
- Complete activity history tracking
- Log all user actions (create, update, delete)
- Track who made changes and when
- View historical records
- Maintain data integrity with audit trails

### 🔐 User Management
- Secure login system
- Role-based access control
- User account management
- Password security with encryption
- User activity tracking

### 🎨 User Interface
- Clean and modern dashboard
- Easy-to-use forms for data entry
- Dark mode/Light mode toggle
- Responsive design for all devices
- Intuitive navigation

---

## 🏗️ Project Structure

```
mokcpa/
├── backend/                 # Node.js/Express Server
│   ├── config/             # Database configuration
│   ├── controllers/        # Business logic for each feature
│   ├── models/             # Database schemas (Tenant, Payment, Expense, User, Logs)
│   ├── routes/             # API endpoints
│   ├── middleware/         # Authentication, error handling, logging
│   ├── datas/              # Sample data for seeding
│   ├── utils/              # Helper functions
│   ├── seeders.js          # Database initialization script
│   └── server.js           # Main server file
│
└── frontend/               # React Application
    ├── src/
    │   ├── components/     # Reusable UI components
    │   ├── Pages/          # Main pages (Dashboard, Payments, Expenses, etc.)
    │   ├── slices/         # Redux state management
    │   ├── utils/          # Frontend utilities
    │   ├── App.js          # Main app component
    │   └── store.js        # Redux store configuration
    └── public/             # Static files
```

---

## 🛠️ Technology Stack

### Backend
- **Node.js** - JavaScript runtime
- **Express** - Web framework
- **MongoDB** - NoSQL database
- **Mongoose** - Database ODM
- **JWT** - Authentication tokens
- **Bcrypt** - Password encryption
- **Node-Cron** - Scheduled tasks

### Frontend
- **React** - UI library
- **Redux Toolkit** - State management
- **Material-UI (MUI)** - UI components
- **Axios** - HTTP client
- **React Router** - Navigation
- **React Hook Form** - Form handling

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v14 or higher)
- MongoDB database
- npm or yarn package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd mokcpa
   ```

2. **Install dependencies**
   ```bash
   npm run build
   ```
   This command will install both backend and frontend dependencies.

3. **Set up environment variables**
   - Create a `.env` file in the root directory
   - Add the following variables:
     ```
     PORT=5000
     MONGODB_URI=mongodb://localhost:27017/mokcpa
     JWT_SECRET=your_secret_key_here
     NODE_ENV=development
     ```

4. **Load sample data (optional)**
   ```bash
   npm run data:import
   ```

### Running the Application

#### Development Mode
Run both backend and frontend simultaneously:
```bash
npm run dev
```

#### Backend Only
```bash
npm run server
```

#### Frontend Only
```bash
npm run client
```

#### Production Mode
```bash
npm start
```

### Available Scripts

- `npm start` - Start production server
- `npm run server` - Start backend with auto-reload (Nodemon)
- `npm run client` - Start frontend development server
- `npm run dev` - Run backend and frontend concurrently
- `npm run data:import` - Populate database with sample data
- `npm run data:destroy` - Remove all database data
- `npm run build` - Build for production

---

## 📱 Main Pages

1. **Dashboard** - Overview of all important metrics and statistics
2. **List of Tenants** - View and manage all tenants
3. **Payments/Versements** - Track and record rent payments
4. **Expenses** - Manage building expenses
5. **History/Logs** - View all activity history and audit logs
6. **User Profile** - Manage user account

---

## 🔄 How It Works

### User Workflow
1. User logs in with credentials
2. Views dashboard for quick overview
3. Can manage tenants (add, edit, view)
4. Records tenant payments
5. Records building expenses
6. Views reports and analytics
7. Checks activity history

### Automatic Features
- **Monthly Updates**: System automatically updates tenant information on the 28th of each month
- **Audit Logging**: All changes are logged automatically with user information and timestamps

---

## 🔒 Security Features

- Password encryption with bcryptjs
- JWT-based authentication
- User activity tracking
- Role-based access control
- Secure API endpoints
- CORS protection
- Cookie-based sessions

---

## 📄 API Endpoints

### Tenants
- `GET /api/locataires` - Get all tenants
- `POST /api/locataires` - Add new tenant
- `PUT /api/locataires/:id` - Update tenant
- `DELETE /api/locataires/:id` - Delete tenant

### Payments
- `GET /api/versement` - Get all payments
- `POST /api/versement` - Record new payment
- `PUT /api/versement/:id` - Update payment
- `DELETE /api/versement/:id` - Delete payment

### Expenses
- `GET /api/depenses` - Get all expenses
- `POST /api/depenses` - Add new expense
- `PUT /api/depenses/:id` - Update expense
- `DELETE /api/depenses/:id` - Delete expense

### Users
- `POST /api/users/login` - User login
- `POST /api/users/register` - User registration
- `GET /api/users/profile` - Get user profile

### Logs
- `GET /api/logs` - Get activity history
- `POST /api/logs` - Create log entry

---

## 💡 Key Concepts

### Locataire (Tenant)
A person renting an apartment. Each tenant is assigned to a room (e.g., 1A, 2B, studio 1B).

### Versement (Payment)
A rent payment made by a tenant, recorded with the date and amount.

### Depense (Expense)
Building-related expenses like maintenance, utilities, repairs, etc.

### Batiment (Building)
The property is divided into Building A and Building B.

---

## 🎓 Author

**Abed Nego**

---

## 📜 License

MIT License - Feel free to use this project for personal or commercial purposes.

---

## 📞 Support & Notes

This project uses:
- Modern JavaScript (ES6 modules)
- Responsive design for mobile and desktop
- Real-time updates with Redux
- Professional UI with Material Design

For more information or issues, please check the project repository.

---

**Happy Property Managing! 🏘️**
