import React, { Component } from 'react';
import fire from './config/fire';
import firebase from 'firebase';


class EditLand extends Component {
    constructor(props) {
        super(props);
        this.state = {

            email: '',
            warningStatus: 'inactive'
        };
        this.db = fire.firestore();

        this.handleChange = this.handleChange.bind(this);
        this.writeLandDetails = this.writeLandDetails.bind(this);


    }
    handleChange = e => this.setState({ [e.target.name]: e.target.value });
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

    render() {
        if (!this.state.email) {
            this.setState({
                email: this.props.user
            })
        }
        return (
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
        )
    }
}

export default EditLand;
