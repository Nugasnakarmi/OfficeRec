import React, { Component } from 'react';

class Income extends Component {
    constructor(props) {
        super(props);
        this.state = {  }
    }

    componentDidMount(){
        console.log(this.props.details);
    }
    
    render() { 
        return ( <div>
            Income
        </div> );
    }
}
 
export default Income;