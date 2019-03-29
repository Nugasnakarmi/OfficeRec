import React, { Component } from 'react';
import fire from './config/fire';
import firebase from 'firebase';
class Precords extends Component {
    constructor(props) {
        super(props);
        this.state = {
            userInfo: '',
            email: ''

        };

        this.db = fire.firestore();



        this.handleChange = this.handleChange.bind(this);
        this.dropChange = this.dropChange.bind(this);
        this.writeDetails = this.writeDetails.bind(this);
        this.writeVehicleDetails = this.writeVehicleDetails.bind(this);
        this.writeLandDetails = this.writeLandDetails.bind(this);
    }






    handleChange = e => this.setState({ [e.target.name]: e.target.value });

    writeDetails(event) {
        event.preventDefault();
        this.db.collection("UserBase").doc(this.state.email).set({
            ['Citizenship Number']: this.state.citizenship_num,
            ['Date of Birth']: this.state.dob,
            Name: this.state.name,
            isAdmin: false
        })
            .then(function () {
                console.log("Document successfully written!");
            })
            .catch(function (error) {
                console.error("Error writing document: ", error);
            });
    }

    // writeVehicleDetails(e){
    //     e.preventDefault();
    //     if(this.state.email){
    //     var droplist = document.getElementById("drop-vehicle")
    //     var selected = droplist.selectedIndex;
    //     // var vehiclecount;
    //     var vehicleRef;
    //     console.log(selected +1);

    //     if(selected === 0){
    //        vehicleRef= this.db.collection("UserBase").doc(this.state.email).collection("vehicle-tax").doc("2 wheeler");
    //        vehicleRef.get().then( (doc) =>{
    //            vehiclecount= doc.data()["count"]
    //         });
    //         if(vehiclecount){
    //             vehicleRef.set({
    //                 VRN: this.state.VRN,
    //                 count: vehiclecount +1

    //              }) 
    //         }
    //         else{
    //             vehicleRef.set({
    //                 VRN: this.state.VRN,
    //                 count: 1

    //              }) 
    //         }

    //     }
    //     else{
    //         console.log("4 wheeler");
    //        vehicleRef= this.db.collection("UserBase").doc(this.state.email).collection("vehicle-tax").doc("4 wheeler");
    //        vehicleRef.get().then( (doc) =>{
    //            vehiclecount= doc.data()["count"]
    //         });
    //         if(vehiclecount){
    //             vehicleRef.set({
    //                 VRN: this.state.VRN,
    //                 count: vehiclecount +1

    //              }) 
    //         }
    //         else{
    //             vehicleRef.set({
    //                 VRN: this.state.VRN,
    //                 count: 1

    //              }) 
    //         }
    //     }
    // }
    // else{
    //            window.alert( "User cannot be empty");

    // }

    // }
    writeVehicleDetails(e) {
        e.preventDefault();
        if (this.state.email) {
            var droplist = document.getElementById("drop-vehicle")
            var selected = droplist.selectedIndex;
            // var vehiclecount;
            var vehicleRef;
            console.log(selected + 1);

            if (selected === 0) {
                vehicleRef = this.db.collection("UserBase").doc(this.state.email).collection("vehicle-tax").doc("2 wheeler");
                //    vehicleRef.get().then( (doc) =>{
                //        vehiclecount= doc.data()["count"]
                //     });
                vehicleRef.collection(this.state.VRN).doc("TAX").set(
                    {
                        amount: this.state.taxAmount,
                        due: this.state.dueDate
                    }, { merge: true }
                )

            }
            else {
                console.log("4 wheeler");
                vehicleRef = this.db.collection("UserBase").doc(this.state.email).collection("vehicle-tax").doc("4 wheeler");
                vehicleRef.collection(this.state.VRN).doc("TAX").set({
                    amount: this.state.taxAmount.toFloat(),
                    due: this.state.dueDate.toDate()
                }, { merge: true });
            }

        }
    }
    dropChange(index) {

        console.log(index);
        // this.db.collection("UserBase").doc(this.state.email).collection("vehicle-tax").doc()
    }

    writeLandDetails(e) {
        e.preventDefault();
        var landRef;

        if (this.state.email) {
            landRef = this.db.collection("UserBase").doc(this.state.email).collection("")
        }
        else {
            window.alert("User cannot be empty");
        }
        console.log("landhere")
    }
    dropChange(index) {

        console.log(index);
        // this.db.collection("UserBase").doc(this.state.email).collection("vehicle-tax").doc()
    }



    render() {
        var selectlist;

        return (

            <div className="precords">

                <small><i>Please fill your details</i></small>
                <form>
                    <input value={this.state.email} name="email" type="email" onChange={this.handleChange}
                        className="form-control" id="Inputname1" placeholder="Enter email" />
                    <input value={this.state.citizenship_num} name="citizenship_num" type="text" onChange={this.handleChange} placeholder="Citizenship Number"></input>
                    <input value={this.state.dob} name="dob" type="text" onChange={this.handleChange} placeholder="Date of Birth"></input>
                    <input value={this.state.name} name="name" type="text" onChange={this.handleChange} placeholder="Name"></input>
                    <button onClick={this.writeDetails} className="btn btn-primary">Write</button>
                </form>
                <span className="add vehicle details">
                    <h3> Vehicle details here </h3>
                    <form>

                        <select id="drop-vehicle" className="form-control" >
                            <option> two-wheeler</option>
                            <option> four-wheeler</option>
                        </select>


                        <label htmlFor="drop-vehicle" position="left"> <small><i>Choose type</i></small></label>
                    </form>


                    <input value={this.state.VRN} className="form-control" name="VRN" type="text" onChange={this.handleChange} placeholder=" Vehicle Registration Number Eg: BA 2 CHA 0000"></input>
                    <label htmlFor="inputDate" position="left"> <small><i>Due date</i></small></label>
                    <input value={this.state.dueDate} id="inputDate" name="dueDate" type="date" onChange={this.handleChange} placeholder="Eg: 12th March 2019"></input>
                    <label htmlFor="inputTax" position="left"> <small><i>Tax amount</i></small></label>
                    <input value={this.state.taxAmount} id="inputTax" name="taxAmount" type="number" min="0" onChange={this.handleChange} placeholder="Rs 1000"></input>

                    <button onClick={this.writeVehicleDetails} className="btn btn-primary">Submit</button>
                </span>



                <span className="add land details">
                    <h3> Land details here </h3>
                    <form>
                        <input value={this.state.landLocation} id="inputLand" name="landLocation" className="form-control" onChange={this.handleChange} placeholder="Eg: kathmandu"></input>
                        <label htmlFor="inputLand"><small><i>Enter location</i></small></label>
                        <input value={this.state.listingId} id="inputListing" name="listingId" className="form-control" onChange={this.handleChange} placeholder="Eg: 1000"></input>
                        <label htmlFor="inputListing"><small><i>Enter Listing id</i></small></label>
                    </form>
                    <button onClick={this.writeLandDetails} className="btn btn-primary">Submit</button>
                </span>


            </div>


        )


    }
}

export default Precords;