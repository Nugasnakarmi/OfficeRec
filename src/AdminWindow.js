import React, { Component } from 'react';
import fire from './config/fire';
import Details from './Details';
//import fixDate from './FixDate';

class AdminWindow extends Component {
    constructor(props) {
        super(props);
        this.state = {
            userInfo: '',
            email: '',
            searched: false,
            loaded: false
        };

        this.db = fire.firestore();
        this.handleClick = this.handleClick.bind(this);
    }
 
    handleChange = e => {this.setState({ [e.target.name]: e.target.value });
        this.setState({loaded:false})}

    handleClick(e) {
        e.preventDefault();
        (this.state.email !== '') ? (this.setState({
            loaded:true,
            searched: true
        })) : (window.alert("enter email please"));
    }

    render() {
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
                {(this.state.searched && this.state.loaded ? (<Details user={this.state.email}></Details>) :
                    <div>
                        <small> <i> Please search for user</i></small>
                    </div>)}
            </div>
        );
    }
}

export default AdminWindow;