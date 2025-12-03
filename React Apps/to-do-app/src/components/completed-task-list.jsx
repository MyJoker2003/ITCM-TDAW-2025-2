import React from "react";
import ToDoItem from "./to-do-item"

const CompletedTaskList = ({ tasks, onToggle, onDelete }) => {
    const completedTasks = tasks.filter(task => task.completed);

    return (
        <div className="task-section">
            <h3>Tareas Completadas</h3>
            <ul>
                {completedTasks.map(task =>(
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

export default CompletedTaskList;