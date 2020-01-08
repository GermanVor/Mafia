import React, { Component } from 'react';

import openSocket from 'socket.io-client';
const socket = openSocket(document.location.href);

class Main extends Component {
  constructor(props){
      super(props);
  }
  
  render(){
      return(  
        <div className='Main' id='Main'>
          <form  name="MessForm" >
            <label htmlFor="name">Имя</label>
            <input type="text" name="name" id="name" placeholder="Введите имя" className="form-control"/>
            <br/>
            <label htmlFor="message">Сообщение</label>
            <textarea name="message" id="message" className="form-control" placeholder="Введите сообщение"></textarea>
            <br/>
            <input type="submit" name="send" value="Отправить" className="btn btn-danger" />
          </form>
          <div className='all-mess'></div>
        </div>  
      )
  }
  AddMess({ mess, author }){
    let allMess = document.querySelector('div.all-mess');
    allMess.append("<div class='alert'><b>" + author + "</b>: " + mess + "</div>");
  }
  componentDidMount(){
    let form = document.forms.MessForm;
    console.dir(form.elements);

    form.onsubmit = function(event) {
      event.preventDefault();

      let name = form.elements.name.value.trim();

      if( !Boolean(name) ){
        alert('Введите имя');
        return
      }

      socket.emit('change-username', name, function(data){
        console.log(data)
      });
      

      //socket.emit('mess', {mess: $textarea.val(), name: $name.val(), className: alertClass});
      form.elements.message.value = '';
    }

  }
}

export default Main