import express from 'express';
import bodyParser from 'body-parser';
import logRoutes from './routes/log-routes';
import userRoutes from './routes/user-routes';
import { errorHandler } from './util/error-handler';
import cookieParser from 'cookie-parser';


const app = express();

app.use(bodyParser.json());
app.use(cookieParser());


// Routes
app.use('/api/logs', logRoutes);
app.use('/api/users', userRoutes);

// Error handling middleware
app.use(errorHandler);

export default app;

