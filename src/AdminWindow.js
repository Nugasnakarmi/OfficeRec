import React, { Component } from 'react';
import Precords from './precords';

class AdminWindow extends Component {
    constructor(props) {
        super(props);
        this.state = {  }
    }
    render() { 
        return (  
            <div className ='admin-panel' >
                <h1>Admin Panel</h1>
                <Precords />
            </div>
        );
    }
}
 
export default AdminWindow;