# OpenForm

OpenForm is a free, open-source alternative to tools like Google Forms and Typeform. It is built using the MERN stack (MongoDB, Express, React, and Node.js).

The goal of this project is to provide a simple, secure, and visually appealing way to collect data. Instead of showing a long list of questions, it shows users one question at a time to make filling out forms less overwhelming.

## Key Features

- **Dynamic Form Builder:** Creators can build custom forms with different question types (short text, long text, multiple choice, and checkboxes).
- **Conversational Interface:** Respondents see one question at a time. They can navigate using their keyboard or by clicking.
- **Secure Authentication:** Users must create an account to build forms. Passwords are encrypted, and sessions are managed securely using JSON Web Tokens (JWT).
- **Responses Dashboard:** A private dashboard where form creators can view all the answers submitted by respondents in a clear table format.
- **Built-in Security:** The backend is protected against common web vulnerabilities, including NoSQL injections, cross-site scripting, and brute-force login attempts.

## How It Works

The application is split into two main parts:

1. **The Frontend (React):** This is the user interface. It handles what the user sees and interacts with. It communicates with the backend to fetch forms and submit answers.
2. **The Backend (Express & Node.js):** This is the server. It handles the logic, verifies who is logged in, and talks to the database.
3. **The Database (MongoDB):** This is where all the data (user accounts, forms, and responses) is permanently stored.

## Local Setup Instructions

If you want to run this project on your own computer, follow these steps. You will need Node.js installed.

### 1. Start the Backend Server
Open a terminal, navigate to the backend folder, install the required packages, and start the server.

```bash
cd backend
npm install
npm run dev
```

Note: By default, the backend will use a temporary in-memory database for quick testing. If you want to save data permanently, you must create a free MongoDB Atlas account and add your connection string to the `backend/.env` file.

### 2. Start the Frontend Application
Open a second terminal window, navigate to the frontend folder, install the packages, and start the application.

```bash
cd frontend
npm install
npm run dev
```

The application will start, and you can view it in your browser at `http://localhost:5173`.
