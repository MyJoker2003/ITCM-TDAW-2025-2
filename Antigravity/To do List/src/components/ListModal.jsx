import React, { useRef, useEffect, useState, useMemo } from 'react';
import { InputForm } from './InputForm';
import { TaskList } from './TaskList';
import './ListModal.css';

export function ListModal({ isOpen, onClose, onSave, list = null }) {
    const dialogRef = useRef(null);
    const [title, setTitle] = useState('');
    const [tasks, setTasks] = useState([]);

    // Reset or initialize state when opening/closing or changing list
    useEffect(() => {
        if (isOpen) {
            if (list) {
                setTitle(list.name);
                setTasks(list.tasks || []);
            } else {
                setTitle('');
                setTasks([]);
            }
            dialogRef.current?.showModal();
        } else {
            dialogRef.current?.close();
        }
    }, [isOpen, list]);

    const handleAddTask = (text, date) => {
        const newTask = {
            id: Date.now().toString(),
            text,
            completed: false,
            date: date || '' // store date if provided
        };
        setTasks(prev => [...prev, newTask]);
    };

    const handleToggleTask = (id) => {
        setTasks(prev => prev.map(t =>
            t.id === id ? { ...t, completed: !t.completed } : t
        ));
    };

    const handleDeleteTask = (id) => {
        setTasks(prev => prev.filter(t => t.id !== id));
    };

    const handleSave = () => {
        onSave({
            ...list, // keep id/created if editing
            name: title,
            tasks,
            updatedAt: new Date().toISOString()
        });
        onClose();
    };

    // Group tasks by date
    const groupedTasks = useMemo(() => {
        const groups = {};
        const today = new Date().toISOString().split('T')[0];
        const noDateKey = 'No Date';

        tasks.forEach(task => {
            let key = task.date || noDateKey;
            if (key === today) key = 'Para Hoy';

            if (!groups[key]) groups[key] = [];
            groups[key].push(task);
        });

        return groups;
    }, [tasks]);

    // Sort keys: "Para Hoy" first, then dates, then "No Date"
    const sortedKeys = useMemo(() => {
        return Object.keys(groupedTasks).sort((a, b) => {
            if (a === 'Para Hoy') return -1;
            if (b === 'Para Hoy') return 1;
            if (a === 'No Date') return 1;
            if (b === 'No Date') return -1;
            return a.localeCompare(b);
        });
    }, [groupedTasks]);

    const isValid = title.trim() && tasks.length > 0;

    return (
        <dialog ref={dialogRef} className="list-modal" onClose={onClose}>
            <div className="modal-content">
                <header className="modal-header">
                    <input
                        className="list-title-input"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="List Title..."
                        autoFocus
                    />
                    <button className="btn-icon" onClick={onClose} aria-label="Close">
                        ✕
                    </button>
                </header>

                <div className="modal-body">
                    {sortedKeys.map(key => (
                        <details key={key} open className="date-section">
                            <summary>
                                {key === 'Para Hoy' && <span className="section-badge">Today</span>}
                                {key} ({groupedTasks[key].length})
                            </summary>
                            <TaskList
                                tasks={groupedTasks[key]}
                                onToggle={handleToggleTask}
                                onDelete={handleDeleteTask}
                            />
                        </details>
                    ))}

                    {tasks.length === 0 && (
                        <p className="empty-state">Start by adding a task below!</p>
                    )}
                </div>

                <footer className="modal-footer">
                    <InputForm onAdd={handleAddTask} />

                    <div className="modal-actions">
                        <button className="button btn-secondary" onClick={onClose}>
                            Cancel
                        </button>
                        <button
                            className="button btn-primary"
                            onClick={handleSave}
                            disabled={!isValid}
                        >
                            Save List
                        </button>
                    </div>
                </footer>
            </div>
        </dialog>
    );
}
