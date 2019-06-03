import React, { Component } from 'react';
import './detailscontent.css';
import fixDate from './FixDate';
import house from './res/house.png';
import fire from './config/fire';
import adbs from 'ad-bs-converter';
import './detailscontent.css';
import firebase from 'firebase';
import { Form, Row, Col, Button, ButtonToolbar, Modal } from 'react-bootstrap';
import { Alert, Card, CardHeader, CardBody, CardFooter } from 'reactstrap';


class House extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loaded: false,
            editable: this.props.addNew ? true : false,
            province: this.props.details ? this.props.details.Location.province : '',
            district: this.props.details ? this.props.details.Location.district : '',
            municipality: this.props.details ? this.props.details.Location.municipality : '',
            ward: this.props.details ? this.props.details.Location.ward : '',
            houseno: this.props.details ? this.props.details.houseno : '',
            builtYear: this.props.details ? this.props.details.builtYear : '',
            nostoreys: this.props.details ? this.props.details.nostoreys : '',
            taxAmount: this.props.details ? this.props.details.taxAmount : '',
            dueDateHouse: this.props.details ? this.props.details['due date'] : '',
            regDate: this.props.details ? this.props.details.regDate : '',
            lastDate: this.props.details ? this.props.details.lastDate : '',


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
            visible: false,

            updated: false
        }
        this.displayText = [];

        this.edit = this.edit.bind(this);
        this.cancel = this.cancel.bind(this);
        this.renderForm = this.renderForm.bind(this);
        this.save = this.save.bind(this);
        this.delete = this.delete.bind(this);
        this.recordPayment = this.recordPayment.bind(this);
        this.handleShow = this.handleShow.bind(this);
        this.handleClose = this.handleClose.bind(this);

        this.handleChange = this.handleChange.bind(this);
        this.handleChangeVal = this.handleChangeVal.bind(this);
        this.handleChangelandVal = this.handleChangelandVal.bind(this);


        this.implementCategory = this.implementCategory.bind(this);
        this.handleSelectCategoryChange = this.handleSelectCategoryChange.bind(this);
        // this.writeHouseDetails = this.writeHouseDetails.bind(this);
        this.getPropertyTax = this.getPropertyTax.bind(this);
        this.getValuation = this.getValuation.bind(this);
        this.getValuationPrompt = this.getValuationPrompt.bind(this);
        this.getTaxPrompt = this.getTaxPrompt.bind(this);
        this.handleYearChange = this.handleYearChange.bind(this);
        this.implementYear = this.implementYear.bind(this);


        this.onDismissValue = this.onDismissValue.bind(this);
        this.onDismissTax = this.onDismissTax.bind(this);

        this.editButton = [<ButtonToolbar  ><Button variant="warning" onClick={this.edit}>Edit</Button>, <Button variant="warning" onClick={this.recordPayment}>Record Payment</Button>, <Button variant="danger" onClick={this.handleShow}>Delete</Button> </ButtonToolbar>]
        this.saveButton = [<ButtonToolbar><Button variant="success" onClick={this.save}>Save</Button>, <Button variant="light" onClick={this.cancel}>Cancel</Button></ButtonToolbar>]

        this.db = fire.firestore();
    }

    handleClose() {
        this.setState({ show: false });
    }

    handleShow() {
        this.setState({ show: true });
    }

    handleChange = e => {
        this.setState({ [e.target.name]: e.target.value });
    }

    recordPayment(e) {
        e.preventDefault();
        let today = new Date(); //todays date object
        let todayString = [today.getFullYear(), today.getMonth() + 1, today.getDate()].join('/');  //string of date delimited by /
        let todayBS = adbs.ad2bs(todayString);  //todays date in BS
        this.setState({
            lastDate: [todayBS.en.year, todayBS.en.month, todayBS.en.day].join('/')
            //also set a new due date
        });
        this.db.collection("UserBase").doc(this.props.user).collection("house-tax").doc(this.props.details.id).set({
            //['due date']: this.state.dueDateLand,
            lastDate: this.state.lastDate
        }).then(() => {
            window.alert("Success!");
            this.props.refresh();
        }).catch((error) => {
            window.alert("Error: ", error);
        });
    }
    edit(e) {
        console.clear();
        console.log("Edit");
        e.preventDefault();
        this.setState({
            editable: true
        });
    }

    cancel(e) {
        e.preventDefault();
        this.setState(this.baseState);
        //thirenderForm();
    }

    save(e) {
        e.preventDefault();
        let writeID = this.props.addNew ? (this.props.maxID + 1).toString() : this.props.details.id;
        console.log("WriteID", writeID);
        this.db.collection("UserBase").doc(this.props.user).collection("house-tax").doc(writeID).set({
            houseno: parseFloat(this.state.houseno),
            Location: {
                province: this.state.hprovince,
                district: this.state.hdistrict,
                municipality: this.state.hmunicipality,
                ward: parseFloat(this.state.hward)

            },

            nostoreys: parseFloat(this.state.storey),

            taxAmount: parseFloat(this.state.taxAmountHouse),
            builtYear: this.state.builtYear,

            regDate: this.state.regDate,
            lastDate: this.state.lastDate,
            houseValuation: this.state.houseVal,

            ['due date']: (this.state.dueDateHouse),
            taxAmount: parseFloat(this.state.propTax),
        }).then(() => {
            window.alert("Success!");
            this.props.refresh();
        }).catch((error) => {
            window.alert("Error: ", error);
        });
    }

    delete(e) {
        e.preventDefault();
        if (this.state.inputID === this.props.user) {
            this.db.collection("UserBase").doc(this.props.user).collection("house-tax").doc(this.props.details.id).delete().then(() => {
                window.alert("Success!");
                this.handleClose();
                this.props.refresh();
            }).catch((error) => {
                window.alert("Error: ", error);
            });
        }
        else {
            window.alert("Wrong information!");
        }
    }
    onDismissValue(e) {
        this.setState({ toValuate: false });
    }
    onDismissTax(e) {
        this.setState({ toTax: false });
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
                        depreciation: depreciation.toFixed(2),
                        depRate: doc.data()[parseFloat(category) + 1].depRate,
                        depPeriod: depYear
                    }
                )

            }
        })

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
    componentDidMount() {
        this.baseState = { ...this.state, loaded: true };
    }
    writeHouseDetails(e) {//NOT NEEDED AS SAVE METHOD IS INTRODUCED
        e.preventDefault();
        var userRef;
        var houseRef;
        // var droplist = document.getElementById("drop-house")
        // var selected = droplist.options[droplist.selectedIndex].value;
        // console.log(selected);
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
                        // type: selected,
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

    renderForm(isEditable) {
        return (

            <section>

                <div className="form-row">
                    <div className="col-md-12 mb-3">
                        <label htmlFor="houseno">House number</label>
                        <input disabled={this.state.editable ? "" : "disabled"} value={this.state.houseno} id="houseno" name="houseno" type="number" className="form-control" onChange={this.handleChange} placeholder="Eg: house number"></input>

                    </div>

                </div>
                <label htmlFor="inputHouseLocation">Enter Location</label>
                <div class="form-row" id="inputHouseLocation">
                    <div class="col-md-3 mb-3">
                        <input disabled={this.state.editable ? "" : "disabled"} value={this.state.hprovince} id="inputhprovince" name="hprovince" className="form-control" type="text" onChange={this.handleChange} placeholder=" Province"></input>
                    </div>
                    <div class="col-md-3 mb-3">
                        <input disabled={this.state.editable ? "" : "disabled"} value={this.state.hdistrict} id="inputhdistrict" name="hdistrict" className="form-control" type="text" onChange={this.handleChange} placeholder=" District "></input>
                    </div>
                    <div class="col-md-3 mb-3">
                        <input disabled={this.state.editable ? "" : "disabled"} value={this.state.hmunicipality} id="inputhmuni" name="hmunicipality" className="form-control" type="text" onChange={this.handleChange} placeholder=" Municipality"></input>
                    </div>
                    <div class="col-md-3 mb-3">
                        <input disabled={this.state.editable ? "" : "disabled"} value={this.state.hward} id="inputhward" name="hward" type="number" className="form-control" min="1" onChange={this.handleChange} placeholder=" Ward"></input>
                    </div>
                </div>
                <div className="form-row">

                    <div class="col-md-4 mb-3">
                        <label htmlFor="storey">Number of Storeys</label>
                        <input disabled={this.state.editable ? "" : "disabled"} value={this.state.storey} id="storey" name="storey" className="form-control" onChange={this.handleChangeVal} type="number" placeholder="Eg: 4"></input>
                    </div>

                    <div class="col-md-4 mb-3">
                        <label htmlFor="sqft">No. of Square feets</label>
                        <input disabled={this.state.editable ? "" : "disabled"} value={this.state.sqft} id="sqft" name="sqft" type="number" className="form-control" onChange={this.handleChangeVal} placeholder="Eg: 600 "></input>
                    </div>
                    <div class="col-md-4 mb-3">
                        <label htmlFor="builtYear">Year built</label>
                        <input disabled={this.state.editable ? "" : "disabled"} value={this.state.builtYear} id="builtYear" name="builtYear" className="form-control" onChange={this.handleYearChange} type="number" min="1900" placeholder="Eg: 2050"></input>
                    </div>




                </div>
                <div className="form-row">
                    <div class="col-md-12 mb-3">

                        <label htmlFor="drop-cat">Category of House</label>
                        <select disabled={this.state.editable ? "" : "disabled"} value={this.state.category} id="drop-cat" className="custom-select" name="category" type='number' onChange={this.handleSelectCategoryChange}>
                            <option value="0">कः भित्र काँचो बाहिर पाको इट्टामा माटोको जोडाई भएको भवन र काठबाट बनेको भवन </option>
                            <option value="1">खः  भित्रबाहिर पाको इट्टा वा ढुंगा र माटोको जोडाई भएको सबै किसिमको भवन </option>
                            <option value="2">ग :  प्रिफायब भवन, गोदाम भवन </option>
                            <option value="3">घ :  भित्र बाहिर पाको इट्टा र सिमेन्टको जोडाई भएको भवन </option>
                            <option value="4">ङ :  स्टील स्ट्रक्चर (ट्रस) भवन </option>
                            <option value="5">च :  आर.सी.सी फ्रेम स्ट्रक्चर भवन </option>




                        </select>
                    </div>


                </div>

                <button disabled={this.state.editable ? "" : "disabled"} onClick={this.getValuationPrompt} style={{ position: "left" }} className="btn btn-primary">Get Valuation</button>

                <Alert className="alert" color="success" isOpen={this.state.toValuate} toggle={this.onDismissValue}>
                    <p><b>House Valuation </b>: Nrs. {this.state.houseVal.toFixed(2)}<br></br>
                        <b>House Depreciation </b> : Nrs. {this.state.depreciation}<br></br>
                        <b> Depreciation Rate </b> : {this.state.depRate}<br></br>
                        <b> Depreciation in </b> : {this.state.depPeriod} years <br></br>
                    </p>
                </Alert>



                <div className="form-row">
                    <div class="col-md-6 mb-3">
                        <label htmlFor="landval-house">भवन संरचना रहेको र संरचनाले ओगटेको थप जग्गाको मुल्याङकन</label>
                        <input disabled={this.state.editable ? "" : "disabled"} value={this.state.landVal} className="form-control" id="landval-house" name="landVal" type="number" min="0" onChange={this.handleChangelandVal}></input>
                    </div>
                    {/* <div class="col-md-6 mb-3">
                    <label htmlFor="drop-house">Type of residence</label>
                    <select id="drop-house" className="custom-select">
                        <option>Residential</option>
                        <option>Rented</option>
                    </select>
                </div> */}


                    <p><b>Property Valuation</b> : Nrs. {(this.state.houseVal + this.state.landVal)}</p>

                </div>


                <button disabled={this.state.editable ? "" : "disabled"} onClick={this.getTaxPrompt} className="btn btn-primary">Get Property Tax</button>

                {/* {this.getPropertyTax()} */}
                <Alert className="alert" color="success" isOpen={this.state.toTax} toggle={this.onDismissTax}>

                    <p><b>Property Tax</b> : Nrs. {this.state.propTax}</p>
                </Alert>

                <div className="form-row">
                    <div class="col-md-6 mb-3">
                        <label htmlFor="inputDate" position="left">Due date</label>
                        <input disabled={this.props.addNew ? "" : "disabled"} value={this.state.dueDateHouse} className="form-control" id="inputDateHouse" name="dueDateHouse" type="string" onChange={this.handleChange} placeholder="YYYY/MM/DD"></input>
                        <h3>{this.state.date}</h3>
                    </div>
                    <div class="col-md-6 mb-3">
                        <label htmlFor="lastDate" position="left">Last Paid</label>
                        <input disabled={this.state.editable ? "" : "disabled"} value={this.state.lastDate} className="form-control" id="lastDate" name="lastDate" type="string" onChange={this.handleChange} placeholder="YYYY/MM/DD"></input>

                    </div>
                    {/* <div className="form-row">

                            <div class="col-md-12">
                                <label htmlFor="coowner">Co-owner</label>
                                <input value={this.state.coowner} id="coowner" name="coowner" className="form-control" onChange={this.handleChange} placeholder="Hira Kaji Shrestha"></input>                            </div>

                            

                        </div> */}
                    {/* <button disabled={this.state.editable ? "" : "disabled"} onClick={this.writeHouseDetails} className="btn btn-primary">Submit</button> */}




                </div>
               


            </section>

        )
    }
    render() {
        console.log("RENDER");
        return (
            <div align="center">

                <Card className="popupCards">
                    <CardHeader style={{ backgroundColor: "#2D93AD", color: "aliceblue" }} tag="h4"> Property details </CardHeader>


                    <CardBody>
                        {this.renderForm(this.state.editable)}

                        {this.props.isAdmin ? this.state.editable ? this.saveButton : this.editButton : null}

                    </CardBody>
                </Card>
                <Modal show={this.state.show} onHide={this.handleClose}>
                    <Modal.Header closeButton>
                        <Modal.Title>Confirm Delete</Modal.Title>
                    </Modal.Header>

                    <Modal.Body>
                        <p>Enter the user ID.</p>
                        <input value={this.state.inputID} name="inputID" className="form-control" onChange={this.handleChange}></input>
                    </Modal.Body>

                    <Modal.Footer>
                        <Button variant="secondary" onClick={this.handleClose}>Close</Button>
                        <Button variant="primary" onClick={this.delete}>Proceed</Button>
                    </Modal.Footer>
                </Modal>
            </div>
        );
    }
}

export default House;