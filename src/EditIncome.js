import React, { Component } from 'react';
import fire from './config/fire';
import firebase from 'firebase';


class EditIncome extends Component {
    constructor(props) {
        super(props);
        this.state = {

            email: '',
            warningStatus: 'inactive'
        };
        this.db = fire.firestore();

        this.handleChange = this.handleChange.bind(this);
        this.writeIncomeDetails = this.writeIncomeDetails.bind(this);


    }
    handleChange = e => this.setState({ [e.target.name]: e.target.value });
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
        if (!this.state.email) {
            this.setState({
                email: this.props.user
            })
        }
        var adbs = require("ad-bs-converter");

        let nepdate= adbs.ad2bs("1990/8/10");
        console.log(nepdate);
        let engdate = adbs.bs2ad("2047/4/26");
        console.log(engdate['month']);
        return (
            <section>
                <h2> Income details </h2>
                <div className="form-row">
                    <div class="col-md-3 mb-3">
                        <label htmlFor="inputpan">PAN</label>
                        <input value={this.state.PAN} id="inputpan" name="PAN" type="number" className="form-control" onChange={this.handleChange} placeholder="PAN"></input>
                    </div>
                    <div class="col-md-3 mb-3">
                        <label htmlFor="income"> Annual Income</label>
                        <input value={this.state.income} id="income" name="income" type="number" className="form-control" onChange={this.handleChange} placeholder="Eg: Rs 120000"></input>
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

        )
    }
}

export default EditIncome;
