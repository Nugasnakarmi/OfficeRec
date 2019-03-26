import React, { Component } from 'react';

class Vehicle extends Component {
    constructor(props) {
        super(props);
        this.state = {  }
    }
    render() { 
        return ( <div>{this.props.vehicleType}</div> );
    }
}
 
export default Vehicle;