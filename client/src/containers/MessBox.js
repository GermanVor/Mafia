import React, { Component } from 'react';
import '../style/MessBox.css';
import autoBind from 'react-autobind';
import MessBoxList from './MessBoxMembers'

export default class MessBox extends Component {
  constructor(props){
      super(props);
      this.state = {
        Mess: [],
        MembersList: []
      };
      autoBind(this);
  }
  MessFormSubmit(event){
    if(event) event.preventDefault();

    if(event.keyCode == 13 && !event.shiftKey && event.target.value.trim().length < 100) {
      let mess = event.target.value.trim();
      let className = '';
      let socket = this.props.socket;
      let RoomName = this.props.RoomName;

      if( mess !== '' && mess.length <= 100 ){
        socket.emit('mess', { RoomName, mess }, (data)=>{
          if(data.res){
            this.setState({ Mess: [...this.state.Mess, {mess, className}] });
          } else console.log('Сообщение не доставлено');
        });
      };
      event.target.value = ''; 
    }
  }
  LeaveSubmit(event){
    if(event) event.preventDefault();

    this.props.socket.emit('leave-room', this.props.RoomName, (data)=>{
      console.log(data)
      if(data.res){
        this.props.DellMessBox(this.props.RoomName);
      } else console.log('Не удалось покинуть комнату')
    });
  }
  GetMembers(event){
    if(event) event.preventDefault();

    this.props.socket.emit('get-members', this.props.RoomName, (data)=>{
      this.setState({MembersList: data});
    });
  }
  render(){
    return(  
      <div className='MessBox' onClick={ ()=>this.setState({ MembersList: [] }) } >
        {this.state.popup}
        <div className='head'>
          <div className='head-1'>
            <input type="button" value='Покинуть' onClick={this.LeaveSubmit} />
            <input type="button" value='Пригласить'  />
          </div>
          <div className='head-2'>
            <p>{this.props.RoomName }</p>
            <input type="button" value='Участники' onClick={this.GetMembers} />
            <MessBoxList members={this.state.MembersList} />
          </div>
        </div>
    
        <div className='MessWindow'>{this.state.Mess.map( (el, i) =>
          <div className={'white-space-pre '+ el.className || ''} key={i} >{el.mess}</div>
        )}</div>
  
        <div className="MessForm" >
          <textarea aria-multiline="true" id="message" 
            placeholder="Введите сообщение" onKeyUp={this.MessFormSubmit}
            maxLength = "100" >
          </textarea>
        </div>
      </div>  
    )
  }
  componentDidMount(){
    let socket = this.props.socket;
 
    socket.on('new-mess',({mess, author})=>{
      let obj = {
        mess: author+':'+mess,
        className: 'd-print-none'
      }
      this.setState({ Mess: [...this.state.Mess, obj] });
    });

    socket.on('JoinRoom',(user)=>{
      let obj = {
        mess: `${user} вошел в комнату`,
        className: 'alert-join-room'
      };
      this.setState({ Mess: [...this.state.Mess, obj] });
    });

    socket.on('LeaveRoom',(user)=>{
      let obj = {
        mess: `${user} покинул комнату`,
        className: 'alert-leave-room'
      };
      this.setState({ Mess: [...this.state.Mess, obj] });
    });
    
  }
}
