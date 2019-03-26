import React, { Component } from 'react';

class AdminWindow extends Component {
    constructor(props) {
        super(props);
        this.state = {  }
    }
    render() { 
        return (  
            <div className ='admin-panel' >
                <h1>Admin Panel</h1>
                <p>Search and view User Records here</p>
            </div>
        );
    }
}
 
export default AdminWindow;