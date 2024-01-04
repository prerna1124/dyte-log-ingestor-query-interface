import express from 'express';
import { login, signUp } from '../controller/auth-controller';

const router = express.Router();

router.post('/sign-up', signUp);
router.get('/login', login);

export default router;

