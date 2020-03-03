import React, { Component } from 'react';
import MessBox from './MessBox'
import autoBind from 'react-autobind';
import '../style/Main.css'

class Main extends Component {
  constructor(props){
    super(props);
    this.state = {
      dialogs: [],
      name: undefined
    }
    autoBind(this)
  }
  NameFormSubmit(event){
    event.preventDefault();
    let NameForm = document.forms.NameForm;
    let name = NameForm.elements.name.value.trim();

    if( !Boolean(name) ){
      alert('Введите имя');
      return
    } else this.setState({name});

    let RoomsForm = document.forms.RoomsForm;
    let socket = this.props.socket;

    if(socket){ 
      socket.emit('change-username', name, (data) => {
        if(data.res){
          NameForm.name.setAttribute('disabled', 'disabled')
          NameForm.classList.add('d-none');

          RoomsForm.classList.remove('d-none');
          [...RoomsForm.elements].forEach( el => el.removeAttribute('disabled') );

          document.querySelector('div.Main').insertAdjacentHTML(
            'afterbegin', '<div class="d-print-none">Ваш ник <strong>'+name+'</strong></div>'
          );

          this.setState({ dialogs: [{RoomName: 'Living room', username: name}] });
        
        } else alert(data.mess)
      });
    } 
  }
  MakeRoomSClick(event){
    event.preventDefault();
    let RoomName = document.querySelector('input[name="MakeRoom"]').value.trim();
    if(RoomName !== ''){
      this.props.socket.emit('create-room', RoomName, (data)=>{
        console.log(data)
        if(data.res){
          this.setState({ dialogs: [...this.state.dialogs, {RoomName, username: this.state.name}] });
        } else console.log(data.mess)
      });
    }
  }
  DellMessBox(RoomName){
    this.setState({
      dialogs: this.state.dialogs.filter( el => el.RoomName !== RoomName)
    });
  }

  render(){
      return(  
        <div className='Main' id='Main' >
          <form  name="NameForm" onSubmit={(e) => this.NameFormSubmit(e)}>
            <label htmlFor="name">Имя</label>
            <input type="text" name="name" id="name" placeholder="Введите имя"  autoComplete="off"/>
            <br/>
            <input type="submit" name="SendName" value="Отправить" />
          </form>
          <br/>
          <form  name="RoomsForm" className='d-none'>
            <label htmlFor="room">Создать комнату</label>
            <br/>
            <input type="search" name="MakeRoom"  placeholder="Имя комнаты" disabled/>
            <input type="submit" name="MakeRoomS" value="Создать"   disabled onClick={(e)=>this.MakeRoomSClick(e)} />
            <br/><br/>
            <label htmlFor="room">Присоединиться к комнате</label>
            <br/>
            <input type="search" name="FindRoom"  placeholder="Найти комнату" disabled/>
            <input type="submit" name="FindRoomS" value="Искать"  disabled/>
          </form>
          <div className='all-dialogs'>{
            this.state.dialogs.map((el, ind)=>(<MessBox 
                key = {ind}
                RoomName = {el.RoomName}
                socket = {this.props.socket}
                username = {el.username}
                key = {el.RoomName + 'key'}
                DellMessBox = {this.DellMessBox}
            />))
          }</div>
        </div>  
      )
  }
}

export default Main