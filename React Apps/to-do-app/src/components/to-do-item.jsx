import React, {useState} from "react";

const ToDoItem = ({ task, onToggle, onDelete }) => {
    return (
        <li
            className={task.completed ? 'checked' : ''}
            onClick={()=> onToggle(task.id)}
        >
            {task.text}
            <span onClick={(e) => {
                e.stopPropagation();
                onDelete(task.id);
            }}>
                {'\u00d7'}
            </span>
        </li>
    );
};

export default ToDoItem;