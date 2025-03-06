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
app.use(express.json());
app.use(cookieParser());
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

//Importing the routes
import subdirRoutes from './routes/subdir.js';
import adminRegisterRoutes from './routes/adminRegister.js';
import authRoutes from './routes/auth.js'; 
import refreshRoutes from './routes/refresh.js';
import logoutRoutes from './routes/logout.js';
import employeeRoutes from "./routes/employeeRoutes.js";
import departmentRoutes from "./routes/departmentRoutes.js";
import activityLogRoutes from "./routes/activityLogRoutes.js";

app.use('/', subdirRoutes);
app.use('/register', adminRegisterRoutes); //register a HR manager
app.use('/auth', authRoutes); // login
app.use('/refresh', refreshRoutes); // Refresh
app.use('/logout', logoutRoutes); // logout


app.use(verifyJWT); //without JWT token can't access the below 
app.use("/api/employees", employeeRoutes);
app.use("/api/departments", departmentRoutes);
app.use("/api/activity-logs", activityLogRoutes);

// 404
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'index.html'))
});


app.use(errorHandler);

mongoose.connection.once('open', () => {
  console.log("Connected to MongoDB");
  app.listen(PORT, () => console.log(`Running on port ${PORT}`));
});
