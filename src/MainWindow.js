import React, { Component } from 'react';
import fire from './config/fire';

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
                </div>
            </div>
        );
    }
}

export default MainWindow;