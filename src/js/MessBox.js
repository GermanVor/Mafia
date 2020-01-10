import React, { Component } from 'react';
import '../css/Mess.css'

class MessBox extends Component {
  constructor(props){
      super(props);
      this.AddMess = this.AddMess.bind(this);
  }
  
  render(){
      return(  
        <div className='MessBox'  >
          <div className="d-print-none">{'Имя комнаты '+ this.props.RoomName }</div>
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
      'beforeend', '<div class="d-print-none"><strong>'+mess+' вошел в комнату</strong></div>'
    );
  }
  componentDidMount(){
    let MessForm = document.forms.MessForm;
    let socket = this.props.socket;
    let RoomName = this.props.RoomName;
    let name = this.props.username;
    let AddMess = this.AddMess;

    MessForm.onsubmit = function(event) {
      event.preventDefault();
      let mess = MessForm.elements.message.value.trim();
      if(mess !== '' && mess.length <= 100) socket.emit('mess', { RoomName, mess }, function(data){
        console.log(data)
        if(data.res){
          AddMess({ mess, author: name }); 
        } else console.log('Сообщение не доставлено');
      });
      MessForm.elements.message.value = '';
    }

    socket.on('new-mess',(data)=>AddMess(data));
    socket.on('JoinRoom',(user)=>this.otherJoin(user));
  };
}

export default MessBox