import React, { Component } from 'react';

class RecordList extends Component {
    constructor(props) {
        super(props);
        this.state = {  }
    }
    render() { 
        console.log(this.props.data);
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