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
        

        
        this.handleChange = this.handleChange.bind(this);
    
        this.writeDetails = this.writeDetails.bind(this);
       
    }
   


   


    handleChange = e => this.setState({ [e.target.name]: e.target.value });

    writeDetails(event) {
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

        

        return (

            <div className="precords">
                
                <small><i>Please fill your details</i></small>
                <form>
                    <input value ={ this.state.email } name ="email" type="email" onChange={this.handleChange}
                            className="form-control" id="Inputname1" placeholder="Enter email" />
                    <input value ={ this.state.citizenship_num } name ="citizenship_num" type="text" onChange={this.handleChange} placeholder="Citizenship Number"></input>
                    <input value ={ this.state.dob } name ="dob" type="text" onChange={this.handleChange} placeholder="Date of Birth"></input>
                    <input value ={ this.state.name } name ="name" type="text" onChange={this.handleChange} placeholder="Name"></input>
                    <button  onClick ={this.writeDetails} className="btn btn-primary">Write</button>
                 </form>
       
            
                
 
 </div>       
 )
     





        }
    }
export default Precords;