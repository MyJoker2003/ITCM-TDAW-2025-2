import React, { useState } from "react";

const InputModule = ({ onAdd }) => {
    const [inputValue, setInputValue] = useState("");

    const handleAdd  = () => {
        if (inputValue.trim() === "") {
            alert("You must write something!");
        } else {
            onAdd(inputValue);
            setInputValue("");
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            handleAdd();
        }
    };

    return (
        <div className="row">
            <input 
                type="text" 
                id="input-box"
                placeholder="Add your new task"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)} 
                onKeyDown={handleKeyDown}
            />
            <button onClick={handleAdd}>Add</button>
        </div>
    );
};

export default InputModule;