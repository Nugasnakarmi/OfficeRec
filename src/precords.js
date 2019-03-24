import React ,{Component} from 'react';
import fire from './config/fire';
import firebase from 'firebase';
class Precords extends Component{
    constructor( props ){
        super( props );
        this.state= {
            name:'',
            email:'',
            

        }

        this.getCredentialsfire=this.getCredentialsfire.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.updateUserProfile = this.updateUserProfile.bind(this);

    }
getCredentialsfire()
{
        fire.auth().onAuthStateChanged( (user)=>{
        if( user != null ){
            this.info.name = user.displayName;
            this.info.email= user.email;
           

        }
    });

        
}

updateUserProfile()
{

    fire.auth().onAuthStateChanged( (user)=>{
        if( user != null ){
            var currentUser = fire.auth().currentUser;
            //console.log("Current user line38",currentUser);  
            user.updateProfile(
                {
                    displayName: this.state.name
                    
                }
           
            ).catch( function(error)  {
                window.alert("error while updating");
              console.log(user.displayName);  
            });
            // const currentUser = fire.auth.currentUser;
            console.log("CurrentUser", currentUser.email);
            const credential = firebase.auth.EmailAuthProvider.credential(
               currentUser.email,
               "abc123"
            );
            
            user.reauthenticateAndRetrieveDataWithCredential(credential).then(function() {
                console.log("reauthentication successful");
              }).catch(function(error) {
                window.alert(error.message);
              });
            
            user.updateEmail(this.state.email
            
                  
                
            ).catch( function(error)  {
                console.log(error.code);
                window.alert(error.message); } );
                
            console.log(user.email);
            console.log( user.displayName)
            window.alert("updated successfully" );
        }
    })
}
    


handleChange = e => this.setState({ [e.target.name]: e.target.value });


render() {

return(

        <div className="precords">
            <small><i>Please fill your details</i></small>
            
            <form className ="precords">
                <div className="form-group">
                    <input value ={this.state.name} name ="name" type="text" onChange={this.handleChange}
                    className="form-control" id="Inputname1" placeholder="Enter email" />
                    <label htmlFor ="Inputname1"><small>email of user </small> </label>
                </div>  
                {/* <div className="form-group">
                    <input value ={this.state.email} name = "email" type="email" onChange={this.handleChange} 
                    className="form-control" id="Inputemail1" placeholder="Change email"/>
                    <label for ="Inputemail1"><small>Change email </small> </label>
                </div>     */}
             </form>
             <button  onClick ={this.updateUserProfile} className="btn btn-primary">Search</button>
             
        </div>
    

);
}


}
export default Precords;