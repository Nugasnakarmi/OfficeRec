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
                ).then(() => { window.alert("updated successfully") }).catch((error) => { window.alert(error.message) });

            }
            else {
                console.log("4 wheeler");
                vehicleRef = this.db.collection("UserBase").doc(this.state.email).collection("vehicle-tax").doc(this.state.VRN);
                vehicleRef.set({
                    amount: parseFloat(this.state.taxAmount),
                    due: firebase.firestore.Timestamp.fromDate(new Date(this.state.dueDate)),
                    type: "4 wheeler"
                }, { merge: true }).then(() => { window.alert("updated successfully") }).catch((error) => { window.alert(error.message) });;
            }
        }
        else {
            window.alert("User cannot be empty");
        }
    }
    writeLandDetails(e) {
        e.preventDefault();
        var landRef;
        var query;
        var count = 0;
        var docCount = 0;
        var updateCount;
        // var fullPath = "UserBase/" + this.state.email + "/land-tax";
        landRef = this.db.collection("UserBase").doc(this.state.email).collection("land-tax");

        if (this.state.email) {
            query = landRef
                .where("kittaId", "==", parseFloat(this.state.kittaId))
                .where("Location.ward", "==", parseFloat(this.state.ward))
                .where("Location.municipality", "==", this.state.municipality)
                .where("Location.province", "==", this.state.province)
                .where("Location.district", "==", this.state.district)
                ;
            console.log(query);
            // 
            query
                .get()
                .then(function (querySnapshot) {


                    querySnapshot.forEach(function (doc) {
                        docCount++;
                        // doc.data() is never undefined for query doc snapshots
                        console.log(doc.id, " => ", doc.data());
                        // if(updateCount < parseFloat(doc.id) ){
                        //     updateCount = parseFloat(doc.id)
                        // };
                        updateCount = doc.id;
                    });
                }).then(() => {
                    landRef.get().then((sd) => {
                        sd.forEach((doc) => {

                            console.log(doc.id, " =>", doc.data())
                            if (count < parseFloat(doc.id)) {
                                count = parseFloat(doc.id)
                            };
                        });
                    }).then(() => {
                        if (docCount === 0) {
                            landRef.doc((parseFloat(count) + 1).toString()).set({
                                Location: {
                                    province: this.state.province,
                                    district: this.state.district,
                                    municipality: this.state.municipality,
                                    ward: parseFloat(this.state.ward)
                                },
                                kittaId: parseFloat(this.state.kittaId),
                                taxAmount: parseFloat(this.state.taxAmountLand),
                                ['due date']: firebase.firestore.Timestamp.fromDate(new Date(this.state.dueDateLand))

                            }, { merge: true });
                            window.alert("data added successfully");
                        }
                        else {
                            landRef.doc(updateCount.toString()).set({
                                Location: {
                                    province: this.state.province,
                                    district: this.state.district,
                                    municipality: this.state.municipality,
                                    ward: parseFloat(this.state.ward)
                                },
                                kittaId: parseFloat(this.state.kittaId),
                                taxAmount: parseFloat(this.state.taxAmountLand),
                                ['due date']: firebase.firestore.Timestamp.fromDate(new Date(this.state.dueDateLand))

                            }, { merge: true });
                            window.alert("data updated");
                        }
                    });
                }).catch(function (error) {
                    console.log("Error getting documents: ", error);
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
            <div className="precords container">
                <form>
                    <section>
                        <h2>Personal Details</h2>
                        <div className="form-group">
                            <label for="InputEmail1">Email Address</label>
                            <input value={this.state.email} name="email" type="email" onChange={this.handleChange}
                                className="form-control" id="InputEmail1" placeholder="Enter email" />
                        </div>
                        <div className="form-group">
                            <label for="name">Name</label>
                            <input value={this.state.name} name="name" className="form-control" type="text" id="name" onChange={this.handleChange} placeholder="Name"></input>
                        </div>
                        <div className="form-group">
                            <label for="citizenship">Citizenship Number</label>
                            <input value={this.state.citizenship_num} name="citizenship_num" className="form-control" id="citizenship" type="text" onChange={this.handleChange} placeholder="Citizenship Number"></input>
                        </div>
                        <div className="form-group">
                            <label for="dateofbirth">Date of Birth</label>
                            <input value={this.state.dob} name="dob" type="text" id="dateofbirth" onChange={this.handleChange} className="form-control" placeholder="Date in AD"></input>
                        </div>

                        <button onClick={this.writeDetails} className='btn btn-primary'>Write</button>
                    </section>

                    <section>
                        <h2> Vehicle here </h2>
                        <div className="form-group">
                            <label htmlFor="drop-vehicle" position="left">Vehicle Type</label>
                            <select id="drop-vehicle" className="custom-select">
                                <option> two-wheeler</option>
                                <option> four-wheeler</option>
                            </select>
                        </div>
                        <div className="form-group">
                            <label for="vrn">Vehicle Registration Number</label>
                            <input value={this.state.VRN} className="form-control" name="VRN" type="text" id="vrn" onChange={this.handleChange} placeholder="Eg: BA 2 CHA 0000"></input>
                        </div>

                        <div class="form-row">
                            <div class="col-md-6 mb-3">
                                <label for="inputDate" position="left">Due date</label>
                                <input value={this.state.dueDate} className="form-control" id="inputDate" name="dueDate" type="date" onChange={this.handleChange} placeholder="Eg: 12th March 2019"></input>
                            </div>
                            <div class="col-md-6 mb-3">
                                <label htmlFor="inputTax" position="left">Tax amount</label>
                                <input value={this.state.taxAmount} id="inputTax" name="taxAmount" className='form-control' type="number" min="0" onChange={this.handleChange} placeholder="Rs 1000"></input>
                            </div>

                            <button onClick={this.writeVehicleDetails} className="btn btn-primary">Submit</button>

                        </div>
                    </section>
                    <section>
                        <h3> Land details here </h3>
                        <label htmlFor="inputLocation">Enter Location</label>
                        <div class="form-row" id="inputLocation">
                            <div class="col-md-3 mb-3">
                                <input value={this.state.province} id="inputprovince" name="province" className="form-control" type="text" onChange={this.handleChange} placeholder=" Province"></input>
                            </div>
                            <div class="col-md-3 mb-3">
                                <input value={this.state.district} id="inputdistrict" name="district" className="form-control" type="text" onChange={this.handleChange} placeholder=" District "></input>
                            </div>
                            <div class="col-md-3 mb-3">
                                <input value={this.state.municipality} id="inputmuni" name="municipality" className="form-control" type="text" onChange={this.handleChange} placeholder=" Municipality"></input>
                            </div>
                            <div class="col-md-3 mb-3">
                                <input value={this.state.ward} id="inputward" name="ward" type="number" className="form-control" min="1" onChange={this.handleChange} placeholder=" Ward"></input>
                            </div>
                        </div>
                        <div className="form-row">
                            <div class="col-md-6 mb-3">
                                <label htmlFor="inputkitta"><i>Kitta Number</i></label>
                                <input value={this.state.kittaId} id="inputkitta" name="kittaId" className="form-control" onChange={this.handleChange} placeholder="कित्ता नम्बर"></input>
                            </div>
                            <div class="col-md-6 mb-3"> {/*Has not been implemented in database yet */}
                                <label htmlFor="area"><i>Area</i></label>
                                <input value={this.state.kittaId} id="area" name="area" className="form-control" onChange={this.handleChange} placeholder="Area in sq. meters"></input>                            </div>
                        </div>

                        <div className="form-row">
                            <div class="col-md-6 mb-3">
                                <label htmlFor="inputDate" position="left">Due date</label>
                                <input value={this.state.dueDateLand} className="form-control" id="inputDateLand" name="dueDateLand" type="date" onChange={this.handleChange} placeholder="Eg: 12th March 2019"></input>
                            </div>
                            <div class="col-md-6 mb-3">
                                <label htmlFor="inputTax" position="left">Tax amount</label>
                                <input value={this.state.taxAmountLand} className="form-control" id="inputTaxLand" name="taxAmountLand" type="number" min="0" onChange={this.handleChange} placeholder="Rs 5000"></input>

                            </div>
                            <button onClick={this.writeLandDetails} className="btn btn-primary">Submit</button>
                        </div>
                    </section>
                </form>
            </div>
        )
    }
}
export default Precords;