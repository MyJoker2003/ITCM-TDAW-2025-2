import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import './InputForm.css';

export function InputForm({ onAdd }) {
    const [inputValue, setInputValue] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (inputValue.trim()) {
            onAdd(inputValue.trim());
            setInputValue('');
        }
    };

    return (
        <form className="input-form" onSubmit={handleSubmit}>
            <input
                type="text"
                className="task-input"
                placeholder="Add a new task..."
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
            />
            <button type="submit" className="add-button" disabled={!inputValue.trim()}>
                <Plus size={20} />
                <span>Add</span>
            </button>
        </form>
    );
}
