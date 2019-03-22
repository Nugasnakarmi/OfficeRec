import React, { Component } from 'react';
import fire from './config/fire';
import './App.css';
import Login from './login';
import Home from './home';
import './bootstrap.css';


class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            user: {}
        }
        }

        componentDidMount() {
            this.authListener();
        }
        authListener() {
            fire.auth().onAuthStateChanged((user) => {
                //console.log(user);
                if (user) {
                    this.setState({ user });
                    // console.log("HHHHHHHHHHHH", user.email)  //localStorage.setItem('user', user.uid);
                        
                }
                else {
                    this.setState({ user: null });
                    //localStorage.removeItem('user');
                }

            });
        
        

        }

        
        render() {
            
            return (
                <div className="App">
                
                    { this.state.user ?( <Home user={this.state.user.email}/>) : (<Login />) }
                </div>
            );
        }
    }

    export default App;
