import React, { useState } from 'react';
import './InputForm.css';

export function InputForm({ onAdd }) {
    const [text, setText] = useState('');
    const [date, setDate] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!text.trim()) return;

        // Pass both text and date
        onAdd(text, date);

        setText('');
        setDate('');
    };

    return (
        <form className="input-form" onSubmit={handleSubmit}>
            <input
                type="text"
                className="task-input"
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Add a new task..."
                autoFocus
            />
            <input
                type="date"
                className="date-input"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                aria-label="Task due date"
            />
            <button type="submit" className="add-button">
                Add
            </button>
        </form>
    );
}
