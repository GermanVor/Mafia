import React, { Component } from 'react';
import MessBox from './MessBox'

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
      this.state = {
        dialogs: []
      }
      
  }
  
  render(){
      return(  
        <div className='Main' id='Main' style={styles.Main} >
          <form  name="NameForm" >
            <label htmlFor="name">Имя</label>
            <input type="text" name="name" id="name" placeholder="Введите имя" className="form-control" autoComplete="off"/>
            <br/>
            <input type="submit" name="SendName" value="Отправить" className="btn btn-danger"/>
          </form>
          <form  name="RoomsForm" className='d-none' >
            <br/>
            <label htmlFor="room">Присоединиться к комнате</label>
            <br/>
            <input type="search" name="FindRoom" className="form-control ds-input" placeholder="Найти комнату" disabled/>
          </form>
          <div className='all-dialogs'>{
            this.state.dialogs.map((el)=>(<MessBox 
                RoomName = {el.RoomName}
                socket = {socket}
                username = {el.username}
                key={el.RoomName + 'key'}
              />))
          }</div>
        </div>  
      )
  }
  
  componentDidMount(){
    let NameForm = document.forms.NameForm;
    let RoomsForm = document.forms.RoomsForm;
    let setState = this.setState.bind(this);
    let dialogs = this.state.dialogs;

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
          
          NameForm.name.setAttribute('disabled', 'disabled')
          NameForm.classList.add('d-none');

          RoomsForm.classList.remove('d-none');
          RoomsForm.FindRoom.removeAttribute('disabled');

          document.querySelector('div.Main').insertAdjacentHTML(
            'afterbegin', '<div class="d-print-none">Ваш ник <strong>'+name+'</strong></div>'
          );
          setState({ dialogs: [...dialogs, {RoomName: 'Living room', username: name}]})
          
        } else alert(data.mess)
      });
    }

    
   

  }
}

export default Main