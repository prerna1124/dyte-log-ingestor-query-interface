import express from 'express';
import { createLog, healthCheck, searchLogs } from '../controller/log-controller';
import authenticate from '../service/auth-service';

const router = express.Router();

router.post('/', createLog);
router.get('/', authenticate, searchLogs);
router.get('/health', healthCheck);

export default router;
