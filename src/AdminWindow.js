import React, { Component } from 'react';
import fire from './config/fire';
import Details from './Details';
import RecordList from './RecordList';
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
        //let recordLabel = [];
        this.db = fire.firestore();
        this.handleClick = this.handleClick.bind(this);
        this.recordLabel = [];
    }

    handleChange = e => {
        this.setState({ [e.target.name]: e.target.value });
        this.setState({ loaded: false })
    }

    handleClick(e) {
        e.preventDefault();
        (this.state.email !== '') ? (this.setState({
            loaded: true,
            searched: true
        })) : (window.alert("enter email please"));
    }

    componentDidMount() {
        console.clear();
   
        this.db.collection("UserBase").get().then( (querySnapshot) => {
            querySnapshot.forEach((doc) => {
                // doc.data() is never undefined for query doc snapshots
                console.log(doc.id, " => ", doc.data());
                let valueObject = {id: doc.id, name: doc.data().Name};
                //console.log(this.recordLabel);
                this.recordLabel.push(valueObject);
               console.log("ValueObject", valueObject); 
            });
            console.log("List of data => ", this.recordLabel);
        })
        .then(() => {
            this.setState({
                listed: true
            });
        }); //attach a promise here that sets state to reload
    }

    render() {
        return (
            <div className='admin-panel container' style={{ 'marginTop': '60' }}>
                {/* <h2>Admin Panel</h2>
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
                <div className = 'record'> */}

                {/* </div> */}
                {this.recordLabel.map((item) => (<RecordList data = {item}></RecordList>))}
            </div>
        );
    }
}

export default AdminWindow;