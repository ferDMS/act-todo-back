import { connectDatabase } from './config/database.js';

console.log('Testing database connection...');

// Test the database connection
connectDatabase()
    .then(() => {
        console.log('Test completed');
        process.exit(0);
    })
    .catch((error) => {
        console.error('Test failed:', error);
        process.exit(1);
    }); 