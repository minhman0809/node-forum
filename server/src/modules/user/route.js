import express from 'express';
import UserController from './UserController';


const userRouter = express.Router();

userRouter.get('/users', UserController.index);
userRouter.post('/auth/login', UserController.login);

export default userRouter;
