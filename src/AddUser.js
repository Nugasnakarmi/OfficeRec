import React, { Component } from 'react';
import fire from './config/fire';
import firebase from 'firebase';
import './adduser.css';
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
        else{
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
        return (<div>
            <header><h1>Add a New User</h1></header>
            <div className='container'>
                <form>
                    <section>
                        <h2>Login Details</h2>
                        <div className="form-group">
                            <label for="InputEmail1"> Email Address</label>
                            <input value={this.state.email} onChange={this.handleChange} required="required" type="email" name="email"
                                className="form-control" id="InputEmail1" aria-describedby="emailHelp"
                                placeholder="Enter email" />
                            <small id="emailHelp" className="form-text text-muted"> We will never share your email with anyone else.</small>
                        </div>
                        <div className="form-group">
                            <label for="InputPassword1">Password</label>
                            <input value={this.state.password} onChange={this.handleChange} type='password'
                                required="required" name='password' className="form-control" id="InputPassword1"
                                placeholder="Enter password" />
                        </div>
                        <div className="form-group">
                            <label for="InputPassword2">Confirm Password</label>
                            <input value={this.state.confirm_password} onChange={this.handleChange} type='password'
                                required="required" name='confirm_password' className="form-control" id="InputPassword2"
                                placeholder="Confirm password" />
                        </div>
                    </section>

                    <section>
                        <h2>User Details</h2>
                        <div class="form-check form-check-inline">
                            <input class="form-check-input" type="radio" name="isAdmin" id="user" onChange={() => this.handleRadioButton(1)} checked={this.state.value === 1} />
                            <label class="form-check-label" for="user">
                                User
                            </label>
                        </div>
                        <div class="form-check form-check-inline">
                            <input class="form-check-input" type="radio" name="isAdmin" id="admin" onChange={() => this.handleRadioButton(2)} checked={this.state.value === 2} />
                            <label class="form-check-label" for="admin">
                                Admin
                            </label>
                        </div>
                        <div className="form-group">
                            <label for='name'>Name</label>
                            <input value={this.state.name} name="name" type="text" required="required" onChange={this.handleChange} className="form-control" id='name' />
                        </div>
                        <div className="form-group">
                            <label for='citizenship'>Citizenship Number</label>
                            <input value={this.state.citizenship_num} name="citizenship_num" type="text" required="required" onChange={this.handleChange} className="form-control" id='citizenship' />
                        </div>
                        <div className="form-group">
                            <label for='dob'>Date of Birth</label>
                            <input value={this.state.dob} name="dob" type="date" required="required" onChange={this.handleChange} placeholder="Date in AD" className="form-control" id='dob' />
                        </div>
                        <label for='photo'>Photo</label>
                        <div className="input-group mb-3">
                            {/* <div className="input-group-prepend">
                                <span className="input-group-text" id="inputGroupFileAddon01">Upload</span>
                            </div> */}
                            <div className="custom-file photo-box" style = {{border: '1px solid #ced4da', 'border-radius': '0.25rem'}}>
                                <input className = "my-input" name="photoLocation" onChange={this.handlePhoto} required="required" accept='image/*' type="file" id="photo" aria-describedby="inputGroupFileAddon01" />
                            </div>
                        </div>
                        {/* <input type='file' onChange={this.handlePhoto} required="required" accept='image/*'></input> */}
                    </section>
                    <button onClick={this.signupAndWriteDetails} style={{ marginLeft: '25px' }} className='btn btn-success'>Create User</button>
                </form>
            </div>
        </div>);
    }
}

export default AddUser;