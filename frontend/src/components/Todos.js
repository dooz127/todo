import React, { useState, useEffect } from 'react';
import axios from 'axios';

import Todo from './Todo';

export default function Todos() {
  const [todos, setTodos] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchTodos = () => {
    axios
      .get('/todos')
      .then((res) => {
        setTodos(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleDelete = (id) => {
    axios
      .post(`/todos/delete/${id}`)
      .then(() => {
        setTodos(todos.filter((todo) => todo._id !== id));
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    fetchTodos();
    setIsLoading(false);
  }, []);

  return isLoading ? (
    <div>Loading...</div>
  ) : todos.length ? (
    <div>
      <table className='table table-striped' style={{ marginTop: 20 }}>
        <thead>
          <tr>
            <th>Description</th>
            <th>Due Date</th>
            <th>File</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {todos.map((todo) => {
            return <Todo key={todo._id} todo={todo} onDelete={handleDelete} />;
          })}
        </tbody>
      </table>
    </div>
  ) : (
    <div>There are no Todos</div>
  );
}
