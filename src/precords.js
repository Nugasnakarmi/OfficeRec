import React, { Component } from 'react';
import fire from './config/fire';
import firebase from 'firebase';
import './precords.css';

import EditDetails from './EditDetails';
import EditVehicle from './EditVehicle';
import EditLand from './EditLand';
import EditHouse from './EditHouse';
import EditIncome from './EditIncome';

class Precords extends Component {
    constructor(props) {
        super(props);
        this.state = {

            email: '',
            emailVerified: false,



            warningStatus: 'inactive'
        };

        this.count = 0;
        this.db = fire.firestore();

        this.handleChange = this.handleChange.bind(this);
        this.handleChangeEmail = this.handleChangeEmail.bind(this);

    }

    handleChange = e => this.setState({ [e.target.name]: e.target.value });



    handleChangeEmail = e => {
        var userRef;
        this.setState({ [e.target.name]: e.target.value });
        if (e.target.value) {
            userRef = this.db.collection("UserBase").doc(e.target.value).get().then((doc) => {
                if (doc.data()) {
                    this.setState({
                        emailVerified: true
                    })
                }
            })
        }
        else{
            this.setState({
                emailVerified : false
            })
        }
    }






    render() {

        console.log("warningStatus", this.state.warningStatus);

        return (
            <div className="precords container">
                <form>
                    <section>
                    <div className="form-group">

                        <label for="InputEmail1">Email Address</label>
                        <input value={this.state.email} name="email" type="email" onChange={this.handleChangeEmail}
                            className="form-control" id="InputEmail1" placeholder="Enter email" />
                    </div>
                    </section>
                    
                    {this.state.emailVerified ? (<EditDetails user={this.state.email} />) : ( <i> Please type in your email </i> )}
                    {this.state.emailVerified ? (<EditVehicle user={this.state.email} />) : ''}
                    {this.state.emailVerified ? (<EditLand user={this.state.email} />) : ''}
                    {this.state.emailVerified ? (<EditHouse user={this.state.email} />) : ''}
                    {this.state.emailVerified ? (<EditIncome user={this.state.email} />) : ''}



                </form>
            </div>
        )
    }
}
export default Precords;