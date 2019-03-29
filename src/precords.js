import React, { Component } from 'react';
import fire from './config/fire';
import firebase from 'firebase';
class Precords extends Component {
    constructor(props) {
        super(props);
        this.state = {
            userInfo: '',
            email: '',

        };

        this.count = 0;
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
                vehicleRef = this.db.collection("UserBase").doc(this.state.email).collection("vehicle-tax").doc(this.state.VRN);
                //    vehicleRef.get().then( (doc) =>{
                //        vehiclecount= doc.data()["count"]
                //     });
                vehicleRef.set(
                    {
                        amount: parseFloat(this.state.taxAmount),
                        due: firebase.firestore.Timestamp.fromDate(new Date(this.state.dueDate)),
                        type: "2 wheeler"
                    }, { merge: true }
                )

            }
            else {
                console.log("4 wheeler");
                vehicleRef = this.db.collection("UserBase").doc(this.state.email).collection("vehicle-tax").doc(this.state.VRN);
                vehicleRef.set({
                    amount: parseFloat(this.state.taxAmount),
                    due: firebase.firestore.Timestamp.fromDate(new Date(this.state.dueDate)),
                    type: "4 wheeler"
                }, { merge: true });
            }
        }
        else {
            window.alert("User cannot be empty");

        }

    }

    writeLandDetails(e) {
        e.preventDefault();
        var landRef;
        var count = 0;
        // var fullPath = "UserBase/" + this.state.email + "/land-tax";
        landRef = this.db.collection("UserBase").doc(this.state.email).collection("land-tax");
        if (this.state.email) {
            console.log("Just after if", count);
            landRef.get().then((doc) => {
                doc.forEach((sd) => {
                    count++;
                    console.log(sd.data());
                    console.log(count);
                })


            }

            ).then(() => {
                landRef.doc((count + 1).toString()).set({
                    Location: {
                        province: this.state.province,
                        district: this.state.district,
                        municipality: this.state.municipality,
                        ward: parseFloat(this.state.ward)
                    },
                    listingId: parseFloat(this.state.listingId),
                    taxAmount: parseFloat(this.state.taxAmountLand),
                    ['due date']: firebase.firestore.Timestamp.fromDate(new Date(this.state.dueDateLand))

                }, { merge: true });
            });





        }
        else {
            window.alert("User cannot be empty");
        }

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
                <div className="add vehicle details">
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
                </div>



                <span className="add land details">
                    <h3> Land details here </h3>
                    <form>
                        <div className="input-location" id="inputLocation">
                            <input value={this.state.province} id="inputprovince" name="province" type="text" onChange={this.handleChange} placeholder=" Province "></input>
                            {/* <label htmlFor="inputLand"><small><i>Enter location</i></small></label>  */}
                            <input value={this.state.district} id="inputdistrict" name="district" type="text" onChange={this.handleChange} placeholder=" District "></input>
                            <input value={this.state.municipality} id="inputmuni" name="municipality" type="text" onChange={this.handleChange} placeholder=" Municipality"></input>
                            <input value={this.state.ward} id="inputward" name="ward" type="number" onChange={this.handleChange} placeholder=" Ward"></input>
                        </div>

                        <label htmlFor="inputLocation"><small><i>Enter Location</i></small></label>
                        <div>
                            
                            <input value={this.state.listingId} id="inputListing" name="listingId" className="form-control" onChange={this.handleChange} placeholder="Eg: 1000"></input>
                            <label htmlFor="inputListing"><small><i>Enter Listing id</i></small></label>
                            
                            
                        </div>
                        <div className =" land-add-taxdate">
                            <label htmlFor="inputDate" position="left"> <small><i>Due date</i></small></label>
                            <input value={this.state.dueDateLand} className ="input mini" id="inputDateLand" name="dueDateLand" type="date" onChange={this.handleChange} placeholder="Eg: 12th March 2019"></input>
                            <label htmlFor="inputTax" position="left"> <small><i>Tax amount</i></small></label>
                            <input value={this.state.taxAmountLand} className ="input mini" id="inputTaxLand" name="taxAmountLand" type="number" min="0" onChange={this.handleChange} placeholder="Rs 5000"></input>
                        




                            <button onClick={this.writeLandDetails} className="btn btn-primary">Submit</button>
                            </div>
                    </form>
                </span>


            </div>


        )


    }
}
export default Precords;