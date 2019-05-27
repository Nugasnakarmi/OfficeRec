import React, { Component } from 'react';
import fire from './config/fire';
import firebase from 'firebase';

class EditHouse extends Component {
    constructor(props) {
        super(props);
        this.state = {

            email: '',
            warningStatus: 'inactive'
        };
        this.db = fire.firestore();

        this.handleChange = this.handleChange.bind(this);
        this.writeHouseDetails = this.writeHouseDetails.bind(this);


    }
    handleChange = e => this.setState({ [e.target.name]: e.target.value });

    handleChangeDate = e => this.setState({ [e.target.name]: e.target.date });

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
                        taxAmount: parseFloat(this.state.taxAmountHouse),
                        coowner: this.state.coowner
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
        if (!this.state.email) {
            this.setState({
                email: this.props.user
            })
        }
        return (
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
                        <h3>{this.state.date}</h3>
                    </div>
                    <div class="col-md-6 mb-3">
                        <label htmlFor="inputTax" position="left">Tax amount</label>
                        <input value={this.state.taxAmountHouse} className="form-control" id="inputTaxHouse" name="taxAmountHouse" type="number" min="0" onChange={this.handleChange} placeholder="Rs 5000"></input>

                    </div>
                    <div className="form-row">

                        <div class="col-md-12">
                            <label htmlFor="coowner">Co-owner</label>
                            <input value={this.state.coowner} id="coowner" name="coowner" className="form-control" onChange={this.handleChange} placeholder="Hira Kaji Shrestha"></input>                            </div>
                        
                        {/* <button onClick={} className="btn btn-primary">Search co-owner</button> */}

                    </div>
                    <button onClick={this.writeHouseDetails} className="btn btn-primary">Submit</button>




                </div>


            </section>

        )
    }
}

export default EditHouse;
