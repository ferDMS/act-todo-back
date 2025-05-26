import { Sequelize, Model } from 'sequelize';
import { DataTypes } from 'sequelize';

interface TodoInstance extends Model {
    id: string;
    text: string;
    completed: boolean;
    priority: 'low' | 'medium' | 'high';
    createdAt: Date;
}

describe('Todo Database Tests', () => {
    let sequelize: Sequelize;
    let Task: any;

    beforeAll(async () => {
        // Create a new Sequelize instance with SQLite
        sequelize = new Sequelize('sqlite::memory:', {
            logging: false
        });

        // Define the Task model
        Task = sequelize.define('Task', {
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
            }
        }, {
            tableName: 'tasks',
            timestamps: true,
        });

        await sequelize.sync({ force: true });
    });

    afterAll(async () => {
        await sequelize.close();
    });

    beforeEach(async () => {
        await Task.destroy({ where: {}, force: true });
    });

    it('should create a new todo', async () => {
        const todo = await Task.create({
            text: 'Test todo',
            priority: 'high',
            completed: false
        });

        expect(todo.id).toBeDefined();
        expect(todo.text).toBe('Test todo');
        expect(todo.priority).toBe('high');
        expect(todo.completed).toBe(false);
        expect(todo.createdAt).toBeDefined();
    });

    it('should update a todo', async () => {
        const todo = await Task.create({
            text: 'Test todo',
            priority: 'low',
            completed: false
        });

        await todo.update({
            text: 'Updated todo',
            priority: 'high',
            completed: true
        });

        const updatedTodo = await Task.findByPk(todo.id);
        expect(updatedTodo?.text).toBe('Updated todo');
        expect(updatedTodo?.priority).toBe('high');
        expect(updatedTodo?.completed).toBe(true);
    });

    it('should delete a todo', async () => {
        const todo = await Task.create({
            text: 'Test todo',
            priority: 'medium',
            completed: false
        });

        await todo.destroy();
        const deletedTodo = await Task.findByPk(todo.id);
        expect(deletedTodo).toBeNull();
    });

    it('should get all todos', async () => {
        const todosToCreate = [
            { text: 'Todo 1', priority: 'low' as const, completed: false },
            { text: 'Todo 2', priority: 'medium' as const, completed: true },
            { text: 'Todo 3', priority: 'high' as const, completed: false }
        ];

        await Task.bulkCreate(todosToCreate);

        const todos = await Task.findAll();
        expect(todos).toHaveLength(3);
        
        // Verify that all created todos exist in the result
        const todoTexts = todos.map((t: TodoInstance) => t.text);
        const todoPriorities = todos.map((t: TodoInstance) => t.priority);
        const todoCompleted = todos.map((t: TodoInstance) => t.completed);

        expect(todoTexts).toEqual(expect.arrayContaining(['Todo 1', 'Todo 2', 'Todo 3']));
        expect(todoPriorities).toEqual(expect.arrayContaining(['low', 'medium', 'high']));
        expect(todoCompleted).toEqual(expect.arrayContaining([false, true, false]));
    });
}); 