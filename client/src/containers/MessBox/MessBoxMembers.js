import React, { Component } from 'react';
import autoBind from 'react-autobind';
import '../../style/MessBoxMembers.css';

export default class MessBoxMembers extends Component {
  constructor(props){
    super(props);
    autoBind(this);
    this.state = {
      ref: React.createRef(),
    }
  }
  render(){
    let members = this.props.members;

    return ( members.length ? (
      <div className={'MessBoxMembers '+(!members.length? 'dNoOne ': '')}
        onClick={event=>event.stopPropagation()} ref={this.state.ref}
      >
        { members.length ? <div className='MessBoxList'>
          {members.map( (a,ind) => <div className='MessBoxItem' key={ind} >{a}</div> )}
        </div> : '' }
      </div>) : ''
    ) 
  }
}
