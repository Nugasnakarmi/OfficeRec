import React, { Component } from 'react';
import './Popup.css';

class Popup extends Component {
    constructor(props) {
        super(props);
        this.state = {}
        this.close = this.close.bind(this);
    }

    close(e){
        e.preventDefault();
        this.props.close();
    }

    render() {
        return (
            <div className='popup'>
                <div className='popup-inner'>
                    POPUP STARTS HERE
                    {this.props.id}
                    <button onClick = {this.close}>Close</button>
                </div>
            </div>
        );
    }
}

export default Popup;