import React from 'react';
import axios from 'axios';
import download from 'downloadjs';
import { Link } from 'react-router-dom';

export default function Todo({ todo, onDelete }) {
  const downloadFile = (id, path, mimetype) => {
    axios
      .get(`http://localhost:4000/todos/download/${id}`, {
        responseType: 'blob'
      })
      .then((res) => {
        const split = path.split('/');
        const filename = split[split.length - 1];
        return download(res.data, filename, mimetype);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <tr>
      <td className={todo.completed ? 'completed' : ''}>{todo.description}</td>
      <td className={todo.completed ? 'completed' : ''}>
        {todo.dueDate ? new Date(todo.dueDate).toLocaleString() : 'N/A'}
      </td>
      <td>
        {todo.filePath ? (
          <button
            type='button'
            className='btn btn-success'
            onClick={() => downloadFile(todo._id, todo.filePath, todo.fileType)}
          >
            Download
          </button>
        ) : (
          ''
        )}
      </td>
      <td>
        <Link to={`/edit/${todo._id}`}>
          <button type='button' className='btn btn-primary'>
            Edit
          </button>
        </Link>
        &nbsp;
        <button
          type='button'
          className='btn btn-danger'
          onClick={() => onDelete(todo._id)}
        >
          Delete
        </button>
      </td>
    </tr>
  );
}
