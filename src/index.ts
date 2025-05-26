import express, { Request, Response } from 'express';
import { connectDatabase } from './config/database.js';
import cors from 'cors';
import taskRoutes from './routes/taskRoutes.js';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/todos', taskRoutes);

// Test route
app.get('/', (req: Request, res: Response) => {
    res.json({ message: 'API is running' });
});

// Health check route
app.get('/health', (req: Request, res: Response) => {
    res.json({ status: 'OK', timestamp: new Date() });
});

// Error handling middleware
app.use((err: Error, req: Request, res: Response) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Something went wrong!' });
});

// Start server
const startServer = async () => {
    try {
        // Connect to database
        await connectDatabase();
        
        // Start listening
        app.listen(PORT, () => {
            console.log(`Server is running on http://localhost:${PORT}`);
        });
    } catch (error) {
        console.error('Failed to start server:', error);
        process.exit(1);
    }
};

startServer(); 