import React, { Component } from 'react';
import fire from './config/fire';
import firebase from 'firebase';
class Precords extends Component {
    constructor(props) {
        super(props);
        this.state = {
            userInfo: '',
            email: '',
            VRN: ''
        };

        this.count = 0;
        this.db = fire.firestore();

        this.handleChange = this.handleChange.bind(this);
        this.handleChangeVRN = this.handleChangeVRN.bind(this);
        // this.handleKeyUp= this.handleKeyUp.bind(this);
        this.writeDetails = this.writeDetails.bind(this);
        this.writeVehicleDetails = this.writeVehicleDetails.bind(this);
        this.writeLandDetails = this.writeLandDetails.bind(this);
        this.writeIncomeDetails = this.writeIncomeDetails.bind(this);
        this.writeHouseDetails = this.writeHouseDetails.bind(this);
    }

    handleChange = e => this.setState({ [e.target.name]: e.target.value });

    handleChangeVRN(e) {

        const input = e.target;

        var start = input.selectionStart;
        var end = input.selectionEnd;


        this.setState(
            { [e.target.name]: e.target.value.toUpperCase() },
            () => input.setSelectionRange(start, end));
    }




    writeDetails(event) {
        event.preventDefault();
        if (this.state.email) {
            this.db.collection("UserBase").doc(this.state.email).set({
                ['Citizenship Number']: this.state.citizenship_num,
                ['Date of Birth']: firebase.firestore.Timestamp.fromDate(new Date(this.state.dob)),
                Name: this.state.name

            })
                .then(function () {
                    window.alert("successfully written!");
                })
                .catch(function (error) {
                    console.error("Error writing document: ", error);
                });
        }
        else {
            window.alert("User cannot be empty");
        }
    }

