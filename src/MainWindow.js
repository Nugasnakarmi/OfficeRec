import React, { Component } from 'react';
import fire from './config/fire';
import './mainwindow.css';


class MainWindow extends Component {
    constructor(props) {
        super(props);
        this.state = { userInfo: '' };
        this.db = fire.firestore();
        this.fixDate = this.fixDate.bind(this);
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

                console.log('Localstorage: ', this.storedData);

                this.user = {
                    uid: '',
                    displayName: '',
                    photoUrl: ''
                };
            });
        }
        // this.authListener = this.authListener.bind(this);
    }
    fixDate( date ){
    if (date) {
                
        var currentDate;
        
        var dateHolder = date.toDate();
        currentDate = dateHolder;
        var day = currentDate.getDate();
        var month = currentDate.getMonth(); //Be careful! January is 0 not 1
        var year = currentDate.getFullYear();
        // function pad(n) {
        //     return n<10 ? '0'+n : n;
        // }
        function ordinal(i) {
            var j = i % 10,
                k = i % 100;
            if (j == 1 && k != 11) {
                return i + "st";
            }
            if (j == 2 && k != 12) {
                return i + "nd";
            }
            if (j == 3 && k != 13) {
                return i + "rd";
            }
            return i + "th";
        }
        // var mmddyyyy = pad(month + 1) + "/" + pad(day) + "/" + year;
        var monthNames = [
            "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"
          ];
          
        //   var dateWithFullMonthName = monthNames[month] + " " + pad(date) + ", " + year;
          var ordinalDate = ordinal(day) + " " + monthNames[month] + ", " + year;
        return ordinalDate;
    }
}

    // componentWillMount(){
    //     var db = fire.firestore();
    //     var datab = db.collection('User');
    //     console.log (datab);
    // }

    render() {
        console.log("StoredData inside render", this.storedData);
        //console.log("Date of birth", this.state.userInfo['Date of Birth']['seconds']);
        //var link = this.props.link;
        var date = this.state.userInfo['Date of Birth'];
        var dateHolder = null;
        //console.log ('dATE: ', date);
        

        
        //console.log("After if: ", dateHolder);
        return (
            <div>
                {/* <nav className='navbar-main'></nav> */}
                <h1 className='mainwindow-header'>Dashboard</h1>
                <div className='dashboard-content'>
                    <picture>
                        <img src={this.state.imageUrl} className="img-fluid img-thumbnail rounded float-right" alt="Profile Picture" width = '200' height = '200'></img>
                    </picture>
                    <p className='content-para'>User ID: {this.props.user}</p>
                    <p className='content-para'>Name: {this.storedData ? this.storedData['Name'] : this.state.userInfo['Name']}</p>
                    <p className='content-para'>Citizenship Number: {this.storedData ? this.storedData['Citizenship Number'] : this.state.userInfo['Citizenship Number']}</p>
                    <p className='content-para'>Date of Birth: {date ? this.fixDate(date) : 'Not Available'}</p>
                </div>
            </div>
        );
    }
}

export default MainWindow;