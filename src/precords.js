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

    writeVehicleDetails(e) {
        e.preventDefault();
        if (this.state.email) {
            var droplist = document.getElementById("drop-vehicle")
            var selected = droplist.selectedIndex;
            var vehiclecount;
            var docRef;
            console.log(selected + 1);

            if (selected === 0) {
                docRef = this.db.collection("UserBase").doc(this.state.email).collection("vehicle-tax").doc("2 wheeler");
                docRef.get().then((doc) => {
                    vehiclecount = doc.data()["count"]
                });
                if (vehiclecount) {
                    docRef.set({
                        VRN: this.state.VRN,
                        count: vehiclecount + 1

                    })
                }
                else {
                    docRef.set({
                        VRN: this.state.VRN,
                        count: 1

                    })
                }

            }
            else {
                console.log("4 wheeler");
                docRef = this.db.collection("UserBase").doc(this.state.email).collection("vehicle-tax").doc("4 wheeler");
                docRef.get().then((doc) => {
                    vehiclecount = doc.data()["count"]
                });
                if (vehiclecount) {
                    docRef.set({
                        VRN: this.state.VRN,
                        count: vehiclecount + 1

                    })
                }
                else {
                    docRef.set({
                        VRN: this.state.VRN,
                        count: 1

                    })
                }
            }
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
                <span className="add details">
                    <h3> Vehicle details here </h3>
                    <form>

                        <select id="drop-vehicle" >
                            {/* <option value="nothing" defaultValue="selected">---</option> */}
                            <option> two-wheeler</option>
                            <option> four-wheeler</option>
                        </select>


                        <label HTMlfor="drop-down vehicle" position="left"> Choose type</label>
                    </form>

                    <input value={this.state.VRN} className="form-control" name="VRN" type="text" length="auto" onChange={this.handleChange} placeholder=" Vehicle Registration Number Eg: BA 2 CHA 0000"></input>
                    <button onClick={this.writeVehicleDetails} className="btn btn-primary">Submit</button>
                </span>


            </div>


        )

        selectlist = document.getElementById('drop-vehicle');
        this.dropChange(selectlist.selectedIndex)



    }
}
export default Precords;