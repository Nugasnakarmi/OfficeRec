import React, { Component } from 'react';
import fire from './config/fire';
import './mainwindow.css';

class MainWindow extends Component {
    constructor(props) {
        super(props);
        this.state = { value: '' }
        this.db = fire.firestore();
        this.db.collection('User').doc('W2xD0Op2KkA1yVDvhZZ2').get().then((doc) => {
            this.setState({
                value: doc.data()
            });
        });

    }

    // componentWillMount(){
    //     var db = fire.firestore();
    //     var datab = db.collection('User');
    //     console.log (datab);
    // }

    render() {
        console.log(this.state.value);
        //console.log("Date of birth", this.state.value['Date of Birth']['seconds']);
        //var link = this.props.link;
        var date = this.state.value['Date of Birth'];
        var dateHolder = null;
        //console.log ('dATE: ', date);
        if (date) {
            dateHolder = date.toDate().toString();
        }
        //console.log("After if: ", dateHolder);
        return (
            <div>
                <nav className='navbar-main'></nav>
                <h1 className='mainwindow-header'>Dashboard</h1>
                <div className='dashboard-content'>
                    <p className='content-para'>User ID: {this.props.user}</p>
                    <p className='content-para'>Name: {this.state.value['Name']}</p>
                    <p className='content-para'>Citizenship Number: {this.state.value['Citizenship Number']}</p>
                    <p className='content-para'>Date of Birth: {date ? dateHolder : 'Not Available'}</p> 
                </div>
            </div>
        );
    }
}

export default MainWindow;