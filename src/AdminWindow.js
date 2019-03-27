import React, { Component } from 'react';
import fire from './config/fire'

class AdminWindow extends Component {
    constructor(props) {
        super(props);
        this.state = {
            userInfo: '',
            email: '',
            searched: false
        };

        this.db = fire.firestore();
        // this.storedData ='';

        this.getUserDetails = this.getUserDetails.bind(this);
        this.fixDate= this.fixDate.bind(this);
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
                    // localStorage.setItem('localInfo', JSON.stringify(doc.data()));
                    // this.storedData = JSON.parse(localStorage.getItem('localInfo'));



                }).catch(function (error) {
                    console.log(error.message);
                    window.alert("user not found")
                }

                )
           
        }
    }
    handleChange = e => this.setState({ [e.target.name]: e.target.value });
    
    handleClick() {
        (this.state.email !== '') ? (this.getUserDetails(this.state.email)) : ( window.alert("enter email please") );
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
    
    render() {
        var date = this.state.userInfo['Date of Birth'];
       

        
        return (  
            <div className ='admin-panel' >
                <h1>Admin Panel</h1>
                <p>Search and view User Records here</p>
                
                <form >
                
                <div className="form-group">
                    <input value ={ this.state.email } name ="email" type="email" onChange={this.handleChange}
                    className="form-control" id="Inputname1" placeholder="Enter email" />
                    <label htmlFor ="Inputemail1"><small>email of user </small> </label>
                </div> 
                
                    
                </form>
             

             <button  onClick ={this.handleClick} className="btn btn-primary">Search</button> 
              
         {  this.state.searched ? ( <div className="precords-content"> 
                <p className='content-para'>User Email: {this.state.email }</p>
                {console.log("displaying")}
                <p className='content-para'>Name: {this.state.userInfo['Name']}</p>
                <p className='content-para'>Citizenship Number: { this.state.userInfo['Citizenship Number']}</p>
                <p className='content-para'>Date of Birth: {date ? this.fixDate(date) : 'Not Available'}</p>
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