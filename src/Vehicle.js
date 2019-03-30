import React, { Component } from 'react';

class Vehicle extends Component {
    constructor(props) {
        super(props);
        this.state = {  }
    }

    componentDidMount(){
        console.log(this.props.details);
    }

    render() { 
        return ( <div>vehicle</div> );
    }
}
 
export default Vehicle;