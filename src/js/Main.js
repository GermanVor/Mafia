import React, { Component } from 'react';
import MessBox from './MessBox'

import openSocket from 'socket.io-client';
const socket = openSocket(document.location.href);

const styles = {
  Main: {
    margin: '20px'
  },
  Form: {
    margin: 'auto',
    width: '600px'
  }
}

class Main extends Component {
  constructor(props){
    super(props);
    this.state = {
      dialogs: []
    }
    this.DellMessBox = this.DellMessBox.bind(this)
  }
  
  render(){
      return(  
        <div className='Main' id='Main' style={styles.Main} >
          <form  name="NameForm" style={styles.Form} >
            <label htmlFor="name">Имя</label>
            <input type="text" name="name" id="name" placeholder="Введите имя" className="form-control" autoComplete="off"/>
            <br/>
            <input type="submit" name="SendName" value="Отправить" className="btn btn-danger"/>
          </form>
          <br/>
          <form  name="RoomsForm" className='d-none' style={styles.Form} >
            <label htmlFor="room">Создать комнату</label>
            <br/>
            <input type="search" name="MakeRoom" className="form-control ds-input" placeholder="Имя комнаты" disabled/>
            <input type="submit" name="MakeRoomS" value="Создать" className="btn btn-danger"  disabled/>
            <br/><br/>
            <label htmlFor="room">Присоединиться к комнате</label>
            <br/>
            <input type="search" name="FindRoom" className="form-control ds-input" placeholder="Найти комнату" disabled/>
            <input type="submit" name="FindRoomS" value="Искать" className="btn btn-danger"  disabled/>
          </form>
          <div className='all-dialogs'>{
            this.state.dialogs.map((el)=>(<MessBox 
                RoomName = {el.RoomName}
                socket = {socket}
                username = {el.username}
                key = {el.RoomName + 'key'}
                DellMessBox = {this.DellMessBox}
              />))
          }</div>
        </div>  
      )
  }
  DellMessBox(RoomName){
    this.setState({
      dialogs: this.state.dialogs.filter( el => el.RoomName !== RoomName)
    });
  }
  componentDidMount(){
    
    let NameForm = document.forms.NameForm;
    let RoomsForm = document.forms.RoomsForm;
    let setState = this.setState.bind(this);
    let state = () => this.state;

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
          [...RoomsForm.elements].forEach( el => el.removeAttribute('disabled') );

          document.querySelector('div.Main').insertAdjacentHTML(
            'afterbegin', '<div class="d-print-none">Ваш ник <strong>'+name+'</strong></div>'
          );

          setTimeout( setState({ dialogs: [{RoomName: 'Living room', username: name}] }), 0);
         
        } else alert(data.mess)
      });

      RoomsForm.elements.MakeRoomS.onclick = function(event){
        event.preventDefault();
        let RoomName = RoomsForm.elements.MakeRoom.value.trim();
        if(RoomName !== ''){
          socket.emit('create-room', RoomName, function(data){
            console.log(data)
            if(data.res){
              setState({ dialogs: [...state().dialogs, {RoomName, username: name}] });
            } else console.log(data.mess)
          });
        }
      };


    }

    
   

  }
}

export default Main