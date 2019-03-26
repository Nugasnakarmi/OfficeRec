import React, { Component } from 'react';

class Land extends Component {
    constructor(props) {
        super(props);
        this.state = {  }
    }
    render() { 
        return ( <div>
            {this.props.location}
        </div> );
    }
}
 
export default Land;