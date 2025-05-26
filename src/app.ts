import express from 'express';
import { json } from 'body-parser';
import setTodoRoutes from './routes/taskRoutes';
import setUserRoutes from './routes/userRoutes';
import { connectDatabase } from './config/database';

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(json());

// Database connection
connectDatabase();

// Routes
setTodoRoutes(app);
setUserRoutes(app);

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});