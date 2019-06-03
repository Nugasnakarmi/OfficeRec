import React, { Component } from 'react';
import './detailscontent.css';
import fire from './config/fire';
import './detailscontent.css';
import firebase from 'firebase';
import adbs from 'ad-bs-converter';
import {
    Alert, Card, CardHeader, CardFooter, CardBody,
    CardTitle, CardText
} from 'reactstrap';
import { ButtonToolbar, Button, Modal } from 'react-bootstrap';

class House extends Component {
    constructor(props) {
        super(props);
        this.state = {
            houseNo: this.props.details ? this.props.details.houseno : '',
            editable: this.props.addNew ? true : false,
            hprovince: this.props.details ? this.props.details.Location.province : '',
            hdistrict: this.props.details ? this.props.details.Location.district : '',
            hmunicipality: this.props.details ? this.props.details.Location.municipality : '',
            hward: this.props.details ? this.props.details.Location.ward : '',
            dueDateHouse: this.props.details ? this.props.details['due date'] : '',
            warningStatus: 'inactive',
            category: this.props.details ? this.props.details.category : '0',
            propTax: this.props.details ? this.props.details.taxAmount : 0,
            sqft: this.props.details ? this.props.details.area : 0,
            storey: this.props.details ? this.props.details.nostoreys : 0,
            currentYear: "75-76",
            houseVal: this.props.details? this.props.details.houseVal : 0,
            toValuate: false,
            builtYear: this.props.details ? this.props.details.builtYear : 0,
            depreciation: this.props.details? this.props.details.depreciation : 0,
            depRate: this.props.details? this.props.details.depRate : 0,
            depPeriod: this.props.details? this.props.details.depPeriod : 0,
            toTax: false,
            visible: false,
            regDate: this.props.details ? this.props.details.regDate : '',
            lastDate: this.props.details ? this.props.details.lastDate : '',
            landVal: this.props.details? this.props.details.landVal : 0,
            show:false
        };
        this.db = fire.firestore();



        this.editButton = [<ButtonToolbar  ><Button variant="warning" onClick={this.edit}>Edit</Button>, <Button variant="warning" onClick={this.recordPayment}>Record Payment</Button>, <Button variant="danger" onClick={this.handleShow}>Delete</Button> </ButtonToolbar>]
        this.saveButton = [<ButtonToolbar><Button variant="success" onClick={this.save}>Save</Button>, <Button variant="light" onClick={this.cancel}>Cancel</Button></ButtonToolbar>]
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

    handleClose = () => {
        this.setState({ show: false });
    }

    handleShow = () => {
        this.setState({ show: true });
    }

    edit = (e) => {
        console.clear();
        console.log("Edit");
        e.preventDefault();
        this.setState({
            editable: true
        });
    }

    cancel = (e) => {
        e.preventDefault();
        this.setState(this.baseState);
        //this.renderForm();
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

    handleYearChange = (e) => {
        this.implementYear(e).then(this.getValuation);
    }

    handleSelectCategoryChange = (e) => {
        this.implementCategory(e).then(this.getValuation);
    }

    getValuationPrompt = (e) => {
        e.preventDefault();
        this.setState(
            {
                toValuate: true
            }
        );
    }
    getTaxPrompt = (e) => {
        e.preventDefault();
        this.getPropertyTax();
        this.setState(
            {
                toTax: true
            }
        );

    }

    getValuation = () => {
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
    onDismissValue = (e) => {
        this.setState({ toValuate: false });
    }
    onDismissTax = (e) => {
        this.setState({ toTax: false });
    }

    getPropertyTax = () => {
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

    save = (e) => {
        e.preventDefault();
        this.db.collection("UserBase").doc(this.props.user).get().then((doc) => {
            if (doc.data()) {
                let houseRef = this.db.collection("UserBase").doc(this.props.user).collection("house-tax");
                houseRef.doc(this.state.houseno).set({
                    houseno: parseFloat(this.state.houseno),
                    Location: {
                        province: this.state.hprovince,
                        district: this.state.hdistrict,
                        municipality: this.state.hmunicipality,
                        ward: parseFloat(this.state.hward)
                    },
                    nostoreys: parseFloat(this.state.storey),
                    type: this.state.category,
                    houseValuation: this.state.houseVal,
                    area: this.state.sqft,
                    ['due date']: this.state.dueDateHouse,
                    taxAmount: parseFloat(this.state.propTax),
                    builtYear: this.state.builtYear,
                    depRate: this.state.depRate,
                    depreciation: this.state.depreciation,
                    landVal: this.state.landVal,
                    depPeriod: this.state.depPeriod,
                    houseVal: this.state.houseVal
                    // coowner: this.state.coowner
                }).then(() => { window.alert("updated successfully") }).catch((error) => { window.alert(error.message) });
            }
            else {
                window.alert("User does not exist")
            }
        })
    }


    componentDidMount() {
        this.baseState = { ...this.state, loaded: true };
    }

    renderForm(isEditable) {
        return (
            <section>
                <div className="form-row">
                    <div className="col-md-12 mb-3">
                        <label htmlFor="houseno">House number</label>
                        <input disabled={isEditable ? "" : "disabled"} value={this.state.houseno} id="houseno" name="houseno" type="number" className="form-control" onChange={this.handleChange} placeholder="Eg: house number"></input>

                    </div>
                    <div className="form-row">
                        <div class="col-md-12 mb-3">

                            <label htmlFor="drop-cat">Category of House</label>
                            <select disabled={isEditable ? "" : "disabled"} value={this.state.category} id="drop-cat" className="custom-select" name="category" type='number' onChange={this.handleSelectCategoryChange}>
                                <option value="0">कः भित्र काँचो बाहिर पाको इट्टामा माटोको जोडाई भएको भवन र काठबाट बनेको भवन </option>
                                <option value="1">खः  भित्रबाहिर पाको इट्टा वा ढुंगा र माटोको जोडाई भएको सबै किसिमको भवन </option>
                                <option value="2">ग :  प्रिफायब भवन, गोदाम भवन </option>
                                <option value="3">घ :  भित्र बाहिर पाको इट्टा र सिमेन्टको जोडाई भएको भवन </option>
                                <option value="4">ङ :  स्टील स्ट्रक्चर (ट्रस) भवन </option>
                                <option value="5">च :  आर.सी.सी फ्रेम स्ट्रक्चर भवन </option>
                            </select>
                        </div>
                    </div>
                </div>
                <label htmlFor="inputHouseLocation">Enter Location</label>
                <div class="form-row" id="inputHouseLocation">
                    <div class="col-md-3 mb-3">
                        <input disabled={isEditable ? "" : "disabled"} value={this.state.hprovince} id="inputhprovince" name="hprovince" className="form-control" type="text" onChange={this.handleChange} placeholder=" Province"></input>
                    </div>
                    <div class="col-md-3 mb-3">
                        <input disabled={isEditable ? "" : "disabled"} value={this.state.hdistrict} id="inputhdistrict" name="hdistrict" className="form-control" type="text" onChange={this.handleChange} placeholder=" District "></input>
                    </div>
                    <div class="col-md-3 mb-3">
                        <input disabled={isEditable ? "" : "disabled"} value={this.state.hmunicipality} id="inputhmuni" name="hmunicipality" className="form-control" type="text" onChange={this.handleChange} placeholder=" Municipality"></input>
                    </div>
                    <div class="col-md-3 mb-3">
                        <input disabled={isEditable ? "" : "disabled"} value={this.state.hward} id="inputhward" name="hward" type="number" className="form-control" min="1" onChange={this.handleChange} placeholder=" Ward"></input>
                    </div>
                </div>
                <div className="form-row">

                    <div class="col-md-4 mb-3">
                        <label htmlFor="storey">Number of Storeys</label>
                        <input disabled={isEditable ? "" : "disabled"} value={this.state.storey} id="storey" name="storey" className="form-control" onChange={this.handleChangeVal} type="number" placeholder="Eg: 4"></input>
                    </div>

                    <div class="col-md-4 mb-3">
                        <label htmlFor="drop-house">No. of Square feets</label>
                        <input disabled={isEditable ? "" : "disabled"} value={this.state.sqft} id="sqft" name="sqft" type="number" className="form-control" onChange={this.handleChangeVal} placeholder="Eg: 600 "></input>
                    </div>
                    <div class="col-md-4 mb-3">
                        <label htmlFor="builtYear">Year built</label>
                        <input disabled={isEditable ? "" : "disabled"} value={this.state.builtYear} id="builtYear" name="builtYear" className="form-control" onChange={this.handleYearChange} type="number" min="1900" placeholder="Eg: 2050"></input>
                    </div>
                </div>
                <div className="form-row">
                <div class="col-md-6 mb-3">
                        <label htmlFor="regDate" position="left">Registered Date</label>
                        <input readOnly plaintext value={this.state.regDate} className="form-control-plaintext" id="regDate" name="regDate" type="text" onChange={this.handleChange} placeholder="YYYY/MM/DD"></input>
                    </div>
                    <div class="col-md-6 mb-3">
                        <label htmlFor="lastDate" position="left">Last Paid</label>
                        <input readOnly value={this.state.lastDate} className="form-control-plaintext" id="lastDate" name="lastDate" type="text" onChange={this.handleChange} placeholder="YYYY/MM/DD"></input>
                    </div>
                </div>
                <div class="col-md-4 mb-3">
                    <button disabled={isEditable ? "" : "disabled"} onClick={this.getValuationPrompt} className="btn btn-primary">Get Valuation</button>
                </div>
                <Alert className="alert" color="success" isOpen={this.state.toValuate} toggle={this.onDismissValue}>
                    <p><b>House Valuation </b>: Nrs.<font color="	#7CFC00"> {this.state.houseVal}</font><br></br>
                        <b>House Depreciation </b> : Nrs. <font color="	#FF0000">{this.state.depreciation}</font><br></br>
                        <b> Depreciation Rate </b> : {this.state.depRate}<br></br>
                        <b> Depreciation in </b> : {this.state.depPeriod} years <br></br>
                    </p>
                </Alert>



                <div className="form-row">
                    <div class="col-md-6 mb-3">
                        <label htmlFor="landval-house">भवन संरचना रहेको र संरचनाले ओगटेको थप जग्गाको मुल्याङकन</label>
                        <input disabled={isEditable ? "" : "disabled"} value={this.state.landVal} className="form-control" id="landval-house" name="landVal" type="number" min="0" onChange={this.handleChangelandVal}></input>
                    </div>
                    {/* <div class="col-md-6 mb-3">
                        <label htmlFor="drop-house">Type of residence</label>
                        <select id="drop-house" className="custom-select">
                            <option>Residential</option>
                            <option>Rented</option>
                        </select>
                    </div> */}


                    <p><b>Property Valuation</b> : Nrs. {this.state.houseVal + parseFloat(this.state.landVal)}</p>

                </div>

                <div class="col-md-4 mb-3">
                    <button disabled={isEditable ? "" : "disabled"} onClick={this.getTaxPrompt} className="btn btn-primary">Get Property Tax</button>
                </div>
                {/* {this.getPropertyTax()} */}
                <Alert className="alert" color="success" isOpen={this.state.toTax} toggle={this.onDismissTax}>

                    <p><b>Property Tax</b> : Nrs. {this.state.propTax}</p>
                </Alert>


                <div className="form-row">
                    <div class="col-md-6 mb-3">
                        <label htmlFor="inputDate" position="left">Due date</label>
                        <input readOnly plaintext value={this.state.dueDateHouse} className="form-control-plaintext" id="inputDate" name="dueDate" type="text" onChange={this.handleChange} placeholder="Eg: 12th March 2019"></input>
                        <h3>{this.state.date}</h3>
                    </div>
                    <div class="col-md-6 mb-3">
                        <label htmlFor="inputTax" position="left">Tax amount</label>
                        <input readOnly plaintext value={this.state.propTax} className="form-control-plaintext" id="inputTax" name="taxAmount" type="number" min="0" onChange={this.handleChange} placeholder="Rs 5000"></input>

                    </div>
                    {/* <div className="form-row">

                                <div class="col-md-12">
                                    <label htmlFor="coowner">Co-owner</label>
                                    <input value={this.state.coowner} id="coowner" name="coowner" className="form-control" onChange={this.handleChange} placeholder="Hira Kaji Shrestha"></input>                            </div>

                                

                            </div> */}
                </div>
            </section>
        );
    }

    render() {
        console.log("RENDER");
        return (
            <div>
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