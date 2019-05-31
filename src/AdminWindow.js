import React, { Component } from 'react';
import fire from './config/fire';
import Details from './Details';
import RecordList from './RecordList';
import Popup from './Popup';
import './AdminWindow.css';

//import fixDate from './FixDate';

class AdminWindow extends Component {
    constructor(props) {
        super(props);
        this.state = {
            userInfo: '',
            searchParameter: '',
            listed: false,
            popupActive: false,
            activeUser: '',
            filtered:false
        };
        //let recordLabel = [];
        this.db = fire.firestore();
        // this.handleClick = this.handleClick.bind(this);
        this.togglePopup = this.togglePopup.bind(this);
        this.closePopup = this.closePopup.bind(this);
        this.recordLabel = [];

    }

    togglePopup() {
        this.setState(
            {
                showPopup: !this.state.showPopup
            }
        )
    }

    registerQuery = e => {
        return new Promise((resolve, reject) => {
            this.setState({ [e.target.name]: e.target.value });
            resolve(this.state.searchParameter);
            //console.log("resolved", this.state.searchParameter);
        });
    }

    filterData = () => {
        return new Promise((resolve, reject) => {
            for (let entry of this.recordLabel) {
                if (entry.name.toUpperCase().includes(this.state.searchParameter.toUpperCase()) || entry.id.toUpperCase().includes(this.state.searchParameter.toUpperCase())) {
                    this.searchedData.push(entry);
                }
                console.log(this.searchedData);
            }
            resolve(this.searchedData);
        });
    }

    handleChange = e => {
        this.searchedData = [];
        this.registerQuery(e).then(this.filterData).catch(error => {
            console.log(error).then(() => {this.setState({
                filtered: !this.state.filtered
            })});
        });
    }

    // handleChange = e => {
    //     this.setState({ [e.target.name]: e.target.value });
    //     this.searchedData = [];
    //         for (let entry of this.recordLabel) {
    //             if (entry.name.toUpperCase().includes(this.state.searchParameter.toUpperCase()) || entry.id.toUpperCase().includes(this.state.searchParameter.toUpperCase())) {
    //                 this.searchedData.push(entry);
    //             }
    //         }
    // }


    // handleClick(e) {
    //     e.preventDefault();
    //     (this.state.searchParameter !== '') ? (this.setState({
    //         loaded: true,
    //         searched: true
    //     })) : (window.alert("enter search parameter please"));
    // }

    componentDidMount() {
        console.clear();
        this.db.collection("UserBase").get().then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
                // doc.data() is never undefined for query doc snapshots
                console.log(doc.id, " => ", doc.data());
                let valueObject = { id: doc.id, name: doc.data().Name, czn: doc.data()['Citizenship Number'] };
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

    togglePopup(email) {
        console.log(`you clicked on ${email}`);
        this.setState({
            activeUser: email,
            popupActive: !this.popupActive
        });
    }

    closePopup() {
        console.log("THE POPUP CLOSED");
        this.setState({
            activeUser: '',
            popupActive: false
        })
    }

    render() {
        if (this.state.listed) {
            this.displayedData = this.state.searchParameter ? this.searchedData : this.recordLabel;
            console.log("displau", this.displayedData);
        }
        return (
            <div className='admin-panel' style={{ 'marginTop': '60' }}>
                <h2>Admin Panel</h2>
                <p>Search and view User Records here</p>
                <form >
                    <div className="form-group">
                        <input value={this.state.searchParameter} name="searchParameter" type="text" onChange={this.handleChange}
                            className="form-control" id="Inputname1" placeholder="Enter keyword" />
                        <label htmlFor="Inputname1"><small>Search Parameter</small> </label>
                    </div>
                </form>

                {/* <button onClick={this.handleClick} className="btn btn-primary">Search</button> */}

                {this.state.listed ? this.displayedData.map((item, index) => (<RecordList data={item} index={index} pop={this.togglePopup} ></RecordList>)) : <div>Loading</div>}
                {console.log(this.displayedData, this.state.listed)}
                {this.state.popupActive === true ? <Popup id={this.state.activeUser} close={this.closePopup}></Popup> : null}
            </div>
        );
    }
}

export default AdminWindow;