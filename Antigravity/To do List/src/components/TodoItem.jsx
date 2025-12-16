import React from 'react';
import { Trash2 } from 'lucide-react';
import './TodoItem.css';

export function TodoItem({ task, onToggle, onDelete }) {
    return (
        <div className={`todo-item fade-in ${task.completed ? 'completed' : ''}`}>
            <label className="checkbox-container">
                <input
                    type="checkbox"
                    className="checkbox"
                    checked={task.completed}
                    onChange={() => onToggle(task.id)}
                />
            </label>

            <div className="todo-content">
                <span className={`todo-text ${task.completed ? 'completed' : ''}`}>
                    {task.text}
                </span>
                {task.date && (
                    <span className="todo-date">
                        📅 {task.date}
                    </span>
                )}
            </div>

            <button
                className="delete-button"
                onClick={() => onDelete(task.id)}
                aria-label="Delete task"
            >
                <Trash2 size={18} />
            </button>
        </div>
    );
}
