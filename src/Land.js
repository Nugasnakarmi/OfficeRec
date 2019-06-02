import React, { Component } from 'react';
import './detailscontent.css';
import fixDate from './FixDate';
import land from './res/land.png';
import { Form, Row, Col, Button, ButtonToolbar, Modal } from 'react-bootstrap';
import fire from './config/fire';
import firebase from 'firebase';
import adbs from 'ad-bs-converter';

class Land extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loaded: false,
            editable: this.props.addNew ? true : false,
            province: this.props.details ? this.props.details.Location.province : '',
            district: this.props.details ? this.props.details.Location.district : '',
            municipality: this.props.details ? this.props.details.Location.municipality : '',
            ward: this.props.details ? this.props.details.Location.ward : '',
            area: this.props.details ? this.props.details.area : '',
            kittaId: this.props.details ? this.props.details.kittaId : '',
            taxAmount: this.props.details ? this.props.details.taxAmount : '',
            dueDateLand: this.props.details ? this.props.details['due date'] : '',
            regDate: this.props.details ? this.props.details.regDate : '',
            lastDate: this.props.details ? this.props.details.lastDate : '',
            warningStatus: 'inactive',
            landCat: this.props.details ? this.props.details.landCat : '',
            currentYear: "75-76",
            taxVisible: false,
            taxAmountLand: this.props.details ? this.props.details.taxAmount : '',
            Aana: 31.79,
            taxRate: 0,
            inputID: '',
            show: false
        }
        // this.fields = {
        //     'Province': this.props.details.Location.province,
        //     'District': this.props.details.Location.district,
        //     'Municipality': this.props.details.Location.municipality,
        //     'Ward Number': this.props.details.Location.ward,
        //     'Area': this.props.details.area,
        //     'कित्ता': this.props.details.kittaId,
        //     'Tax Amount': this.props.details.taxAmount,
        //     'Due': fixDate(this.props.details['due date'])
        // }
        this.displayText = [];

        this.edit = this.edit.bind(this);
        this.cancel = this.cancel.bind(this);
        this.renderForm = this.renderForm.bind(this);
        this.handleSelectChange = this.handleSelectChange.bind(this);
        this.handleChange = this.handleChange.bind(this);
        //this.writeLandDetails = this.writeLandDetails.bind(this);
        this.implementCategory = this.implementCategory.bind(this);
        this.getlandTax = this.getlandTax.bind(this);
        this.handleAreaChange = this.handleAreaChange.bind(this);
        this.showLandTax = this.showLandTax.bind(this);
        this.save = this.save.bind(this);
        this.delete = this.delete.bind(this);
        this.recordPayment = this.recordPayment.bind(this);
        this.handleShow = this.handleShow.bind(this);
        this.handleClose = this.handleClose.bind(this);

        this.editButton = [<ButtonToolbar><Button variant="warning" onClick={this.edit}>Edit</Button>, <Button variant="warning" onClick={this.recordPayment}>Record Payment</Button>, <Button variant="danger" onClick={this.handleShow}>Delete</Button> </ButtonToolbar>]
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

    handleAreaChange = e => {
        this.setState({ [e.target.name]: e.target.value });

    }

    implementCategory = e => {
        return new Promise((resolve, reject) => {
            this.setState({ landCat: e.target.value });
            resolve(this.state.landCat);
        });
    }

    handleSelectChange(e) {
        this.implementCategory(e).then(this.getlandTax);
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
        this.db.collection("UserBase").doc(this.props.user).collection("land-tax").doc(this.props.details.id).set({
            //['due date']: this.state.dueDateLand,
            lastDate: this.state.lastDate
        }).then(() => {
            window.alert("Success!");
            this.props.refresh();
        }).catch((error) => {
            window.alert("Error: ", error);
        });
    }

    getlandTax() {
        // e.preventDefault();
        var landTax = 0, taxRate = 0, category; // 1 Aana = 31.79 sq m

        category = this.state.landCat;
        console.log("land category :", category)

        var rateArr = new Array();

        this.db.collection("TaxRate").doc(this.state.currentYear).collection("LandTax").doc("CategoryTax").get().then((doc) => {
            if (doc.data()) {
                rateArr = doc.data();
                taxRate = rateArr["landRate"][category]
                // rateArr is an array of arrays!!!!! SO BE WARY
                console.log("rate", rateArr["landRate"])
                landTax = (taxRate * this.state.area / this.state.Aana).toFixed(2);
                console.log("Tax amount for land", landTax)
                this.setState(
                    {
                        taxAmountLand: landTax,
                        taxRate: taxRate
                    }
                );
            }
        });
    }

    showLandTax(e) {
        e.preventDefault();
        this.getlandTax();
        this.setState({ taxVisible: true })
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
        //this.renderForm();
    }

    save(e) {
        e.preventDefault();
        let writeID = this.props.addNew ? (this.props.maxID+1).toString() : this.props.details.id;
        console.log("WriteID", writeID);
        this.db.collection("UserBase").doc(this.props.user).collection("land-tax").doc(writeID).set({
            Location: {
                province: this.state.province,
                district: this.state.district,
                municipality: this.state.municipality,
                ward: parseFloat(this.state.ward)
            },
            kittaId: parseFloat(this.state.kittaId),
            category: parseFloat(this.state.landCat),
            taxAmount: parseFloat(this.state.taxAmountLand),
            area: parseFloat(this.state.area),
            ['due date']: this.state.dueDateLand,
            regDate: this.state.regDate,
            lastDate: this.state.lastDate
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
            this.db.collection("UserBase").doc(this.props.user).collection("land-tax").doc(this.props.details.id).delete().then(() => {
                window.alert("Success!");
                this.handleClose();
                this.props.refresh();
            }).catch((error) => {
                window.alert("Error: ", error);
            });
        }
        else{
            window.alert("Wrong information!");
        }
    }

    // renderForm() {
    //     let key;
    //     this.displayText = [];
    //     for (key in this.fields) {
    //         this.displayText.push(
    //             <Form.Group as={Row} controlId="formPlaintextEmail">
    //                 <Form.Label column sm="3">
    //                     <b>{key}</b>
    //                 </Form.Label>
    //                 <Col sm="9">
    //                     {this.state.editable ? <Form.Control defaultValue={this.fields[key]} />
    //                         : <Form.Control plaintext readOnly defaultValue={this.fields[key]} />}
    //                 </Col>
    //             </Form.Group>
    //         );
    //     }
    //     console.log(this.state);
    // }

    renderForm(isEditable) {
        if (isEditable) {
            return (
                <section>
                    <label htmlFor="inputLocation">Provice/District/Municipality</label>
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
                        <div class="col-md-3 mb-3">
                            <label htmlFor="inputkitta"><i>Kitta Number</i></label>
                            <input value={this.state.kittaId} id="inputkitta" name="kittaId" className="form-control" onChange={this.handleChange} placeholder="कित्ता नम्बर"></input>
                        </div>
                        <div class="col-md-3 mb-3">
                            <label htmlFor="landCat"><i>जग्गा वर्ग</i></label>
                            <select value={this.state.landCat} id="landCat" name="landCat" className="custom-select" type="number" onChange={this.handleSelectChange} >
                                <option value="1"> क</option>
                                <option value="2"> ख</option>
                                <option value="3"> ग</option>
                                <option value="4"> घ</option>
                                <option value="5"> ङ</option>
                                <option value="6"> च</option>
                                <option value="7"> वर्ग नखुलेको</option>

                            </select>
                        </div>
                        <div class="col-md-6 mb-3">
                            <label htmlFor="area">Area</label>
                            <input value={this.state.area} id="area" name="area" type="number" className="form-control" onChange={this.handleAreaChange} placeholder="Area in sq. meters"></input>                            </div>
                    </div>
                    <button onClick={this.showLandTax} className="btn btn-primary">Get Land Tax</button>
                    <div className="form-row">
                        {console.log(this.state.taxAmountLand)}

                        {this.state.taxVisible ? <div class="col-md-12 mb-3">
                            <p>
                                <b> भुमी कर</b> : Nrs. {this.state.taxAmountLand}<br />
                                <b>  No. of Aanas </b> : {(this.state.area / this.state.Aana).toFixed(2)}<br />
                                <b>  Rate per आना </b> : Nrs. {this.state.taxRate}
                            </p> </div> : null}


                        <div class="col-md-4 mb-3">
                            <label htmlFor="regDate" position="left">Registered Date</label>
                            <input value={this.state.regDate} className="form-control" id="regDate" name="regDate" type="text" onChange={this.handleChange} placeholder="YYYY/MM/DD"></input>
                        </div>
                        <div class="col-md-4 mb-3">
                            <label htmlFor="lastDate" position="left">Last Paid</label>
                            <input value={this.state.lastDate} className="form-control" id="lastDate" name="lastDate" type="text" onChange={this.handleChange} placeholder="YYYY/MM/DD"></input>
                        </div>
                        <div class="col-md-4 mb-3">
                            <label htmlFor="dueDate" position="left">Due Date</label>
                            {this.props.addNew ? <input value={this.state.dueDateLand} className="form-control" id="dueDate" name="dueDateLand" type="text" onChange={this.handleChange} placeholder="YYYY/MM/DD"></input> : <input disabled value={this.state.dueDateLand} className="form-control" id="dueDate" name="dueDateLand" type="text" onChange={this.handleChange} placeholder="YYYY/MM/DD"></input>}
                        </div>
                        {/* <button onClick={this.writeLandDetails} className="btn btn-primary">Submit</button> */}
                    </div>
                </section>
            );
        }
        else {
            return (
                <section>
                    <label htmlFor="inputLocation">Province/District/Municipality</label>
                    <div class="form-row" id="inputLocation">
                        <div class="col-md-3 mb-3">
                            <input disabled value={this.state.province} id="inputprovince" name="province" className="form-control" type="text" onChange={this.handleChange} placeholder=" Province"></input>
                        </div>
                        <div class="col-md-3 mb-3">
                            <input disabled value={this.state.district} id="inputdistrict" name="district" className="form-control" type="text" onChange={this.handleChange} placeholder=" District "></input>
                        </div>
                        <div class="col-md-3 mb-3">
                            <input disabled value={this.state.municipality} id="inputmuni" name="municipality" className="form-control" type="text" onChange={this.handleChange} placeholder=" Municipality"></input>
                        </div>
                        <div class="col-md-3 mb-3">
                            <input disabled value={this.state.ward} id="inputward" name="ward" type="number" className="form-control" min="1" onChange={this.handleChange} placeholder=" Ward"></input>
                        </div>
                    </div>
                    <div className="form-row">
                        <div class="col-md-3 mb-3">
                            <label htmlFor="inputkitta"><i>Kitta Number</i></label>
                            <input disabled value={this.state.kittaId} id="inputkitta" name="kittaId" className="form-control" onChange={this.handleChange} placeholder="कित्ता नम्बर"></input>
                        </div>
                        <div class="col-md-3 mb-3">
                            <label htmlFor="landCat"><i>जग्गा वर्ग</i></label>
                            <select disabled value={this.state.landCat} id="landCat" name="landCat" className="custom-select" type="number" onChange={this.handleSelectChange} >
                                <option value="1"> क</option>
                                <option value="2"> ख</option>
                                <option value="3"> ग</option>
                                <option value="4"> घ</option>
                                <option value="5"> ङ</option>
                                <option value="6"> च</option>
                                <option value="7"> वर्ग नखुलेको</option>

                            </select>
                        </div>
                        <div class="col-md-6 mb-3">
                            <label htmlFor="area">Area</label>
                            <input disabled value={this.state.area} id="area" name="area" type="number" className="form-control" onChange={this.handleAreaChange} placeholder="Area in sq. meters"></input>                            </div>
                    </div>
                    <button disabled onClick={this.showLandTax} className="btn btn-primary">Get Land Tax</button>
                    <div className="form-row">
                        {console.log(this.state.taxAmountLand)}

                        {this.state.taxVisible ? <div class="col-md-12 mb-3">
                            <p>
                                <b> भुमी कर</b> : Nrs. {this.state.taxAmountLand}<br />
                                <b>  No. of Aanas </b> : {(this.state.area / this.state.Aana).toFixed(2)}<br />
                                <b>  Rate per आना </b> : Nrs. {this.state.taxRate}
                            </p> </div> : null}

                        <div class="col-md-4 mb-3">
                            <label htmlFor="regDate" position="left">Registered Date</label>
                            <input disabled value={this.state.regDate} className="form-control" id="regDate" name="regDate" type="text" onChange={this.handleChange} placeholder="YYYY/MM/DD"></input>
                        </div>
                        <div class="col-md-4 mb-3">
                            <label htmlFor="lastDate" position="left">Last Paid</label>
                            <input disabled value={this.state.lastDate} className="form-control" id="lastDate" name="lastDate" type="text" onChange={this.handleChange} placeholder="YYYY/MM/DD"></input>
                        </div>
                        <div class="col-md-4 mb-3">
                            <label htmlFor="dueDate" position="left">Due Date</label>
                            <input disabled value={this.state.dueDateLand} className="form-control" id="dueDate" name="dueDateLand" type="text" onChange={this.handleChange} placeholder="YYYY/MM/DD"></input>
                        </div>
                        {/* <button disabled onClick={this.writeLandDetails} className="btn btn-primary">Submit</button> */}
                    </div>
                </section>
            );
        }
    }

    componentDidMount() {
        this.baseState = { ...this.state, loaded: true };
    }

    render() {
        return (
            // <div className="item-box">
            <div>
                {/* <h3>Land at {this.props.details.Location.municipality} Kitta {this.props.details.kittaId}</h3>
                <div className="row">
                    <div className="location col-6">
                        <p className='content-para location-heading'>Location</p>
                        <p className='content-para'>Province: {this.props.details.Location.province}</p>
                        <p className='content-para'>District: {this.props.details.Location.district}</p>
                        <p className='content-para'>Municipality: {this.props.details.Location.municipality}</p>
                        <p className='content-para'>Ward Number: {this.props.details.Location.ward}</p>
                    </div>
                    <div className="col-6 logodiv">
                        <img className="logo" src={land}></img>
                    </div>
                    <div className="col-6">
                        <p className='content-para'>Area: {this.props.details.area} sq. meter</p>
                        <p className='content-para'>कित्ता: {this.props.details.kittaId}</p>
                    </div>
                    <div className="col-6">
                        <p className='content-para'>Tax Amount: NRs. {this.props.details.taxAmount}</p>
                        <p className='content-para'>Due: {fixDate(this.props.details['due date'])}</p>
                    </div>
                </div> */}
                {/* {this.displayText} */}

                {this.renderForm(this.state.editable)}

                {this.props.isAdmin ? this.state.editable ? this.saveButton : this.editButton : null}
                <Modal show={this.state.show} onHide={this.handleClose}>
                    <Modal.Header closeButton>
                        <Modal.Title>Modal title</Modal.Title>
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
            </div>);
    }
}

export default Land;