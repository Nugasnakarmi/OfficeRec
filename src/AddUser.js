import React, { Component } from 'react';
import fire from './config/fire';
import firebase from 'firebase';
import './adduser.css';
import {
    Card, Button, CardHeader, CardFooter, CardBody,
    CardTitle, CardText
} from 'reactstrap';


class AddUser extends Component {
    constructor(props) {
        super(props);
        this.handleChange = this.handleChange.bind(this);
        this.signup = this.signup.bind(this);
        this.writeDetails = this.writeDetails.bind(this);
        this.signupAndWriteDetails = this.signupAndWriteDetails.bind(this);
        this.handleRadioButton = this.handleRadioButton.bind(this);
        this.handlePhoto = this.handlePhoto.bind(this);
        this.db = fire.firestore();

        this.state = {
            email: '',
            password: '',
            isAdmin: false,
            //photoLocation: ''
        }
    }

    handleChange(e) {
        this.setState({ [e.target.name]: (e.target.type === 'radio') ? e.target.checked : e.target.value });
    }

    handleRadioButton(value) {
        this.setState({ value: value });
    }

    handlePhoto(e) {
        if (this.state.email) {
            var photo = e.target.files[0];
            var storageRef = firebase.storage().ref(this.state.email.toString() + '/profilepic.jpg');
            storageRef.put(photo);
            console.log('Photo PUT!!');
        }
        else {
            window.alert("Enter an e-mail ID")
        }
    }

    signup() {
        //e.preventDefault();
        (this.state.password !== this.state.confirm_password)
            ? window.alert("Passwords do not match")

            : fire.auth().createUserWithEmailAndPassword(this.state.email, this.state.password).catch(function (error) {
                // Handle Errors here.
                window.alert(error.code, error.message, "Email format is wrong.");
                //console.log(error.message);
                // ...
            });
    }

    writeDetails() {
        //e.preventDefault();
        this.db.collection("UserBase").doc(this.state.email).set({
            ['Citizenship Number']: this.state.citizenship_num,
            ['Date of Birth']: firebase.firestore.Timestamp.fromDate(new Date(this.state.dob)),
            Name: this.state.name,
            isAdmin: this.state.value === 2
        })
            .then(function () {
                window.alert("User successfully registered!");
            })
            .catch(function (error) {
                console.error("Error writing document: ", error);
            });
    }

    signupAndWriteDetails(e) {
        e.preventDefault();
        //this.handlePhoto();
        this.signup();
        this.writeDetails();
    }

    render() {
        return (
            <div className="main-div" align="center" >

                <Card className="cardbox">
                    <CardHeader style={{backgroundColor : "#2D93AD",color: "aliceblue"}}tag="h4"> Login Details</CardHeader>


                    <CardBody>
                        <form className='form-inline'>
                            <section>

                                <div className="form-row">
                                    <div className='col-md-5 mb-3 sm-2'>
                                        <label className="sr-only" for="InputEmail1"> Email Address</label>
                                        <input value={this.state.email} onChange={this.handleChange} required="required" type="email" name="email"
                                            className="form-control input-email" size="35" id="InputEmail1" aria-describedby="emailHelp"
                                            placeholder="Enter email" />
                                    </div>
                                    <div className='col-md-3 mb-3 sm-2'>
                                        <label className="sr-only" for="InputPassword1">Password</label>
                                        <input value={this.state.password} onChange={this.handleChange} type='password'
                                            required="required" name='password' className="form-control" id="InputPassword1"
                                            placeholder="Enter password" />
                                    </div>
                                    <div className=" col-md-4 mb-4 sm-2">
                                        <label className="sr-only" for="InputPassword2">Confirm Password</label>
                                        <input value={this.state.confirm_password} onChange={this.handleChange} type='password'
                                            required="required" name='confirm_password' className="form-control" id="InputPassword2"
                                            placeholder="Confirm password" />
                                    </div>
                                </div>
                                <div>
                                    <small id="emailHelp" className="form-text text-muted"> We will never share your email with anyone else.</small>
                                </div>
                            </section>
                        </form>
                    </CardBody>
                </Card>

                <Card className="cardbox2" >
                    <CardHeader style={{backgroundColor : "#2D93AD" ,color: "aliceblue"}} tag="h4"> User Details</CardHeader>


                    <CardBody>

                        <section>
                            <form className='form-inline'>

                                <div className=" form-check-inline col-md-1">

                                    <input class="form-check-input" type="radio" name="isAdmin" id="user" onChange={() => this.handleRadioButton(1)} checked={this.state.value === 1} />
                                    <label class="form-check-label" for="user">
                                        User
                            </label>

                                </div>
                                <div className="form-check-inline col-md-1">

                                    <input class="form-check-input" type="radio" name="isAdmin" id="admin" onChange={() => this.handleRadioButton(2)} checked={this.state.value === 2} />
                                    <label class="form-check-label" for="admin">
                                        Admin
                            </label>


                                </div>

                            </form>
                            <form className="form-inline">
                                <div className="form-row">

                                    <div className=" col-md-5  sm-2 xs-1">
                                        <label className="sr-only" for='name'>Name</label>
                                        <input value={this.state.name} name="name" size="35" type="text" required="required" onChange={this.handleChange} className="form-control" id='name' placeholder="Name" />
                                    </div>
                                    <div className=" col-md-3 sm-2 xs-1">
                                        <label className="sr-only" for='citizenship'>Citizenship Number</label>
                                        <input value={this.state.citizenship_num} name="citizenship_num" type="text" required="required" onChange={this.handleChange} placeholder="नागरिक्ता नंं" className="form-control" id='citizenship' />
                                    </div>
                                    <div className="  col-md-4 sm-2 xs-1">
                                        <label className="sr-only" for='dob'>Date of Birth</label>
                                        <input value={this.state.dob} name="dob" type="date" required="required" onChange={this.handleChange} placeholder="Date in AD" className="form-control" id='dob' />
                                    </div>
                                </div>
                            </form>
                        </section>

                        <form className="form-inline">
                            <section className =" bottom">
                               
                                {/* <div className="input-group col-12 "> */}
                                <div className="form-row">
                                <div className="input-group col-md-8 mb-4 sm-2">
                                
                                <label  for='photo'>Photo</label>
                               
                                    <div className="custom-file photo-box" style={{ border: '1px solid #ced4da', 'border-radius': '0.25rem' }}>
                                   
                                        <input className="my-input"  name="photoLocation" onChange={this.handlePhoto} required="required" accept='image/*' type="file" id="photo" aria-describedby="inputGroupFileAddon01" />
                                    </div>
                                    </div>
                                {/* <input type='file' onChange={this.handlePhoto} required="required" accept='image/*'></input> */}
                             


                                

                                <div clasName ="col-md-2 mb-1 sm-1 ">
                                <button onClick={this.signupAndWriteDetails} align="right" style={{ marginLeft: '25px' }} className='btn btn-success'>Create User</button>
                               </div>
                               </div>
                            </section>
                        </form>
                    </CardBody>
                </Card>
            </div>
        );
    }
}

export default AddUser;