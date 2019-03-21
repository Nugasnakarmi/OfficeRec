import React ,{Component} from 'react';
import fire from './config/fire';
import firebase from 'firebase';



class Precords extends Component{
    constructor( props ){
        super( props );
        this.state= {
            name:'',
            email:'',
            password: ''

        }

       
        this.handleChange = this.handleChange.bind(this);
        this.updateUserProfile = this.updateUserProfile.bind(this);

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
           
           
            const credential = fire.auth.EmailAuthProvider.credential(
                user.email,
                user.password
            );
            user.reauthenticateAndRetrieveDataWithCredential(credential).then(function() {
                console.log("reauthentication successful");
              }).catch( (error) => {
                window.alert(error.message);
              });
            
            user.updateEmail(
                
                   this.state.email
                
            ).then( ()=>{
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

<<<<<<< HEAD
        <div >
=======
        <div className="col-12">
>>>>>>> 1633027a0d03dfe4efd13c3f545d26c9104ecacb
            <small><i>Please fill your details</i></small>
            
            <form>
                <div className="form-group beta">
                    <input value ={this.state.name} name ="name" type="text" onChange={this.handleChange}
                    className="form-control" id="Inputname1" placeholder="Enter your real name" />
                    <label for ="Inputname1"><small>Enter name </small> </label>
                </div>  
                <div className="form-group beta">
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