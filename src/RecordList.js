import React, { Component } from 'react';
import './RecordList.css';

class RecordList extends Component {
    constructor(props) {
        super(props);

        this.popup = this.popup.bind(this);

        this.state = {  }

        this.sequence = (this.props.index % 2 === 0) ? 'even' : 'odd';
    }

    popup(){
        this.props.pop(this.props.data.id);
    }

    render() { 
        //console.log(this.props.data);
        return ( 
            <div onClick = {this.popup} className = 'main ' status = {this.sequence}>
                <ul>
                <li className = 'inner-element' id = 'sn'>{this.props.index + 1}</li>
                <li className = 'inner-element'>{this.props.data.name}</li>
                <li className = 'inner-element'>{this.props.data.czn}</li>
                <li className = 'inner-element'>{this.props.data.id}</li>
                </ul>
            </div>
         );
    }
}
 
export default RecordList;