import React, { Component } from 'react';
import fire from './config/fire';
import './mainwindow.css';

import {BrowserRouter as Router, Route , Link} from 'react-router-dom';
import Precords from './precords';

class MainWindow extends Component {
    constructor(props) {
        super(props);
        
        this.state = { value: '' }
        this.db = fire.firestore();
       // this.user = fire.auth().currentUser;
        this.db.collection('User').doc('W2xD0Op2KkA1yVDvhZZ2').get().then((doc) => {
            this.setState({
                value: doc.data()
            });
        this.user = {
            uid:'',
            displayName:'',
            photoUrl:''
        };
           
        } );
        this.authListener = this.authListener.bind(this);
     }
     authListener() {
        fire.auth().onAuthStateChanged((user) => {
            //console.log(user);
            if (user) {
                // this.user.uid = user.uid;
                // this.user.displayName = user.displayName;
               

            }
            else {
                console.log( "user: null ");
                //localStorage.removeItem('user');
            }

        });

    }

    

    // componentWillMount(){
    //     var db = fire.firestore();
    //     var datab = db.collection('User');
    //     console.log (datab);
    // }

    render() {
<<<<<<< HEAD
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
=======
    //    console.log(this.state.value);
        var link = this.props.link;
    //    var user1 = fire.auth().currentUser;
                      
       
        return (
            <div>
                <nav className='navbar-main'></nav>
                <h1>Main Window here</h1>
                
                {link}
                {this.props.user}
                {this.state.value['Citizenship Number']}
                <div className="user-details" >
                   {this.authListener()}
                   <Router>
                        <span className="input-group-btn">
                        
                        <Link to="/prerecords">Fill your personal information</Link>
                        <Route path ="/prerecords" component = {Precords}/>
                     
                            
                           
                        </span>
                    </Router>
>>>>>>> d71f55db0066c992982de00f73923e2dfd1b96c8
                </div>
            </div>
        );
    }
}

export default MainWindow;