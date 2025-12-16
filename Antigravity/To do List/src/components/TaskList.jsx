import React from 'react';
import { TodoItem } from './TodoItem';
import './TaskList.css';

export function TaskList({ title, tasks, onToggle, onDelete }) {
    if (tasks.length === 0) return null;

    return (
        <div className="task-list-section">
            {title && (
                <h3 className="section-title">
                    {title} <span className="count">({tasks.length})</span>
                </h3>
            )}
            <div className="task-list">
                {tasks.map(task => (
                    <TodoItem
                        key={task.id}
                        task={task}
                        onToggle={onToggle}
                        onDelete={onDelete}
                    />
                ))}
            </div>
        </div>
    );
}
