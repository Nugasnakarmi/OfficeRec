import React, { Component } from 'react';
import './Popup.css';
import fire from './config/fire';
import MainWindow from './MainWindow';

class Popup extends Component {
    constructor(props) {
        super(props);
        this.state = {}
        this.close = this.close.bind(this);
        this.donotClose = this.donotClose.bind(this);

        this.db = fire.firestore();
    }

    close(e) {
        e.preventDefault();
        this.props.close();
    }

    donotClose(e) {
        e.stopPropagation();
    }

    componentDidMount() {
        // this.db = fire.firestore();
        // this.db.collection('UserBase').doc(this.props.id).get().then((doc) => {
        //     console.clear();
        //     console.log("the data is", doc.data());
        //     this.setState({
        //         name: doc.data().Name,
        //         czn: doc.data()['Citizenship Number'],
        //         dob: doc.data()['Date of Birth']
        //     })
        // });

        // var fullPath = 'UserBase/' + this.props.id;
        //     this.db.collection(fullPath).get().then((subdoc) => {
        //         subdoc.forEach((sd) => {
        //             console.log(sd.data());
        //         });
        //     })
    }

    render() {
        return (
            <div className='popup' onClick={this.close}>
                <div className='popup-inner' onClick={this.donotClose}>
                    <ul class="nav nav-pills">
                        <li class="nav-item">
                            <a class="nav-link active" href="#">Personal</a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link" href="#">Link</a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link" href="#">Link</a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link disabled" href="#">Disabled</a>
                        </li>
                    </ul>
                    <MainWindow user={this.props.id}></MainWindow>
                    <button onClick={this.close} style={{ 'margin-lef`t': '100px' }}>Close</button>
                </div>
            </div >
        );
    }
}

export default Popup;