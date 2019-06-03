import React, { Component } from 'react';
import fire from './config/fire';
import firebase from 'firebase';
import adbs from 'ad-bs-converter';
import {
    Alert, Card, Button, CardHeader, CardFooter, CardBody,
    CardTitle, CardText
} from 'reactstrap';
import { Accordion } from 'react-bootstrap';

class EditHouse extends Component {
    constructor(props) {
        super(props);
        this.state = {
            email: '',
            warningStatus: 'inactive',
            category: '0',
            sqft: 0,
            storey: 0,
            currentYear: "75-76",
            houseVal: 0,
            propTax: 0,
            toValuate: false,
            builtYear: 0,
            depreciation: 0,
            depRate: 0,
            depPeriod: 0,
            toTax: false,
            visible: false
        };
        this.db = fire.firestore();

        this.handleChange = this.handleChange.bind(this);
        this.handleChangeVal = this.handleChangeVal.bind(this);
        this.handleChangelandVal = this.handleChangelandVal.bind(this);


        this.implementCategory = this.implementCategory.bind(this);
        this.handleSelectCategoryChange = this.handleSelectCategoryChange.bind(this);
        this.writeHouseDetails = this.writeHouseDetails.bind(this);
        this.getPropertyTax = this.getPropertyTax.bind(this);
        this.getValuation = this.getValuation.bind(this);
        this.getValuationPrompt = this.getValuationPrompt.bind(this);
        this.getTaxPrompt = this.getTaxPrompt.bind(this);
        this.handleYearChange = this.handleYearChange.bind(this);
        this.implementYear = this.implementYear.bind(this);
        this.onDismissValue = this.onDismissValue.bind(this);
        this.onDismissTax = this.onDismissTax.bind(this);
    }

    handleChange = e => this.setState({ [e.target.name]: e.target.value });
    handleChangeVal = e => {
        this.setState({ [e.target.name]: e.target.value });
        this.getValuation();
        // this.getPropertyTax();
    }
    handleChangelandVal = e => {
        this.setState({ [e.target.name]: e.target.value });

        this.getPropertyTax();
    }



    handleChangeDate = e => this.setState({ [e.target.name]: e.target.date });

    implementCategory = e => {
        return new Promise((resolve, reject) => {
            this.setState({ category: e.target.value });
            resolve(this.state.category);
        });

        //this.getValuation();
        // this.getPropertyTax();

    }
    implementYear = e => {
        return new Promise((resolve, reject) => {
            this.setState({ builtYear: e.target.value });
            resolve(this.state.builtYear);
        });

        //this.getValuation();
        // this.getPropertyTax();

    }

    handleYearChange(e) {
        this.implementYear(e).then(this.getValuation);
    }

    handleSelectCategoryChange(e) {
        this.implementCategory(e).then(this.getValuation);
    }

    getValuationPrompt(e) {
        e.preventDefault();
        this.setState(
            {
                toValuate: true
            }
        );
    }
    getTaxPrompt(e) {
        e.preventDefault();
        this.getPropertyTax();
        this.setState(
            {
                toTax: true
            }
        );

    }
    getValuation() {
        var valuation, depreciation, multiplier, category, builtYear, depYear, yearDiff;

        category = this.state.category;

        builtYear = this.state.builtYear;

        let today = new Date(); //todays date object

        let todayString = [today.getFullYear(), today.getMonth() + 1, today.getDate()].join('/');  //string of date delimited by /
        let todayBS = adbs.ad2bs(todayString);  //todays date in BS
        console.log("year in Bs today ", todayBS.en["year"]);
        yearDiff = todayBS.en["year"] - this.state.builtYear;
        console.log("The category is", category, "and built year is ", builtYear);
        console.log("year difference is ", yearDiff);


        // }
        this.db.collection("TaxRate").doc(this.state.currentYear).collection("PropertyValuation").doc("HouseVal").get().then((doc) => {
            if (doc.data()) {
                multiplier = doc.data()[parseFloat(category) + 1].val;// Valuation of House per Category
                console.log("multiplier for valuation is", multiplier)
                valuation = multiplier * this.state.sqft * this.state.storey;
                depYear = doc.data()[parseFloat(category) + 1].depYear// Years of depreciation for the building

                if (yearDiff < depYear) {  // verifying is building is not fully depreciated
                    depYear = yearDiff
                }

                depreciation = doc.data()[parseFloat(category) + 1].depRate * depYear * valuation;
                console.log("depreciation is ", depreciation, "with depreciation rate", doc.data()[parseFloat(category) + 1].depRate);

                valuation -= depreciation;
                this.setState(
                    {

                        houseVal: valuation,
                        depreciation: depreciation,
                        depRate: doc.data()[parseFloat(category) + 1].depRate,
                        depPeriod: depYear
                    }
                )

            }
        })

    }
    onDismissValue(e) {
        this.setState({ toValuate: false });
    }
    onDismissTax(e) {
        this.setState({ toTax: false });
    }
    getPropertyTax() {
        var totalVal = this.state.houseVal + parseFloat(this.state.landVal);
        var propertyTax = 0, x, crore = 10000000, percent = 0.01, multiplier = 1;
        this.db.collection("TaxRate").doc(this.state.currentYear).collection("PropertyTax").doc("totalVal").get().then((doc) => {
            var PropValArr = new Array();
            var cal = totalVal;
            PropValArr = doc.data();
            if (PropValArr) {
                for (x in PropValArr) {// ALGORITHM FOR CALCULATING TAX FROM PROPERTY VALUATION
                    // console.log("step:", x, PropValArr[x], "cal:", cal)
                    // console.log(propertyTax)
                    if (x > 6) { // FROM 6 CRORES THE LEVEL IS 2 CRORES , FROM 10 CR0RES THERE IS NO LEVEL
                        if ((cal <= 2 * crore) || (x == 11)) {
                            propertyTax += PropValArr[x] * percent * cal
                            cal -= cal;
                            console.log("x 11 here");
                        }
                        else {
                            propertyTax += PropValArr[x] * percent * 2 * crore;
                            cal -= 2 * crore;
                        }
                    }
                    else if (cal <= crore) {
                        propertyTax += PropValArr[x] * percent * cal
                        break;
                    }
                    else {

                        propertyTax += PropValArr[x] * percent * crore
                        cal -= crore;

                    }
                }
            }


            console.log("tax :", propertyTax)
            this.setState(
                {
                    propTax: propertyTax,

                }
            )
        }


        )

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
                        houseValuation: this.state.houseVal,
                        ['due date']: firebase.firestore.Timestamp.fromDate(new Date(this.state.dueDateHouse)),
                        taxAmount: parseFloat(this.state.propTax),
                        // coowner: this.state.coowner
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
            console.log("INSIDE RENDER, CATEGORY", this.state.category);
        }
        return (<Accordion defaultActiveKey="0">
            {this.state.loaded ? (this.displayText) : 'Loading'}
        </Accordion>
        )
    }
}

export default EditHouse;
