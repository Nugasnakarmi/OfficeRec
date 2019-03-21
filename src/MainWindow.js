import React, { Component } from 'react';
import fire from './config/fire';
import './mainwindow.css';

import { BrowserRouter as Router, Route, Link } from 'react-router-dom';
import Precords from './precords';

class MainWindow extends Component {
    constructor(props) {
        super(props);
        this.state = { userInfo: '' };
        this.db = fire.firestore();
        // this.user = fire.auth().currentUser;     

        if (this.props.user){
            this.db.collection('UserBase').doc(this.props.user).get().then((doc) => {
                this.setState({
                    userInfo: doc.data()
                });
                localStorage.setItem('localInfo', JSON.stringify(doc.data()));
                this.storedData = JSON.parse(localStorage.getItem('localInfo'));
                
                console.log('Localstorage: ', this.storedData);
                
                this.user = {
                    uid: '',
                    displayName: '',
                    photoUrl: ''
                };
            });
        }
        this.authListener = this.authListener.bind(this);
    }
    authListener() {
        fire.auth().onAuthStateChanged((user) => {
            //console.log(user);
            if (user) {
                console.log("document is", user.uid, user.displayName);
                console.log("login by", this.props.user);
                // this.user.uid = user.uid;
                // this.user.displayName = user.displayName;


            }
            else {
                console.log("user: null ");
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
        console.log("StoredData inside render", this.storedData);
        //console.log("Date of birth", this.state.userInfo['Date of Birth']['seconds']);
        //var link = this.props.link;
        var date = this.state.userInfo['Date of Birth'];
        var dateHolder = null;
        //console.log ('dATE: ', date);
        if (date) {
            dateHolder = date.toDate().toString();
        }
        //console.log("After if: ", dateHolder);
        return (
            <div>
                {/* <nav className='navbar-main'></nav> */}
                <h1 className='mainwindow-header'>Dashboard</h1>
                <div className='dashboard-content'>
                    <p className='content-para'>User ID: {this.props.user}</p>
                    <p className='content-para'>Name: {this.storedData ? this.storedData['Name'] : this.state.userInfo['Name']}</p>
                    <p className='content-para'>Citizenship Number: {this.storedData ? this.storedData['Citizenship Number'] : this.state.userInfo['Citizenship Number']}</p>
                    <p className='content-para'>Date of Birth: {date ? dateHolder : 'Not Available'}</p>
                    <div className="user-details" >
                        {this.authListener()}
                        <Router>
                            <span className="input-group-btn">

                                <Link to="/prerecords">Fill your personal information</Link>
                                <Route path="/prerecords" component={Precords} />



                            </span>
                        </Router>
                    </div>
                </div>
            </div>
        );
    }
}

export default MainWindow;