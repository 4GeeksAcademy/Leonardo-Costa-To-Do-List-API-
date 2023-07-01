import React, { useState, useEffect } from 'react';

const TodoList = () => {
  const [tasks, setTasks] = useState([]);
  const [currentTask, setCurrentTask] = useState('');

  const handleInputChange = (event) => {
    setCurrentTask(event.target.value);
  };

  const handleInputKeyDown = (event) => {
    if (event.key === 'Enter') {
      addTask();
    }
  };

  const addTask = () => {
    if (currentTask.trim() !== '') {
      setTasks([...tasks, { task: currentTask.toUpperCase(), isHovered: false }]);
      setCurrentTask('');
    }
  };

  const deleteTask = (index) => {
    const updatedTasks = [...tasks];
    updatedTasks.splice(index, 1);
    setTasks(updatedTasks);
  };

  const deleteAllTasks = () => {
    setTasks([]);
  };

  const handleDeleteOnMouseEnter = (index) => {
    const updatedTasks = [...tasks];
    updatedTasks[index] = { ...updatedTasks[index], isHovered: true };
    setTasks(updatedTasks);
  };

  const handleDeleteOnMouseLeave = (index) => {
    const updatedTasks = [...tasks];
    updatedTasks[index] = { ...updatedTasks[index], isHovered: false };
    setTasks(updatedTasks);
  };

  useEffect(() => {
    return () => {
      // Cleanup code if needed
    };
  }, []);

  const itemCount = tasks.length;

  return (
    <div className="container">
      <div className="list">
        <h2>To-Do List ({itemCount} {itemCount === 1 ? 'item' : 'items'})</h2>

        <input
          type="text"
          placeholder="Add a task..."
          value={currentTask}
          onChange={handleInputChange}
          onKeyDown={handleInputKeyDown}
        />
        <ul>
          {tasks.map((task, index) => (
            <li
              key={index}
              onMouseEnter={() => handleDeleteOnMouseEnter(index)}
              onMouseLeave={() => handleDeleteOnMouseLeave(index)}
            >
              {task.task}
              {task.isHovered && (
                <button
                  onClick={() => deleteTask(index)}
                  className="delete-button"
                >
                  X
                </button>
              )}
            </li>
          ))}
        </ul>
        <button onClick={deleteAllTasks} className="delete-all-button">
          Delete All Items
        </button>
      </div>
    </div>
  );
};

export default TodoList;
