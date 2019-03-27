import React, { Component } from 'react';
import fire from './config/fire';
import fixDate from './FixDate';

class AdminWindow extends Component {
    constructor(props) {
        super(props);
        this.state = {
            userInfo: '',
            email: '',
            searched: false
        };

        this.db = fire.firestore();
        this.getUserDetails = this.getUserDetails.bind(this);
        this.handleClick = this.handleClick.bind(this);
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
                }).catch(function (error) {
                    console.log(error.message);
                    window.alert("user not found")
                }

                )

        }
    }
    handleChange = e => this.setState({ [e.target.name]: e.target.value });

    handleClick() {
        (this.state.email !== '') ? (this.getUserDetails(this.state.email)) : (window.alert("enter email please"));
    }

    render() {
        var date = this.state.userInfo['Date of Birth'];
       return (
            <div className='admin-panel' >
                <h1>Admin Panel</h1>
                <p>Search and view User Records here</p>

                <form >

                    <div className="form-group">
                        <input value={this.state.email} name="email" type="email" onChange={this.handleChange}
                            className="form-control" id="Inputname1" placeholder="Enter email" />
                        <label htmlFor="Inputemail1"><small>email of user </small> </label>
                    </div>


                </form>


                <button onClick={this.handleClick} className="btn btn-primary">Search</button>

                {this.state.searched ? (<div className="precords-content">
                    <p className='content-para'>User Email: {this.state.email}</p>
                    {console.log("displaying")}
                    <p className='content-para'>Name: {this.state.userInfo['Name']}</p>
                    <p className='content-para'>Citizenship Number: {this.state.userInfo['Citizenship Number']}</p>
                    <p className='content-para'>Date of Birth: {date ? fixDate(date) : 'Not Available'}</p>
                </div>
                )
                    :
                    (
                        <div>
                            <small> <i> Please search for user</i></small>
                        </div>
                    )
                }

            </div>
        );
    }
}

export default AdminWindow;