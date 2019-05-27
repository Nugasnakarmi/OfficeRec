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
            <div >
                <p>
                    {this.props.data.id}

                    {this.props.data.name}
                    {this.props.data.czn}
                    
                </p>
            </div>
         );
    }
}
 
export default RecordList;