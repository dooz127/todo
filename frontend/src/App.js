import React from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';

import 'bootstrap/dist/css/bootstrap.min.css';

import Nav from './components/Nav';
import Create from './components/Create';
import Edit from './components/Edit';
import Todos from './components/Todos';

function App() {
  return (
    <Router>
      <div className='container'>
        <Nav />
        <Route path='/' exact component={Todos} />
        <Route path='/edit/:id' component={Edit} />
        <Route path='/create' component={Create} />
      </div>
    </Router>
  );
}

export default App;
