import React, { useState, useEffect } from 'react';

const TodoList = () => {
  const [tasks, setTasks] = useState([]);
  const [currentTask, setCurrentTask] = useState('');

  const apiUrl = 'https://assets.breatheco.de/apis/fake/todos/user/winter1000'; // Replace 'winter1000' with your desired username

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await fetch(apiUrl);
      if (!response.ok) {
        await createUserList();
      } else {
        const tasksData = await response.json();
        setTasks(tasksData);
        console.log('Fetched tasks:', tasksData);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const createUserList = async () => {
    try {
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify([]),
      });

      if (!response.ok) {
        throw new Error('Failed to create user list');
      }

      console.log('User list created successfully');
      await fetchData();
    } catch (error) {
      console.error(error);
    }
  };

  const handleInputChange = (event) => {
    setCurrentTask(event.target.value);
  };

  const handleInputKeyDown = async (event) => {
    if (event.key === 'Enter') {
      await addTask();
    }
  };

  const addTask = async () => {
    if (currentTask.trim() !== '') {
      try {
        const response = await fetch(apiUrl, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify([...tasks, { label: currentTask, done: false }]),
        });

        if (!response.ok) {
          const error = await response.text();
          throw new Error(`Failed to add task. Server response: ${error}`);
        }

        await fetchData();
        setCurrentTask('');
      } catch (error) {
        console.error(error);
      }
    }
  };

  const deleteTask = async (index) => {
    const updatedTasks = [...tasks];
    updatedTasks.splice(index, 1);
    setTasks(updatedTasks);

    try {
      const response = await fetch(apiUrl, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedTasks),
      });

      if (!response.ok) {
        const error = await response.text();
        throw new Error(`Failed to delete task. Server response: ${error}`);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const deleteAllTasks = async () => {
    try {
      const response = await fetch(apiUrl, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const error = await response.text();
        throw new Error(`Failed to delete all tasks. Server response: ${error}`);
      }

      await createUserList();
    } catch (error) {
      console.error(error);
    }
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
              {task.label}
              {task.isHovered && (
                <>
                  <button
                    onClick={() => deleteTask(index)}
                    className="delete-button"
                  >
                    X
                  </button>
                  <button
                    onClick={() => {
                      const updatedLabel = prompt('Enter the updated label:');
                      if (updatedLabel) {
                        editTask(index, updatedLabel);
                      }
                    }}
                    className="edit-button"
                  >
                    Edit
                  </button>
                </>
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
