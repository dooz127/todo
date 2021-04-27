import React, { useState } from 'react';
import axios from 'axios';
import DateTimePicker from 'react-datetime-picker';

import './style.css';

export default function Create({ history }) {
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState(null);
  const completed = false;
  const [file, setFile] = useState('');

  const onSubmit = (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('description', description);
    formData.append('dueDate', dueDate);
    formData.append('completed', completed);
    formData.append('file', file);

    axios
      .post('http://localhost:4000/todos/add', formData)
      .then((res) => console.log(res.data))
      .then(() => history.push('/'));
  };

  return (
    <div style={{ marginTop: 10 }}>
      <h3>Create New Todo</h3>
      <form onSubmit={onSubmit} encType='multipart/form-data'>
        <div className='form-group'>
          <label>Description: </label>
          <input
            type='text'
            className='form-control'
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>
        <div className='form-group'>
          <label>Due Date and Time: </label>
          <DateTimePicker
            className='form-control'
            disableClock={true}
            value={dueDate}
            onChange={setDueDate}
          />
        </div>
        <div className='form-group'>
          <label>File: </label>
          <input
            type='file'
            filename='file'
            className='form-control-file'
            onChange={(e) => setFile(e.target.files[0])}
          />
        </div>
        <div className='form-group'>
          <input
            type='submit'
            value='Create Todo'
            className='btn btn-primary'
          />
        </div>
      </form>
    </div>
  );
}
