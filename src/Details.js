import React, { Component } from 'react';
import Land from './Land';
import Vehicle from './Vehicle';

class Details extends Component {
    constructor(props) {
        super(props);
        this.state = {  }
    }
    render() { 
        return ( <div>
            <h1>The Details Pane</h1>
            <Land location = "khjlkh"></Land>
            <Vehicle vehicleType = '2Wheeler'></Vehicle>
        </div> );
    }
}
 
export default Details;