import React, { Component } from 'react';

import openSocket from 'socket.io-client';
const socket = openSocket(document.location.href);

const styles = {
  Main: {
    width: '600px',
    margin: 'auto'
  }
}

class Main extends Component {
  constructor(props){
      super(props);
  }
  
  render(){
      return(  
        <div className='Main' id='Main' style={styles.Main} >
          <form  name="NameForm" >
            <label htmlFor="name">Имя</label>
            <input type="text" name="name" id="name" placeholder="Введите имя" className="form-control" autocomplete="off"/>
            <br/>
            <input type="submit" name="SendName" value="Отправить" className="btn btn-danger"/>
          </form>
          <form  name="RoomsForm" className='d-none' >
            <br/>
            <label htmlFor="room">Присоединиться к комнате</label>
            <br/>
            <input type="search" name="FindRoom" class="form-control ds-input" placeholder="Найти комнату" disabled/>
          </form>
          <form  name="MessForm" >
            <br/>
            <label htmlFor="message">Сообщение</label>
            <textarea name="message" id="message" className="form-control" placeholder="Введите сообщение"></textarea>
            <br/>
            <input type="submit" name="send" value="Отправить" className="btn btn-danger"  disabled/>
          </form>
          <div className='all-mess'></div>
        </div>  
      )
  }
  AddMess({ mess, author }){
    let allMess = document.querySelector('div.all-mess');
    allMess.append("<div ><b>" + author + "</b>: " + mess + "</div>");
  }
  componentDidMount(){
    let NameForm = document.forms.NameForm;
    let RoomsForm = document.forms.RoomsForm;
    let MessForm = document.forms.MessForm;
    
    NameForm.onsubmit = function(event){
      event.preventDefault();
      let name = NameForm.elements.name.value.trim();

      if( !Boolean(name) ){
        alert('Введите имя');
        return
      }

      socket.emit('change-username', name, function(data){
        console.log(data)
        if(data.res){
          MessForm.send.removeAttribute('disabled');

          NameForm.name.setAttribute('disabled', 'disabled')
          NameForm.classList.add('d-none');

          RoomsForm.classList.remove('d-none');
          RoomsForm.FindRoom.removeAttribute('disabled');

          document.querySelector('div.Main').insertAdjacentHTML(
            'afterbegin', '<div class="d-print-none">Ваш ник <strong>'+name+'</strong></div>'
          );

        }
      });
    }

    
    MessForm.onsubmit = function(event) {
      event.preventDefault();
      
      

      //socket.emit('mess', {mess: $textarea.val(), name: $name.val(), className: alertClass});
      form.elements.message.value = '';
    }

  }
}

export default Main