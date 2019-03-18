import React ,{Component} from 'react';
import fire from './config/fire';




class Precords extends Component{
    constructor( props ){
        super( props );
        this.info= {
            name:'',
            email:'',
            photoUrl:'',
            userVerified:'',

        }

        this.getCredentialsfire=this.getCredentialsfire.bind(this);
        this.handleChange = this.handleChange.bind(this);


    }


getCredentialsfire()
{
    const user = fire.auth().currentUser;

        if( user != null ){
            this.info.name = user.displayName;
            this.info.email= user.email;
            this.info.photoUrl= user.photoURL;
            this.info.userVerified = user.userVerified;


        }
}
handleChange(e) {
    this.setState({ [e.target.name]: e.target.value });

}


render() {

return(
    
        <div className="col-md-6">
            <form>
                <div class="form-group">
                    <input value ="{this.info.name}" type="name" onChange="this.handleChange" class="form-control" id="Inputname1" placeholder="Enter your real name"/>
                    <label for ="Inputname1"> Enter name </label>
                </div>   
             </form>
        </div>
    

);
}


}
export default Precords;