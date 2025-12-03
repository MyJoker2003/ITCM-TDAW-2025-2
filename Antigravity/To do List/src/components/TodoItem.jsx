import React from 'react';
import { Trash2, Check } from 'lucide-react';
import './TodoItem.css';

export function TodoItem({ task, onToggle, onDelete }) {
    return (
        <div className={`todo-item fade-in ${task.completed ? 'completed' : ''}`}>
            <label className="checkbox-container">
                <input
                    type="checkbox"
                    checked={task.completed}
                    onChange={() => onToggle(task.id)}
                />
                <span className="custom-checkbox">
                    {task.completed && <Check size={14} strokeWidth={3} />}
                </span>
            </label>

            <span className="task-text">{task.text}</span>

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
