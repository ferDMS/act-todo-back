import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables from .env file
dotenv.config({ path: path.join(__dirname, '../../.env') });

// Validate required environment variables
if (!process.env.DB_NAME || !process.env.DB_USER || !process.env.DB_PASSWORD || !process.env.DB_HOST || !process.env.DB_PORT) {
    throw new Error('Missing required database environment variables. Please check your .env file');
}

// Create database configuration
const dbConfig = {
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT),
    dialect: 'mysql' as const,
    dialectOptions: {
        ssl: {
            require: true,
            rejectUnauthorized: false // Allows self-signed certificates
        }
    },
    logging: false // Set to console.log to see SQL queries
};

// Create the main sequelize instance
const sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASSWORD,
    dbConfig
);

// Create test database instance if in test environment
const testSequelize = process.env.NODE_ENV === 'test' 
    ? new Sequelize(
        `${process.env.DB_NAME}_test`,
        process.env.DB_USER,
        process.env.DB_PASSWORD,
        dbConfig
    )
    : sequelize;

const connectDatabase = async () => {
    try {
        const db = process.env.NODE_ENV === 'test' ? testSequelize : sequelize;
        await db.authenticate();
        console.log('Connection to the database has been established successfully.');
    } catch (error) {
        console.error('Unable to connect to the database:', error);
        throw error;
    }
};

export { sequelize, testSequelize, connectDatabase };