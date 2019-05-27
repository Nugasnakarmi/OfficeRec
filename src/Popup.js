import React, { Component } from 'react';
import './Popup.css';
import fire from './config/fire';

class Popup extends Component {
    constructor(props) {
        super(props);
        this.state = {}
        this.close = this.close.bind(this);
        this.donotClose = this.donotClose.bind(this);

        this.db = fire.firestore();
    }

    close(e){
        e.preventDefault();
        this.props.close();
    }

    donotClose(e){
        e.stopPropagation();
    }

    componentDidMount(){
        this.db = fire.firestore();
        this.db.collection('UserBase').doc(this.props.id).get().then((doc) => {
            console.clear();
            console.log("the data is", doc.data());
        });
    }

    render() {
        return (
            <div className='popup' onClick = {this.close}>
                <div className='popup-inner' onClick = {this.donotClose}>
                    {this.props.id}
                    <button onClick = {this.close}>Close</button>
                </div>
            </div>
        );
    }
}

export default Popup;