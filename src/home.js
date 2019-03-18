 import React, {Component} from 'react';
 //import {Link} from 'react-router-dom';
 //import {Router} from 'react-router-dom';
import fire from './config/fire';
import Precords from './precords';

class Home extends Component{
    constructor(props){
        super(props);
        this.logout = this.logout.bind(this);
            }

    logout()
    {
        fire.auth().signOut().catch( (error)=> window.alert("Failed to logout", error ) );
    }
        

    
    render()
{
        
        return(
        <div className="welcome">
            <h1> Welcome home! </h1>
            <p id = "get-started"> Get started by filling up data of your personal records</p>
            
        <button onClick={this.logout}> Logout</button>
            
        </div>
            
            
            );
}
}
export default Home;
        
        
        
        
        
        
    
    


