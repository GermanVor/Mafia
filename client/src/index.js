import React from 'react'
import ReactDOM from 'react-dom'
import Main from './containers/Main'

import './style/Main.css'

import openSocket from 'socket.io-client';
const socket = openSocket(document.location.href);

ReactDOM.render(
  <Main socket={socket}/>,
  document.getElementById('root') 
)

