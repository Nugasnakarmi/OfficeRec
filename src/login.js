import React, { Component } from 'react';
//import { Link } from 'react-router-dom';
import fire from './config/fire';
import './login.css';

class Login extends Component {
    constructor(props) {
        super(props);
        this.login = this.login.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.signup = this.signup.bind(this);
        this.state = {
            email: '',
            password: ''

        }

    }

    login(e) {
        e.preventDefault();
        fire.auth().signInWithEmailAndPassword(this.state.email, this.state.password).catch((error) => {
            //console.log(error);
            window.alert('Wrong Login Details', error);
        });
    }

    signup(e) {
        e.preventDefault();
        fire.auth().createUserWithEmailAndPassword(this.state.email, this.state.password).catch(function (error) {
            // Handle Errors here.
            window.alert(error.code, error.message, "Email format is wrong.");
            //console.log(error.message);
            // ...
        });
    }

    handleChange(e) {
        this.setState({ [e.target.name]: e.target.value });

    }

    render() {

        return (
            <div className='row pad '>
                <div className='col-3'></div>
                <div className="col-6 jumbotron shadow">
                    <form>
                        <div className="form-group">
                            <label for="InputEmail1"> Email Address</label>
                            <input value={this.state.email} onChange={this.handleChange} type="email" name="email"
                                className="form-control" id="InputEmail1" aria-describedby="emailHelp"
                                placeholder="Enter email" />
                            <small id="emailHelp" className="form-text text-muted"> We will never share your email with anyone else .</small>
                        </div>

                        <div className="form-group">
                            <label for="InputPassword1">Password</label>
                            <input value={this.state.password} onChange={this.handleChange} type='password'
                                name='password' className="form-control" id="InputPassword1"
                                placeholder="Enter password" />
                        </div>


                        <button type="submit" onClick={this.login} className="btn btn-primary"> Login </button>
                        <button onClick={this.signup} style={{ marginLeft: '25px' }} className='btn btn-success'> Signup</button>

                    </form>

                </div>
                <div className='col-3'></div>
            </div>
        );
    }
}
export default Login;










