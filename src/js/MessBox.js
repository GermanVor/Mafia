import React, { Component } from 'react';

import openSocket from 'socket.io-client';
const socket = openSocket(document.location.href);
 
class MessBox extends Component {
  constructor(props){
      super(props);
  }
  
  render(){
      return(  
        <div className='MessBox' >
          <form  name="RoomsForm" className='d-none' >
            <br/>
            <label htmlFor="room">Присоединиться к комнате</label>
            <br/>
            <input type="search" name="FindRoom" class="form-control ds-input" placeholder="Найти комнату" disabled/>
          </form>
        </div>  
      )
  }
  AddMess({ mess, author }){
    let allMess = document.querySelector('div.all-mess');
    allMess.append("<div ><b>" + author + "</b>: " + mess + "</div>");
  }
  componentDidMount(){
    let RoomsForm = document.forms.RoomsForm;
    
  
  }
}

export default MessBox