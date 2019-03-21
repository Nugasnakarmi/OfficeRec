import React ,{Component} from 'react';
import fire from './config/fire';




class Precords extends Component{
    constructor( props ){
        super( props );
        this.state= {
            name:'',
            email:'',
            password: ''

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
            user.updateProfile(
                {
                    displayName: this.state.name
                    
                }
           
            ).then(function(){
                console.log(user.displayName); 
            }).catch( function(error)  {
                window.alert("error while updating");       
              // 
            });
           
            const currentUser = fire.auth.currentUser;
            const credential = fire.auth.EmailAuthProvider.credential(
                currentUser.email,
                currentUser.password
            );
            user.reauthenticateAndRetrieveDataWithCredential(credential).then(function() {
                console.log("reauthentication successful");
              }).catch(function(error) {
                window.alert(error.message);
              });
            
            user.updateEmail(
                
                   this.state.email
                
            ).then( function(){
                window.alert("updated successfully" );
                console.log(user.email);
            })
            
            
            .catch( function(error)  {
                
                window.alert(error.message); } );
                
            }
                
            
        
    })
}
    


handleChange = e => this.setState({ [e.target.name]: e.target.value });


render() {

return(

        <div className="col-12">
            <small><i>Please fill your details</i></small>
            
            <form>
                <div className="form-group">
                    <input value ={this.state.name} name ="name" type="text" onChange={this.handleChange}
                    className="form-control" id="Inputname1" placeholder="Enter your real name" />
                    <label for ="Inputname1"><small>Enter name </small> </label>
                </div>  
                <div className="form-group">
                    <input value ={this.state.email} name = "email" type="email" onChange={this.handleChange} 
                    className="form-control" id="Inputemail1" placeholder="Change email"/>
                    <label for ="Inputemail1"><small>Change email </small> </label>
                </div>    
             </form>
             <button type = "submit" onClick ={this.updateUserProfile} className="btn btn-primary">Save</button>
             
        </div>
    

);
}


}
export default Precords;