    writeVehicleDetails(e) {
        e.preventDefault();
        var userRef;
        if (this.state.email) {
            var droplist = document.getElementById("drop-vehicle")
            var selected = droplist.selectedIndex;
            // var vehiclecount;
            var vehicleRef;

            userRef = this.db.collection("UserBase").doc(this.state.email).get().then((doc) => {
                if (doc.data()) {
                    if (selected === 0) {
                        vehicleRef = this.db.collection("UserBase").doc(this.state.email).collection("vehicle-tax").doc(this.state.VRN);
                        //    vehicleRef.get().then( (doc) =>{
                        //        vehiclecount= doc.data()["count"]
                        //     });
                        vehicleRef.set(
                            {
                                amount: parseFloat(this.state.taxAmount),
                                ['due date']: firebase.firestore.Timestamp.fromDate(new Date(this.state.dueDate)),
                                type: "2 wheeler",
                                VRN: this.state.VRN
                            }, { merge: true }
                        ).then(() => { window.alert("updated successfully") }).catch((error) => { window.alert(error.message) });

                    }
                    else {
                        console.log("4 wheeler");
                        vehicleRef = this.db.collection("UserBase").doc(this.state.email).collection("vehicle-tax").doc(this.state.VRN);
                        vehicleRef.set({
                            amount: parseFloat(this.state.taxAmount),
                            ['due date']: firebase.firestore.Timestamp.fromDate(new Date(this.state.dueDate)),
                            type: "4 wheeler",
                            VRN: this.state.VRN
                        }, { merge: true }).then(() => { window.alert("updated successfully") }).catch((error) => { window.alert(error.message) });;
                    }
                    console.log(doc.data())
                }
                else {
                    window.alert("User does not exist");
                }
            })
            console.log(selected + 1);


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
        var userRef;
        // var fullPath = "UserBase/" + this.state.email + "/land-tax";
        landRef = this.db.collection("UserBase").doc(this.state.email).collection("land-tax");

        if (this.state.email) {
            userRef = this.db.collection("UserBase").doc(this.state.email).get().then((doc) => {
                if (doc.data()) {
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
                                        area: parseFloat(this.state.area),
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
                                        area: parseFloat(this.state.area),
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
                    window.alert("User does not exist")
                }
            })

        }
        else {
            window.alert("User cannot be empty");
        }
    }

    writeHouseDetails(e) {
        e.preventDefault();
        var userRef;
        var houseRef;
        var droplist = document.getElementById("drop-house")
        var selected = droplist.options[droplist.selectedIndex].value;
        console.log(selected);
        if (this.state.email) {
            userRef = this.db.collection("UserBase").doc(this.state.email).get().then((doc) => {
                if (doc.data()) {
                    houseRef = this.db.collection("UserBase").doc(this.state.email).collection("house-tax");

                    houseRef.doc(this.state.houseno).set({
                        houseno: parseFloat(this.state.houseno),
                        Location: {
                            province: this.state.hprovince,
                            district: this.state.hdistrict,
                            municipality: this.state.hmunicipality,
                            ward: parseFloat(this.state.hward)

                        },
                        nostoreys: parseFloat(this.state.storey),
                        type: selected,
                        ['due date']: firebase.firestore.Timestamp.fromDate(new Date(this.state.dueDateHouse)),
                        taxAmount: parseFloat(this.state.taxAmountHouse)

                    }).then(() => { window.alert("updated successfully") }).catch((error) => { window.alert(error.message) });
                }
                else {
                    window.alert("User does not exist")
                }
            })
        }
        else {
            window.alert("User cannot be empty");
        }

    }
    writeIncomeDetails(e) {
        e.preventDefault();
        var userRef;
        var incomeRef;
        if (this.state.email) {
            userRef = this.db.collection("UserBase").doc(this.state.email).get().then((doc) => {
                if (doc.data()) {
                    incomeRef = this.db.collection("UserBase").doc(this.state.email).collection("income-tax");

                    incomeRef.doc(this.state.bn).set({
                        PAN: parseFloat(this.state.PAN),
                        ['business name']: this.state.bn,
                        ['type of employment']: this.state.employType,
                        ['annual income']: parseFloat(this.state.income),
                        taxAmount: parseFloat(this.state.taxAmountIncome),
                        ['due date']: firebase.firestore.Timestamp.fromDate(new Date(this.state.dueDateIncome))

                    }).then(() => { window.alert("updated successfully") }).catch((error) => { window.alert(error.message) });
                }
                else {
                    window.alert("User does not exist")
                }
            })
        }
        else {
            window.alert("User cannot be empty");
        }
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
                        <div className="form-row">
                            <div className="col-md-4 mb-3">
                                <label for="name">Name</label>
                                <input value={this.state.name} name="name" className="form-control" type="text" id="name" onChange={this.handleChange} placeholder="Name"></input>
                            </div>
                            <div className="col-md-4 mb-3">
                                <label for="citizenship">Citizenship Number</label>
                                <input value={this.state.citizenship_num} name="citizenship_num" className="form-control" id="citizenship" type="text" onChange={this.handleChange} placeholder="Citizenship Number"></input>
                            </div>
                            <div className="col-md-4 mb-3">
                                <label for="dateofbirth">Date of Birth</label>
                                <input value={this.state.dob} name="dob" type="date" id="dateofbirth" onChange={this.handleChange} className="form-control" placeholder="Date in AD"></input>
                            </div>


                            <button onClick={this.writeDetails} className='btn btn-primary'>Write</button>
                        </div>
                    </section>

                    <section>
                        <h2> Vehicle details here </h2>
                        <div className="form-group">
                            <label htmlFor="drop-vehicle" position="left">Vehicle Type</label>
                            <select id="drop-vehicle" className="custom-select">
                                <option> two-wheeler</option>
                                <option> four-wheeler</option>
                            </select>
                        </div>
                        <div className="form-group">
                            <label for="vrn">Vehicle Registration Number</label>
                            <input value={this.state.VRN} className="form-control upper" name="VRN" type="text" id="vrn" onChange={this.handleChangeVRN} placeholder="Eg: BA 2 CHA 0000"></input>
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
                        <h2>Land details</h2>
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
                            <div class="col-md-6 mb-3">
                                <label htmlFor="area">Area</label>
                                <input value={this.state.area} id="area" name="area" className="form-control" onChange={this.handleChange} placeholder="Area in sq. meters"></input>                            </div>
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
                    <section>
                        <h2> House details </h2>
                        <div className="form-row">
                            <div className="col-md-12 mb-3">
                                <label htmlFor="houseno">House number</label>
                                <input value={this.state.houseno} id="houseno" name="houseno" type="number" className="form-control" onChange={this.handleChange} placeholder="Eg: house number"></input>

                            </div>

                        </div>
                        <label htmlFor="inputHouseLocation">Enter Location</label>
                        <div class="form-row" id="inputHouseLocation">
                            <div class="col-md-3 mb-3">
                                <input value={this.state.hprovince} id="inputhprovince" name="hprovince" className="form-control" type="text" onChange={this.handleChange} placeholder=" Province"></input>
                            </div>
                            <div class="col-md-3 mb-3">
                                <input value={this.state.hdistrict} id="inputhdistrict" name="hdistrict" className="form-control" type="text" onChange={this.handleChange} placeholder=" District "></input>
                            </div>
                            <div class="col-md-3 mb-3">
                                <input value={this.state.hmunicipality} id="inputhmuni" name="hmunicipality" className="form-control" type="text" onChange={this.handleChange} placeholder=" Municipality"></input>
                            </div>
                            <div class="col-md-3 mb-3">
                                <input value={this.state.hward} id="inputhward" name="hward" type="number" className="form-control" min="1" onChange={this.handleChange} placeholder=" Ward"></input>
                            </div>
                        </div>
                        <div className="form-row">

                            <div class="col-md-6 mb-3">
                                <label htmlFor="storey">Number of Storeys</label>
                                <input value={this.state.storey} id="storey" name="storey" className="form-control" onChange={this.handleChange} placeholder="Eg: 4"></input>                            </div>

                            <div class="col-md-6 mb-3">
                                <label htmlFor="drop-house">Type of residence</label>
                                <select id="drop-house" className="custom-select">
                                    <option>Residential</option>
                                    <option>Rented</option>
                                </select>
                            </div>

                        </div>

                        <div className="form-row">
                            <div class="col-md-6 mb-3">
                                <label htmlFor="inputDate" position="left">Due date</label>
                                <input value={this.state.dueDateHouse} className="form-control" id="inputDateHouse" name="dueDateHouse" type="date" onChange={this.handleChange} placeholder="Eg: 12th March 2019"></input>
                            </div>
                            <div class="col-md-6 mb-3">
                                <label htmlFor="inputTax" position="left">Tax amount</label>
                                <input value={this.state.taxAmountHouse} className="form-control" id="inputTaxHouse" name="taxAmountHouse" type="number" min="0" onChange={this.handleChange} placeholder="Rs 5000"></input>

                            </div>
                            <button onClick={this.writeHouseDetails} className="btn btn-primary">Submit</button>
                        </div>

                    </section>

                    <section>
                        <h2> Income details </h2>
                        <div className="form-row">
                            <div class="col-md-3 mb-3">
                                <label htmlFor="inputpan">PAN</label>
                                <input value={this.state.PAN} id="inputpan" name="PAN" type="number" className="form-control" onChange={this.handleChange} placeholder="PAN"></input>
                            </div>
                            <div class="col-md-3 mb-3">
                                <label htmlFor="income"> Annual Income</label>
                                <input value={this.state.income} id="income" name="income" className="form-control" onChange={this.handleChange} placeholder="Eg: Rs 120000"></input>
                            </div>
                            <div class="col-md-6 mb-3">
                                <label htmlFor="employType"> Employment type</label>
                                <input value={this.state.employType} id="employType" name="employType" className="form-control" onChange={this.handleChange} placeholder="Eg: Business-person"></input>
                            </div>
                        </div>
                        <div className="form-row">
                            <div class="col-md-6 mb-3">
                                <label htmlFor="inputbn">Business name</label>
                                <input value={this.state.bn} id="inputbn" name="bn" className="form-control" onChange={this.handleChange} placeholder="Eg: ABC trading pvt ltd."></input>
                            </div>
                            <div class="col-md-3 mb-3">
                                <label htmlFor="dueDateIncome"> Due date</label>
                                <input value={this.state.dueDateIncome} type="date" id="dueDateIncome" name="dueDateIncome" className="form-control" onChange={this.handleChange} placeholder="Eg: 12th March 2020"></input>
                            </div>
                            <div class="col-md-3 mb-3">
                                <label htmlFor="taxAmount"> Tax amount</label>
                                <input value={this.state.taxAmountIncome} id="taxAmountIncome" name="taxAmountIncome" className="form-control" onChange={this.handleChange} placeholder="Eg: Rs 120000"></input>
                            </div>
                            <button onClick={this.writeIncomeDetails} className="btn btn-primary">Submit</button>
                        </div>

                    </section>
                </form>
            </div>
        )
    }
}
export default Precords;