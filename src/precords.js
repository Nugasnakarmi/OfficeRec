import React, { Component } from 'react';
import fire from './config/fire';
import firebase from 'firebase';
class Precords extends Component {
    constructor(props) {
        super(props);
        this.state = {
            userInfo: '',
            email: '',
            searched: false
        };

        this.db = fire.firestore();
        // this.storedData ='';

        this.getUserDetails = this.getUserDetails.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleClick = this.handleClick.bind(this);
        this.writeDetails = this.writeDetails.bind(this);
        // this.updateUserProfile = this.updateUserProfile.bind(this);

    }
    getUserDetails(mail) {
        if (mail !== '') {
            this.db.collection('UserBase').doc(mail).get()
                .then((doc) => {
                    this.setState({
                        userInfo: doc.data(),
                        searched: true
                    }
                    )
                    // localStorage.setItem('localInfo', JSON.stringify(doc.data()));
                    // this.storedData = JSON.parse(localStorage.getItem('localInfo'));



                }).catch(function (error) {
                    console.log(error.message);
                    window.alert("user not found")
                }

                )
            // .then( () =>{
            //     this.setState(
            //         {
            //             searched: true
            //         }
            //     )
            //     console.log("searched variable to true");
            // });



            // }

        }
    }

    // updateUserProfile()
    // {
    //    var credential;
    //     fire.auth().onAuthStateChanged( (user)=>{
    //         if( user != null ){
    //             var currentUser = fire.auth().currentUser;
    //             console.log( currentUser);  
    //             user.updateProfile(
    //                 {
    //                     displayName: this.state.name

    //                 }

    //             ).catch( function(error)  {
    //                 window.alert("error while updating");
    //               console.log(user.displayName);  
    //             });
    //             // const currentUser = fire.auth.currentUser;

    //              user.EmailAuthProvider.credential(
    //                currentUser.email,
    //                "abc123"
    //             ).then( function( cred){ 
    //                 credential = cred;
    //             });

    //             fire.auth().reauthenticateAndRetrieveDataWithCredential(credential).then(function() {
    //                 console.log("reauthentication successful");
    //               }).catch(function(error) {
    //                 window.alert(error.message);
    //               });

    //             user.updateEmail(this.state.email



    //             ).catch( function(error)  {
    //                 console.log(error.code);
    //                 window.alert(error.message); } );

    //             console.log(user.email);
    //             console.log( user.displayName)
    //             window.alert("updated successfully" );
    //         }
    //     })
    // }

    handleClick() {
        (this.state.email !== '') ? (this.getUserDetails(this.state.email)) : (window.log("enter email please"));
    }

    handleChange = e => this.setState({ [e.target.name]: e.target.value });

    writeDetails(event ) {
        event.preventDefault();
        this.db.collection("UserBase").doc(this.state.email).set({
            ['Citizenship Number']: this.state.citizenship_num,
            ['Date of Birth']: this.state.dob,
            Name: this.state.name,
            isAdmin: false
        })
            .then(function () {
                console.log("Document successfully written!");
            })
            .catch(function (error) {
                console.error("Error writing document: ", error);
            });

    }

    render() {

        // var date = this.state.userInfo['Date of Birth'];
        // var dateHolder = null;

        // if (date) {
        //     dateHolder = date.toDate().toString();
        // }

        return (

            <div className="precords">
                {/* <small><i>Please fill your details</i></small>
            
            <form className ="precords">
                <div className="form-group">
                    <input value ={ this.state.email } name ="email" type="email" onChange={this.handleChange}
                    className="form-control" id="Inputname1" placeholder="Enter email" />
                    <label htmlFor ="Inputemail1"><small>email of user </small> </label>
                </div> 
                
                    
             </form>
             

             <button  onClick ={this.handleClick} className="btn btn-primary">Search</button> */}
                {/* <button  onClick ={this.updateUserProfile} className="btn btn-primary">Update</button> */}
                {/* {this.state.searched ? ( <div className="precords-content">
                <p className='content-para'>User Email: {this.state.email }</p>
                {console.log("displaying")};
                <p className='content-para'>Name: {this.state.userInfo['Name']}</p>
                <p className='content-para'>Citizenship Number: { this.state.userInfo['Citizenship Number']}</p>
                {/* <p className='content-para'>Date of Birth: {date ? dateHolder : 'Not Available'}</p> */}
            {/* </div>) */}
    {/* //         : ( */}
    {/* //         <div> */}
    {/* //             <small> <i> Please search for user</i></small> */}
    {/* //         </div> */}
    {/* //     )
    // } */} */}
                
        <form>
            <input value ={ this.state.email } name ="email" type="email" onChange={this.handleChange}
                    className="form-control" id="Inputname1" placeholder="Enter email" />
            <input value ={ this.state.citizenship_num } name ="citizenship_num" type="text" onChange={this.handleChange} placeholder="Citizenship Number"></input>
            <input value ={ this.state.dob } name ="dob" type="text" onChange={this.handleChange} placeholder="Date of Birth"></input>
            <input value ={ this.state.name } name ="name" type="text" onChange={this.handleChange} placeholder="Name"></input>
            <button  onClick ={this.writeDetails} className="btn btn-primary">Write</button>
        </form>
       </div >
     

);
}


}
export default Precords;