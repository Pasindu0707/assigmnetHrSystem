import dotenv from 'dotenv';
import express from 'express';
import path from 'path';
import cors from 'cors';
import corsOptions from './config/corsOptions.js';
import connectDB from './config/dbConnection.js';
import mongoose from 'mongoose';
import { logger } from './middleware/logger.js';
import errorHandler from './middleware/errorHandler.js';
import verifyJWT from './middleware/verifyJWT.js';
import cookieParser from 'cookie-parser';
import credentials from './middleware/credentials.js';

// Get the current file name and directory name
const __dirname = path.resolve()

const app = express();
app.use(express.static(path.join(__dirname,'/client/dist')))

const PORT = process.env.PORT || 3500;

// Database connection
connectDB();

// Custom middleware
app.use(logger);

// Handle options credentials check-before cors
app.use(credentials);

// CORS
app.use(cors(corsOptions));
app.options('*', cors(corsOptions)); 
// Adding middleware
// app.use(express.urlencoded({ extended: false })); // to get form data to res body
app.use(express.json()); // to get json data
app.use(cookieParser());


// // Using the routes with ES modules
import subdirRoutes from './routes/subdir.js';
import adminRegisterRoutes from './routes/adminRegister.js';
import authRoutes from './routes/auth.js'; 
import refreshRoutes from './routes/refresh.js';
import logoutRoutes from './routes/logout.js';
import employeeRoutes from "./routes/employeeRoutes.js";
import departmentRoutes from "./routes/departmentRoutes.js";
import activityLogRoutes from "./routes/activityLogRoutes.js";
import uploadRoutes from "./routes/uploadRoutes.js";

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.use('/', subdirRoutes);
app.use('/register', adminRegisterRoutes);
app.use('/auth', authRoutes); // login
app.use('/refresh', refreshRoutes); // Refresh
app.use('/logout', logoutRoutes); // logout


// app.use(verifyJWT);
app.use("/api/employees", employeeRoutes);
app.use("/api/departments", departmentRoutes);
app.use("/api/activity-logs", activityLogRoutes);
app.use("/api/uploads", uploadRoutes);

// 404
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'index.html'))
});


app.use(errorHandler);

mongoose.connection.once('open', () => {
  console.log("Connected to MongoDB");
  app.listen(PORT, () => console.log(`Running on port ${PORT}`));
});
