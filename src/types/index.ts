export interface Todo {
    id: string;
    text: string;
    completed: boolean;
    priority: "low" | "medium" | "high";
    createdAt: Date;
}

export interface User {
    id: string;
    username: string;
    email: string;
}
