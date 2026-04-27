import express from 'express';
import { loginUser, registerUser, googleAuth, adminLogin } from '../controllers/userController.js';

const userRouter = express.Router();

userRouter.post('/register', registerUser);
userRouter.post('/login', loginUser);
userRouter.post('/google', googleAuth);
userRouter.post('/admin', adminLogin);

export default userRouter;
