import React from "react";
import ToDoItem from "./to-do-item";

const PendingTaskList = ({ tasks, onToggle, onDelete }) => {
    const pendingTasks = tasks.filter(task => !task.completed);
    return (
        <div className="task-section">
            <h3>Tareas Pendientes</h3>
            <ul id="pending-list-container">
                {pendingTasks.map(task => (
                    <ToDoItem 
                        key={task.id} 
                        task={task} 
                        onToggle={onToggle} 
                        onDelete={onDelete} 
                    />
                ))}
            </ul>
        </div>
    );
};

export default PendingTaskList;