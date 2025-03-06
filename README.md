# Project Setup Guide

## Prerequisites

Ensure you have the following installed on your system:

- [Node.js v20.18.3](https://nodejs.org/)
- [npm v11.1.0](https://www.npmjs.com/)
- Angular CLI v19.2.1

## Project Structure

```
project-root/
  backend/  # Node.js Express Backend
  frontend/ # Angular Frontend
```

---

## Backend Setup

1. Navigate to the backend directory:
   ```sh
   cd backend
   ```
2. Install dependencies:
   ```sh
   npm install
   ```
3. `.env` file is not secured becouse of the assigment (on the github)
   
4. Start the backend server:
   ```sh
   npm start
   ```

5. The backend will run on `http://localhost:3500`.

---

## Frontend Setup

1. Navigate to the frontend directory:
   ```sh
   cd ../frontend
   ```
2. Install dependencies:
   ```sh
   npm install
   ```
3. Start the Angular development server:
   ```sh
   ng serve
   ```
4. The frontend will run on `http://localhost:4200`.

---

## Running the Full Stack Application

1. Open two terminal windows:
   - One for the backend: Navigate to `backend/` and run `npm start`.
   - One for the frontend: Navigate to `frontend/` and run `ng serve`.
2. Ensure the backend is running before accessing the frontend.
3. Open a browser and go to `http://localhost:4200` to see the application.
4. It will navigate to the `http://localhost:4200/login`

---
