import { useState, useEffect } from 'react'
import './App.css'
import InputModule from './components/input-module';
import PendingTaskList from './components/pending-task-list'
import CompletedTaskList from './components/completed-task-list'
import ToDoListIcon from './images/ToDoListIcon.jpg';


function App() {

  const [tasks, setTasks] = useState(()=>{
    const savedData = localStorage.getItem('react-todo-data');
    return savedData ? JSON.parse(savedData) : []
  });

  useEffect(()=>{
    localStorage.setItem('react-todo-data', JSON.stringify(tasks));
  }, [tasks]);

  const addTask = (text) => {
    const newTask = {
      id: Date.now(),
      text: text,
      completed: false
    };
    setTasks([...tasks,newTask]);
  }

  const toggleTask = (id) => {
    setTasks(tasks.map(task => 
      task.id === id ? {...task, completed: !task.completed} : task
    ));
  }

  const deleteTask = (id) => {
    setTasks(tasks.filter(task => task.id !== id));
  }

  return (
    <>
      <main className='container'>
        <div className="todo-app">
          <h2>
            To-Do List
            <img 
              src={ToDoListIcon}
              className='face-icon' 
              alt="icon" 
            />
          </h2>

          <InputModule onAdd={addTask} />
          
          <PendingTaskList
            tasks={tasks}
            onToggle={toggleTask}
            onDelete={deleteTask}
          />

          <CompletedTaskList
            tasks={tasks}
            onToggle={toggleTask}
            onDelete={deleteTask}
          />
        </div>
      </main>
    </>
  )
}

export default App
