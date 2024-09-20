# Wealthwise - Backend

## Project Overview

Wealthwise is a personalized finance management application that allows users to manage their income and expenses. Users can configure categories that suit their financial habits, allocate budgets, and track their transactions. The application provides insightful analytics via a dashboard, displaying graphs and charts based on the user's financial data. An admin panel offers a complete paginated report of all transactions with search and sort functionalities. Wealthwise also includes automated notifications to remind users of recurring monthly incomes or expenses through email.

---

## Features

### 1. **User Authentication and Authorization**

- Users can sign in and manage their personal finance data.
- Roles: Admin and User. Admin has privileges to view and manage reports, while users can manage their personal income and expenses.
- JSON Web Tokens (JWT) are used for secure user sessions.

### 2. **Income and Expense Management**

- Users can add incomes and expenses categorized by pre-configured categories.
- Users can configure income and expense categories upon login and modify them later in their settings page.
- Budgets can be set for categories, and users receive notifications when budgets are exceeded.

### 3. **Recurring Notifications**

- Automated emails notify users about recurring monthly incomes or expenses.
- Jobs run via `node-cron` to send reminders based on set schedules.

### 4. **Analytics Dashboard**

- Users can view a personalized dashboard with graphs and charts showcasing income, expense trends, and budget usage.
- Insights into financial health are displayed via visual data.

### 5. **Admin Dashboard**

- The admin can view all user transactions in a paginated table with search and sort filters.
- Detailed financial reports help in decision-making and tracking.

---

## Tech Stack

- **Node.js** - Server-side JavaScript runtime.
- **Express.js** - Web framework for building RESTful APIs.
- **PostgreSQL** - SQL database used for storing users' financial data.
- **Supabase** - Backend-as-a-service providing PostgreSQL and authentication.
- **Sequelize** - ORM for PostgreSQL.
- **JWT** - For handling secure user authentication.
- **Socket.io** - Used for real-time communication (if applicable).
- **Nodemailer** - For sending email notifications.

---

## Folder Structure

```
src/
│
├── controllers/    # Controllers for handling requests
├── helpers/        # Helper functions and utilities
├── socket/         # For socket communication
├── middlewares/    # Middleware functions for authentication and authorization
├── models/         # Mongoose models for database entities
├── routes/         # Route definitions
├── utils/          # Utility functions and configurations
├── jobs/           # Cron Jobs
├── app.js          # Main application file
└── ...
```

---

## Entities

- **User**: Manages user data and authentication.
- **Income**: Handles user income-related operations.
- **Expense**: Handles user expense-related operations.
- **Income Categories**: Stores various categories for income management.
- **Expense Categories**: Stores various categories for expense management.
- **Budgets**: Allows users to set budgets for specific categories.
- **Income Config**: Stores recurring income configurations.
- **Expense Config**: Stores recurring expense configurations.

---

## Installation

### Prerequisites

Ensure you have the following installed:

- Node.js
- npm
- MongoDB

### Installation

1. Pull the repository to your local machine.

```
git pull
```

2. To install all the dependencies:

```
npm install
```

3. Once everything is installed successfully, now it's time to run the server.

```
npm run dev
```

---

### Configuration

```
DB_USER = db_user_name
DB_PASSWORD = db_password
DB_PORT = db_port
SERVER_PORT=3000
SECRET_KEY=your_jwt_secret
EMAIL_ID=your_email_id
APP_PASSWORD=your_email_app_password
```

### To have a walkthrough into Quick Fix

#### Here are admin credentials

> - vsvs2209@gmail.com
> - password: Admin@123
