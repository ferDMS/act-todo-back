import { Sequelize } from 'sequelize'; 

const sequelize = new Sequelize('defaultdb', 'avnadmin', 'AVNS_Nom2k4h3t0k7W0LPoj-', {
    host: 'mysql-336e5ff8-tec-39e5.h.aivencloud.com',
    port: 22073,
    dialect: 'mysql',
    dialectOptions: {
        ssl: {
            require: true,
            rejectUnauthorized: true
        }
    },
    logging: false // Set to console.log to see SQL queries
});

const connectDatabase = async () => {
    try {
        await sequelize.authenticate();
        console.log('Connection to the database has been established successfully.');
    } catch (error) {
        console.error('Unable to connect to the database:', error);
    }
};

export { sequelize, connectDatabase };