import React, { Component } from 'react';
import fire from './config/fire';
import './mainwindow.css';
import fixDate from './FixDate';

class MainWindow extends Component {
    constructor(props) {
        super(props);
        this.state = { userInfo: '' };
        this.db = fire.firestore();
        var storage = fire.storage();
        const profilePhotoPath = storage.ref(this.props.user + '/profilepic.jpg');
        profilePhotoPath.getDownloadURL().then((url) => {
            this.setState({
                imageUrl: url
            });
        }).catch((error) => console.error("Error in photo loading"));

        if (this.props.user) {
            this.db.collection('UserBase').doc(this.props.user).get().then((doc) => {
                this.setState({
                    userInfo: doc.data()
                });
                localStorage.setItem('localInfo', JSON.stringify(doc.data()));
                this.storedData = JSON.parse(localStorage.getItem('localInfo'));
                //console.log('Localstorage: ', this.storedData);
                /*
                this.user = {
                    uid: '',
                    displayName: '',
                    photoUrl: ''
                };
                */
            });
        }
    }

    render() {
        //console.log("StoredData inside render", this.storedData);
        var date = this.state.userInfo['Date of Birth'];
        return (
            <div className = "abc">
                <h1 className='mainwindow-header'>Dashboard</h1>
                <div className='dashboard-content row'>
                    <div className="col-6">
                        <p className='content-para'>User ID: {this.props.user}</p>
                        <p className='content-para'>Name: {this.storedData ? this.storedData['Name'] : this.state.userInfo['Name']}</p>
                        <p className='content-para'>Citizenship Number: {this.storedData ? this.storedData['Citizenship Number'] : this.state.userInfo['Citizenship Number']}</p>
                        <p className='content-para'>Date of Birth: {date ? fixDate(date) : 'Not Available'}</p>
                    </div>
                    <div className="col-6">
                        {this.state.imageUrl ? <img src={this.state.imageUrl} className="rounded-photo img-fluid img-thumbnail rounded float-right" alt="Profile Picture" width='200' height='200' /> : <img src="https://cdn.pixabay.com/photo/2016/11/14/17/39/person-1824147_960_720.png" className="rounded-photo img-fluid img-thumbnail rounded float-right" alt="Profile Picture" width='150' height='150' />}
                    </div>
                </div>
            </div>
        );
    }
}

export default MainWindow;