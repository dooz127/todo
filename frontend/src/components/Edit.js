import React, { useState, useEffect } from 'react';
import axios from 'axios';
import DateTimePicker from 'react-datetime-picker';

export default function Edit({ match: { params }, history }) {
  const [isLoading, setIsLoading] = useState(true);
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState(null);
  const [completed, setCompleted] = useState(false);
  const [file, setFile] = useState('');

  useEffect(() => {
    axios
      .get(`http://localhost:4000/todos/${params.id}`)
      .then((res) => {
        const { description, dueDate, completed } = res.data;
        setDescription(description);
        setDueDate(dueDate);
        setCompleted(completed);
      })
      .then(() => setIsLoading(false))
      .catch((err) => {
        console.log(err);
      });
  }, [params.id]);

  const onSubmit = (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('description', description);
    formData.append('dueDate', dueDate);
    formData.append('completed', completed);
    formData.append('file', file);

    axios
      .post(`http://localhost:4000/todos/update/${params.id}`, formData)
      .then((res) => console.log(res.data))
      .then(() => history.push('/'));
  };

  const deleteTodo = (e) => {
    e.preventDefault();
    axios
      .post(`http://localhost:4000/todos/delete/${params.id}`)
      .then((res) => console.log(res.data))
      .then(() => history.push('/'));
  };

  return !isLoading ? (
    <div style={{ marginTop: 20 }}>
      <h3>Edit Todo</h3>
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
            value={new Date(dueDate)}
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
        <br />
        <br />
        <div className='form-group'>
          <input type='submit' className='btn btn-primary' value='Edit Todo' />

          <input
            type='button'
            className='btn btn-danger float-right'
            value='Delete Todo'
            onClick={deleteTodo}
          />
        </div>
      </form>
    </div>
  ) : (
    <div>Getting Todo</div>
  );
}
