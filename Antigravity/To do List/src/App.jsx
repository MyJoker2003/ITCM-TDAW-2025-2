import React, { useState, useEffect } from 'react';
import { InputForm } from './components/InputForm';
import { TaskList } from './components/TaskList';
import './index.css';

function App() {
  // Initialize state from LocalStorage or empty array
  const [tasks, setTasks] = useState(() => {
    const savedTasks = localStorage.getItem('todo-tasks');
    if (savedTasks) {
      try {
        return JSON.parse(savedTasks);
      } catch (e) {
        console.error('Failed to parse tasks from local storage', e);
        return [];
      }
    }
    return [];
  });

  // Save to LocalStorage whenever tasks change
  useEffect(() => {
    localStorage.setItem('todo-tasks', JSON.stringify(tasks));
  }, [tasks]);

  const addTask = (text) => {
    const newTask = {
      id: Date.now().toString(),
      text,
      completed: false,
    };
    setTasks([newTask, ...tasks]);
  };

  const toggleTask = (id) => {
    setTasks(tasks.map(task =>
      task.id === id ? { ...task, completed: !task.completed } : task
    ));
  };

  const deleteTask = (id) => {
    setTasks(tasks.filter(task => task.id !== id));
  };

  const pendingTasks = tasks.filter(task => !task.completed);
  const completedTasks = tasks.filter(task => task.completed);

  return (
    <div className="card">
      <h1 className="title">To-Do List</h1>

      <InputForm onAdd={addTask} />

      <TaskList
        title="Pending Tasks"
        tasks={pendingTasks}
        onToggle={toggleTask}
        onDelete={deleteTask}
      />

      <TaskList
        title="Completed Tasks"
        tasks={completedTasks}
        onToggle={toggleTask}
        onDelete={deleteTask}
      />

      {tasks.length === 0 && (
        <p style={{ textAlign: 'center', color: 'var(--text-secondary)', marginTop: '2rem' }}>
          No tasks yet. Add one to get started!
        </p>
      )}
    </div>
  );
}

export default App;
