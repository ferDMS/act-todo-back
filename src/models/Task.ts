import { Model, DataTypes } from 'sequelize';
import { sequelize, testSequelize } from '../config/database.js';

interface TaskAttributes {
    id?: string;
    text: string;
    completed: boolean;
    priority: "low" | "medium" | "high";
    createdAt?: Date;
}

class Task extends Model<TaskAttributes> implements TaskAttributes {
    public id!: string;
    public text!: string;
    public completed!: boolean;
    public priority!: "low" | "medium" | "high";
    public readonly createdAt!: Date;
}

const db = process.env.NODE_ENV === 'test' ? testSequelize : sequelize;

Task.init(
    {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
        },
        text: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        completed: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
            allowNull: false,
        },
        priority: {
            type: DataTypes.ENUM('low', 'medium', 'high'),
            defaultValue: 'medium',
            allowNull: false,
        },
        createdAt: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW,
            allowNull: false,
        }
    },
    {
        sequelize: db,
        modelName: 'Task',
        tableName: 'tasks',
        timestamps: true,
    }
);

// Sincronizar el modelo con la base de datos
sequelize.sync({ alter: true }).then(() => {
    console.log('Task table updated successfully!');
});

export default Task;