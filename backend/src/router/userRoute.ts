import express from 'express'
import { login, signUp } from '../controller/userController'
import { refreshToken } from '../controller/authController';

const router = express.Router()

router.post('/signup', signUp)
router.post('/login', login);
router.post('./refresh-token', refreshToken)

export default router;