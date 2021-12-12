import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import axios from 'axios'

axios.get('http://localhost:5000/user', {withCredentials:true})
.then((response) => response.data)
.then((json) => ReactDOM.render(
  <App data={json}/>,
document.getElementById('root')
)) 

