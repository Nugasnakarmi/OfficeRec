import React, { Component } from 'react';
import fire from './config/fire';
import firebase from 'firebase';


class EditDetails extends Component {
    constructor(props) {
        super(props);
        this.state = {

            email: '',
          
            warningStatus: 'inactive'
        };
        this.db = fire.firestore();

        this.handleChange = this.handleChange.bind(this);
        this.handleCitizenship = this.handleCitizenship.bind(this);

        this.writeDetails = this.writeDetails.bind(this);


    }
    handleChange = e => this.setState({ [e.target.name]: e.target.value });

    handleCitizenship(e) {
        const allowed = ['', '0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '/', '-'];

        if (allowed.includes(e.target.value.substr(-1))) {

            this.setState({ [e.target.name]: e.target.value });
        }


    }
    writeDetails(event) {

        event.preventDefault();
        if (this.state.email) {
            var isadmin;
            this.db.collection("UserBase").doc(this.state.email).get().then((doc) => {
                if( doc.data()["isAdmin"]){isadmin =true;}
                else{isadmin =false;}
                
            }).then(()=>{ 
                this.db.collection("UserBase").doc(this.state.email).set({
                ['Citizenship Number']: this.state.citizenship_num,
                ['Date of Birth']: firebase.firestore.Timestamp.fromDate(new Date(this.state.dob)),
                Name: this.state.name,
                isAdmin : isadmin

            })
                .then(function () {
                    window.alert("successfully written!");
                })
                .catch(function (error) {
                    console.error("Error writing document: ", error);
                });
            })
           
        }
        else {
            window.alert("User cannot be empty");
        }
    }
 
    render() {
        if (!this.state.email) {
            this.setState({
                email: this.props.user
            })
        }
        return (
            <section>
            <h2>Personal Details</h2>
           
            <div className="form-row">
                <div className="col-md-4 mb-3">
                    <label for="name">Name</label>
                    <input value={this.state.name} name="name" className="form-control" type="text" id="name" onChange={this.handleChange} placeholder="Name"></input>
                </div>
                <div className="col-md-4 mb-3">
                    <label for="citizenship">Citizenship Number</label>
                    <input value={this.state.citizenship_num} name="citizenship_num" className="form-control" id="citizenship" type="text" onChange={this.handleCitizenship} placeholder="Citizenship Number"></input>
                </div>
                <div className="col-md-4 mb-3">
                    <label for="dateofbirth">Date of Birth</label>
                    <input value={this.state.dob} name="dob" type="date" id="dateofbirth" onChange={this.handleChange} className="form-control" placeholder="Date in AD"></input>
                </div>


                <button onClick={this.writeDetails} className='btn btn-primary'>Write</button>
            </div>
        </section>

        )
    }
}

export default EditDetails;
