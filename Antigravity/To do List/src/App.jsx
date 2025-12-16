import React, { useState, useEffect } from 'react';
import { ListModal } from './components/ListModal';
import { ConfirmationModal } from './components/ConfirmationModal';
import './index.css';
import './App.css';

function App() {
  const [lists, setLists] = useState(() => {
    const savedLists = localStorage.getItem('todo-lists');
    const savedTasks = localStorage.getItem('todo-tasks'); // Legacy support

    if (savedLists) {
      try {
        return JSON.parse(savedLists);
      } catch (e) {
        console.error('Failed to parse lists', e);
        return [];
      }
    }

    // Migration logic
    if (savedTasks) {
      try {
        const tasks = JSON.parse(savedTasks);
        if (tasks.length > 0) {
          const defaultList = {
            id: Date.now().toString(),
            name: 'General',
            tasks: tasks,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          };
          return [defaultList];
        }
      } catch (e) {
        console.error('Failed to migrate tasks', e);
      }
    }

    return [];
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedList, setSelectedList] = useState(null);

  // Delete Confirmation State
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [listToDelete, setListToDelete] = useState(null);

  // Persistence
  useEffect(() => {
    localStorage.setItem('todo-lists', JSON.stringify(lists));
  }, [lists]);

  const handleCreateList = () => {
    setSelectedList(null);
    setIsModalOpen(true);
  };

  const handleEditList = (list) => {
    setSelectedList(list);
    setIsModalOpen(true);
  };

  const handleSaveList = (updatedList) => {
    if (updatedList.id) {
      // Update existing
      setLists(prev => prev.map(l => l.id === updatedList.id ? updatedList : l));
    } else {
      // Create new
      const newList = {
        ...updatedList,
        id: Date.now().toString(),
        createdAt: new Date().toISOString(),
      };
      setLists(prev => [newList, ...prev]);
    }
  };

  const handleDeleteClick = (e, list) => {
    e.stopPropagation();
    setListToDelete(list);
    setIsDeleteModalOpen(true);
  };

  const confirmDeleteList = () => {
    if (listToDelete) {
      setLists(prev => prev.filter(l => l.id !== listToDelete.id));
      setListToDelete(null);
      setIsDeleteModalOpen(false);
    }
  };

  const sortedLists = [...lists].sort((a, b) =>
    new Date(b.updatedAt) - new Date(a.updatedAt)
  );

  return (
    <div className="app-container">
      <header className="app-header">
        <h1 className="app-title">My Task Lists</h1>
        <button className="create-btn" onClick={handleCreateList}>
          + Create New List
        </button>
      </header>

      <main className="lists-grid">
        {sortedLists.map(list => (
          <div
            key={list.id}
            className="list-card"
            onClick={() => handleEditList(list)}
          >
            <div className="list-card-header">
              <h3>{list.name}</h3>
              <button
                className="delete-list-btn"
                onClick={(e) => handleDeleteClick(e, list)}
                aria-label={`Delete ${list.name}`}
              >
                ✕
              </button>
            </div>
            <p className="list-meta">
              {list.tasks.length} {list.tasks.length === 1 ? 'Task' : 'Tasks'}
            </p>
            <p className="list-date">
              Updated: {new Date(list.updatedAt).toLocaleDateString()}
            </p>
          </div>
        ))}

        {sortedLists.length === 0 && (
          <div className="empty-state-container">
            <p>No lists found. Create one to get started!</p>
          </div>
        )}
      </main>

      <ListModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveList}
        list={selectedList}
      />

      <ConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={confirmDeleteList}
        title="Delete List"
        message={`Are you sure you want to delete "${listToDelete?.name}"? This action cannot be undone.`}
      />
    </div>
  );
}

export default App;
