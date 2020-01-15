import React, { Component } from 'react';
import '../css/Mess.css'

class MessBox extends Component {
  constructor(props){
      super(props);
      this.AddMess = this.AddMess.bind(this);
      this.otherJoin = this.otherJoin.bind(this);
      this.otherLeave = this.otherLeave.bind(this);
  }
  
  render(){
      return(  
        <div className='MessBox' >
          <div className='head'>
            <button type="button" className="btn btn-danger Leave" >Покинуть</button>
            <button type="button" className="btn btn-outline-secondary Invite" >Пригласить</button> 
          </div>
          <div>
            <button style={{float: 'right', fontSize: '0.8em', padding: '3px 8px 3px 8px'}} type="button" className="btn btn-outline-secondary GetMembers">Участники</button>
            <div className="d-print-none">{'Имя комнаты '+ this.props.RoomName }</div>
            <hr align="center" width="250px" size="5" color="Red" margin='auto'/>
          </div>
          <div className='MessWindow'></div>
          <form  name="MessForm" >
            <hr align="center" width="250px" size="5" color="Red" margin='auto'/>
            <textarea name="message" id="message" className="form-control" placeholder="Введите сообщение"></textarea>
            <input type="submit" name="send" value="Отправить" className="btn btn-danger" />
          </form>
        </div>  
      )
  }
  AddMess({ mess, author }){
    document.querySelector('div.MessWindow').insertAdjacentHTML(
      'beforeend', '<div class="d-print-none">'+author+':'+mess+'</div>'
    );
  }
  otherJoin( mess ){
    document.querySelector('div.MessWindow').insertAdjacentHTML(
      'beforeend', '<div class="alert alert-info" role="alert"><strong>'+mess+'</strong> вошел в комнату</div>'
    );
  }
  otherLeave( mess ){
    document.querySelector('div.MessWindow').insertAdjacentHTML(
      'beforeend', '<div class="alert alert-danger" role="alert"><strong>'+mess+'</strong> покинул комнату</div>'
    );
  }
  componentDidMount(){
    let MessForm = document.forms.MessForm;
    let socket = this.props.socket;
    let RoomName = this.props.RoomName;
    let name = this.props.username;
    let AddMess = this.AddMess;
    
    MessForm.onsubmit = function(event){
      event.preventDefault();
      let mess = MessForm.elements.message.value.trim();
      if(mess !== '' && mess.length <= 100) socket.emit('mess', { RoomName, mess }, function(data){
        console.log(data)
        if(data.res){
          AddMess({ mess, author: name }); 
        } else console.log('Сообщение не доставлено');
      });
      MessForm.elements.message.value = '';
    };

    socket.on('new-mess',(data)=>AddMess(data));

    socket.on('JoinRoom',(user)=>this.otherJoin(user));
    socket.on('LeaveRoom',(user)=>this.otherLeave(user));
    
    let DellMessBox = this.props.DellMessBox;

    document.querySelector('button.Leave').onclick = function(){
      socket.emit('leave-room', RoomName, function(data){
        console.log(data)
        if(data.res){
          DellMessBox(RoomName)
        } else console.log('Не удалось покинуть комнату')
      })
    };

    document.querySelector('button.GetMembers').onclick = function(){
      socket.emit('get-members', RoomName, function(data){
        
      });
    }
    

  }
}

export default MessBox