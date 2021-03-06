import React, { Component } from 'react';
import fixDate from './FixDate';
import income from './res/income.png';
import './detailscontent.css';
import {
    Alert, Card, CardHeader, CardFooter, CardBody,
    CardTitle, CardText
} from 'reactstrap';
import { Form, Row, Col, Button, ButtonToolbar, Modal } from 'react-bootstrap';
import fire from './config/fire';
import adbs from 'ad-bs-converter';
class Advertisement extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loaded: false,
            editable: this.props.addNew ? true : false,
            adType: this.props.details ? this.props.details.adType : '',
            taxRate: this.props.details ? this.props.details.taxAmount : '',
            regDate: this.props.details ? this.props.details.regDate : '',
            dueDate: this.props.details ? this.props.details.dueDate : '',
            lastDate: this.props.details ? this.props.details.lastDate : '',
            inputID: '',
            show: false
        }
        this.db = fire.firestore();
        this.displayText = [];

        this.edit = this.edit.bind(this);
        this.cancel = this.cancel.bind(this);
        this.renderForm = this.renderForm.bind(this);
        this.save = this.save.bind(this);
        this.delete = this.delete.bind(this);
        this.handleShow = this.handleShow.bind(this);
        this.handleClose = this.handleClose.bind(this);

        this.handleChange = this.handleChange.bind(this);
        this.recordPayment = this.recordPayment.bind(this);
        this.editButton = [<ButtonToolbar  ><Button variant="warning" onClick={this.edit}>Edit</Button>, <Button variant="warning" onClick={this.recordPayment}>Record Payment</Button>, <Button variant="danger" onClick={this.handleShow}>Delete</Button> </ButtonToolbar>]
        this.saveButton = [<ButtonToolbar><Button variant="success" onClick={this.save}>Save</Button>, <Button variant="light" onClick={this.cancel}>Cancel</Button></ButtonToolbar>]
        this.today = new Date(); //todays date object
        this.todayString = [this.today.getFullYear(), this.today.getMonth() + 1, this.today.getDate()].join('/');  //string of date delimited by /
        this.todayBS = adbs.ad2bs(this.todayString);  //todays date in BS
    }

    componentDidMount() {
        console.log(this.props.details);
    }
    recordPayment(e) {
        e.preventDefault();
        
        this.setState({
            lastDate: [this.todayBS.en.year, this.todayBS.en.month, this.todayBS.en.day].join('/')
            //also set a new due date
        });
        var advertisementtaxRef = this.db.collection("UserBase").doc(this.props.user).collection("advertisement-tax").doc(this.props.details.id);
       
        this.db.runTransaction((tr) => {
            return tr.get(advertisementtaxRef).then((sdoc) => {
                if (!sdoc.data()) {
                    throw "Document doesn't exist";
                }

                tr.update(advertisementtaxRef, { lastDate: this.state.lastDate, taxAmount: 0 });
                return this.state.lastDate;
            });
        }).then(() => {
            window.alert("Success!");
            this.props.refresh();
        })
            .catch(function (err) {
                // This will be an "population is too big" error.
                console.error(err);
                window.alert("Error: ", err);
            });
    }
    handleClose() {
        this.setState({ show: false });
    }

    handleShow() {
        this.setState({ show: true });
    }

    handleChange = e => this.setState({ [e.target.name]: e.target.value });

    // implementCategory = e => {
    //     return new Promise((resolve, reject) => {
    //         this.setState({ category: e.target.value });
    //         resolve(this.state.category);
    //     });
    // }

    // handleSelectCategoryChange(e) {
    //     this.implementCategory(e).then(this.getValuation);
    // }
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
        console.log("TRYING TO DELETE")
        if (this.state.inputID === this.props.user) {
            this.db.collection("UserBase").doc(this.props.user).collection("advertisement-tax").doc(this.props.details.id).delete().then(() => {
                window.alert("Success!");
                this.handleClose();
                this.props.refresh();
            }).catch((error) => {
                window.alert("Error: ", error.msg);
            });
        }
        else {
            window.alert("Wrong information!");
        }
    }
    save(e) {
        e.preventDefault();
        let writeID = this.props.addNew ? (this.props.maxID + 1).toString() : this.props.details.id;
        console.log("WriteID", writeID);
        this.db.collection("UserBase").doc(this.props.user).collection("advertisement-tax").doc(writeID).set({
            adType: this.state.adType,


            taxAmount: parseFloat(this.state.taxRate),
            dueDate: this.state.dueDate,
            regDate: this.props.addNew ? [this.todayBS.en.year, this.todayBS.en.month, this.todayBS.en.day].join('/') : this.state.regDate,

            lastDate: this.state.lastDate
        }).then(() => {
            window.alert("Success!");
            // this.props.refresh();
        }).catch((error) => {
            if (error){
                window.alert("Error: ", error);
                console.log(error);
            }
        });
    }
    // writeBusinessDetails(e) {
    //     e.preventDefault();
    //     var userRef;
    //     var incomeRef;
    //     if (this.state.email) {
    //         userRef = this.db.collection("UserBase").doc(this.state.email).get().then((doc) => {
    //             if (doc.data()) {
    //                 incomeRef = this.db.collection("UserBase").doc(this.state.email).collection("advertisement-tax");

    //                 incomeRef.doc(this.state.bn).set({
    //                     PAN: parseFloat(this.state.PAN),
    //                     ['business name']: this.state.bn,

    //                     ['annual income']: parseFloat(this.state.income),
    //                     taxAmount: parseFloat(this.state.taxAmountBusiness),
    //                     ['due date']: this.state.dueDateBusiness

    //                 }).then(() => { window.alert("updated successfully") }).catch((error) => { window.alert(error.message) });
    //             }
    //             else {
    //                 window.alert("User does not exist")
    //             }
    //         })
    //     }
    //     else {
    //         window.alert("User cannot be empty");
    //     }
    // }
    componentDidMount() {
        this.baseState = { ...this.state, loaded: true };
    }
    renderForm(isEditable) {

        return (
            <section>

                <div className="form-row">
                    <div className="col-md-12 mb-3">

                        <label htmlFor="drop-cat">Advertisement Type</label>
                        <select disabled={isEditable ? "" : "disabled"} value={this.state.adType} id="adType" className="custom-select" name="adType" onChange={this.handleChange}>
                            {/* <option value ="1" >१ः फ्लेक्स बोर्डबाट तयार गरिएको विज्ञापन प्रचार सामाग्रीको प्रतिवर्ष प्रतिवर्ग फुट</option>
                            <option  value ="2" >२ः डिजिटल बोर्ड, ग्लो साइन बोर्ड, स्टिकरबाट गरिने विज्ञापन प्रचार सामग्रीको प्रतिवर्ष प्रतिवर्ग फुट</option>
                            <option  value ="3" >३ः उत्पादनमुऋक व्यवसाय </option>
                            <option  value ="4" >४ः क्रिषि तथा वन्यजन्तु </option>
                            <option  value ="5" >५ः पर्यटन व्यवसाय </option>
                            <option  value ="6" >६ः सेवा व्यवसाय </option>
                            <option value ="7"  >७ः संचार सेवा व्यवसाय </option>
                            <option value ="8"  >८ः विक्तीय सेवा व्यवसाय  </option> */}

                            <option>१ः फ्लेक्स बोर्डबाट तयार गरिएको विज्ञापन प्रचार सामाग्रीको प्रतिवर्ष प्रतिवर्ग फुट</option>
                            <option >२ः डिजिटल बोर्ड, ग्लो साइन बोर्ड, स्टिकरबाट गरिने विज्ञापन प्रचार सामग्रीको प्रतिवर्ष प्रतिवर्ग फुट</option>
                            <option  >३ः उत्पादनमुऋक व्यवसाय </option>
                            <option  >४ः क्रिषि तथा वन्यजन्तु </option>
                            <option >५ः पर्यटन व्यवसाय </option>
                            <option  >६ः सेवा व्यवसाय </option>
                            <option   >७ः संचार सेवा व्यवसाय </option>
                            <option   >८ः विक्तीय सेवा व्यवसाय  </option>

                        </select>
                    </div>
                </div>
                            

                <div className="form-row">


                    <div class="col-md-3 mb-3">
                        <label htmlFor="taxAmount"> Tax rate</label>
                        <input disabled={this.state.editable ? "" : "disabled"} value={this.state.taxRate} id="taxRate" name="taxRate" className="form-control" onChange={this.handleChange} ></input>
                    </div>

                    <div class="col-md-3 mb-3">
                        <label htmlFor="dueDateBusiness"> Due date</label>
                        <input disabled={this.props.addNew ? "" : "disabled"} value={this.state.dueDate} type="text" id="dueDate" name="dueDate" className="form-control" onChange={this.handleChange}></input>
                    </div>
                    
                    <div class="col-md-3 mb-3">
                        <label htmlFor="dueDateBusiness"> Registration date</label>
                        <input disabled={this.props.addNew ? "" : "disabled"} value={this.state.regDate} type="text" id="regDate" name="regDate" className="form-control" onChange={this.handleChange} ></input>
                    </div>

                    {/* <button disabled={this.state.editable ? "" : "disabled"}  onClick={this.writeBusinessDetails} className="btn btn-primary">Submit</button> */}

                    <div class="col-md-3 mb-3">
                        <label htmlFor="lastDate"> Last Paid Date</label>
                        <input disabled={this.state.addNew ? "" : "disabled"} value={this.state.lastDate} id="lastDate" name="lastDate" type="text" className="form-control" onChange={this.handleChange} ></input>
                    </div>


                </div>

            </section>
        );
    }
    render() {
        return (
            <div align="center">

                <Card className="popupCards">
                    <CardHeader style={{ backgroundColor: "#2D93AD", color: "aliceblue" }} tag="h4"> Advertisement Tax  </CardHeader>


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
            </div>);
    }
}



export default Advertisement;