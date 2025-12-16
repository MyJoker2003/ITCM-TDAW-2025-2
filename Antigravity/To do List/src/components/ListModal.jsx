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
            date: date || ''
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

    // Helper to group tasks by date
    const groupTasksByDate = (taskList) => {
        const groups = {};
        const today = new Date().toISOString().split('T')[0];
        const noDateKey = 'No Date';

        taskList.forEach(task => {
            let key = task.date || noDateKey;
            if (key === today) key = 'Para Hoy';

            if (!groups[key]) groups[key] = [];
            groups[key].push(task);
        });
        return groups;
    };

    // Helper to sort keys
    const sortKeys = (keys) => {
        return keys.sort((a, b) => {
            if (a === 'Para Hoy') return -1;
            if (b === 'Para Hoy') return 1;
            if (a === 'No Date') return 1;
            if (b === 'No Date') return -1;
            return a.localeCompare(b);
        });
    };

    // Derived state for Pending vs Completed
    const pendingTasks = tasks.filter(t => !t.completed);
    const completedTasks = tasks.filter(t => t.completed);

    const pendingGroups = useMemo(() => groupTasksByDate(pendingTasks), [pendingTasks]);
    const completedGroups = useMemo(() => groupTasksByDate(completedTasks), [completedTasks]);

    const sortedPendingKeys = useMemo(() => sortKeys(Object.keys(pendingGroups)), [pendingGroups]);
    const sortedCompletedKeys = useMemo(() => sortKeys(Object.keys(completedGroups)), [completedGroups]);

    const isValid = title.trim() && tasks.length > 0;

    const renderDateGroups = (groups, keys) => {
        return keys.map(key => (
            <details key={key} open className="date-section">
                <summary>
                    {key === 'Para Hoy' && <span className="section-badge">Today</span>}
                    {key} ({groups[key].length})
                </summary>
                <TaskList
                    tasks={groups[key]}
                    onToggle={handleToggleTask}
                    onDelete={handleDeleteTask}
                />
            </details>
        ));
    };

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
                    {/* Pending Section */}
                    <details open className="status-section">
                        <summary>
                            Pending Tasks
                            <span className="count-badge">{pendingTasks.length}</span>
                        </summary>
                        <div className="section-content">
                            {pendingTasks.length > 0 ? (
                                renderDateGroups(pendingGroups, sortedPendingKeys)
                            ) : (
                                <p className="empty-state">No pending tasks. Great job!</p>
                            )}
                        </div>
                    </details>

                    {/* Completed Section */}
                    {completedTasks.length > 0 && (
                        <details className="status-section">
                            <summary>
                                Completed Tasks
                                <span className="count-badge">{completedTasks.length}</span>
                            </summary>
                            <div className="section-content">
                                {renderDateGroups(completedGroups, sortedCompletedKeys)}
                            </div>
                        </details>
                    )}

                    {tasks.length === 0 && (
                        <p className="empty-state" style={{ textAlign: 'center', marginTop: '1rem' }}>
                            Start by adding a task below!
                        </p>
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
