import express from 'express';
import { adminRegisterController } from '../controllers/adminRegisterController.js';

const router = express.Router();

router.post('/', adminRegisterController); 
export default router;
