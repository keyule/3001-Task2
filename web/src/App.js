import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [todos, setTodos] = useState([]);
  const [newTodoTitle, setNewTodoTitle] = useState('');

  useEffect(() => {
    axios.get('http://localhost:3000/todos')
      .then(response => {
        setTodos(response.data);
      })
      .catch(error => {
        console.error('Error retrieving todos:', error);
      });
  }, []);

  const handleNewTodoSubmit = event => {
    event.preventDefault();
    if (!newTodoTitle) {
      return;
    }
    axios.post('http://localhost:3000/todos', { title: newTodoTitle })
      .then(response => {
        setTodos([...todos, response.data]);
        setNewTodoTitle('');
      })
      .catch(error => {
        console.error('Error adding todo:', error);
      });
  };

  const handleTodoCompletionChange = (id, completed) => {
    axios.put(`http://localhost:3000/todos/${id}`, { completed })
      .then(response => {
        const updatedTodos = todos.map(todo => {
          if (todo.id === response.data.id) {
            return { ...todo, completed: response.data.completed };
          }
          return todo;
        });
        setTodos(updatedTodos);
      })
      .catch(error => {
        console.error('Error modifying todo:', error);
      });
  };

  const handleTodoDeletion = id => {
    axios.delete(`http://localhost:3000/todos/${id}`)
      .then(response => {
        const updatedTodos = todos.filter(todo => todo.id !== response.data.id);
        setTodos(updatedTodos);
      })
      .catch(error => {
        console.error('Error deleting todo:', error);
      });
  };

  return (
    <div className="app">
      <h1 className="app__title">Todo List</h1>
      <form className="app__form" onSubmit={handleNewTodoSubmit}>
        <input className="app__form-input" type="text" value={newTodoTitle} onChange={event => setNewTodoTitle(event.target.value)} placeholder="Enter a new todo" />
        <button className="app__form-button" type="submit">Add Todo</button>
      </form>
      <ul className="app__list">
        {todos.map(todo => (
          <li className="app__list-item" key={todo.id}>
            <label className="app__list-label">
              <input className="app__list-checkbox" type="checkbox" checked={todo.completed} onChange={event => handleTodoCompletionChange(todo.id, event.target.checked)} />
              <span className="app__list-text">{todo.title}</span>
            </label>
            <button className="app__list-delete" onClick={() => handleTodoDeletion(todo.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
export default App;
