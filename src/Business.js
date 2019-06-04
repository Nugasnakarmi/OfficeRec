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
class Business extends Component {
    constructor(props) {
        super(props);
        this.state = { 
            loaded: false,
            editable: this.props.addNew ? true : false,
           PAN: this.props.details ? this.props.details.PAN : '',
            nature: this.props.details ? this.props.details.businessNature : '',
            category: this.props.details ? this.props.details.businessCategory : '',
            bn: this.props.details ? this.props.details.businessName : '',
            income: this.props.details ? this.props.details.annualIncome : '',
            BRD: this.props.details ? this.props.details.regDate : '',
            taxAmount : this.props.details ? this.props.details.taxAmount : '',
            lastDate: this.props.details ? this.props.details.lastDate : '',
            dueDate : this.props.details ? this.props.details.dueDate : '',
            inputID : '',
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
        //  this.handleSelectCategoryChange = this.handleSelectCategoryChange.bind(this);
        //  this.implementCategory = this.implementCategory.bind(this);

        
         this.recordPayment = this.recordPayment.bind(this);
         this.editButton = [<ButtonToolbar  ><Button variant="warning" onClick={this.edit}>Edit</Button>, <Button variant="warning" onClick={this.recordPayment}>Record Payment</Button>, <Button variant="danger" onClick={this.handleShow}>Delete</Button> </ButtonToolbar>]
        this.saveButton = [<ButtonToolbar><Button variant="success" onClick={this.save}>Save</Button>, <Button variant="light" onClick={this.cancel}>Cancel</Button></ButtonToolbar>]
    }

    componentDidMount(){
        console.log(this.props.details);
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
        this.db.collection("UserBase").doc(this.props.user).collection("business-tax").doc(this.props.details.id).set({
            //['due date']: this.state.dueDateLand,
            lastDate: this.state.lastDate
        }).then(() => {
            window.alert("Success!");
            this.props.refresh();
        }).catch((error) => {
            window.alert("Error: ", error);
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
            this.db.collection("UserBase").doc(this.props.user).collection("business-tax").doc(this.props.details.id).delete().then(() => {
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
        this.db.collection("UserBase").doc(this.props.user).collection("business-tax").doc(writeID).set({
            PAN: parseFloat(this.state.PAN),
            businessName: this.state.bn,
            businessNature : this.state.nature,
            businessCategory : this.state.category,
           annualIncome: parseFloat(this.state.income),
            
            taxAmount: parseFloat(this.state.taxAmount),
            dueDate: this.state.dueDateBusiness,
            
            regDate: this.state.BRD,
            lastDate: this.state.lastDate
        }).then(() => {
            window.alert("Success!");
            this.props.refresh();
        }).catch((error) => {
            window.alert("Error: ", error);
        });
    }
    // writeBusinessDetails(e) {
    //     e.preventDefault();
    //     var userRef;
    //     var incomeRef;
    //     if (this.state.email) {
    //         userRef = this.db.collection("UserBase").doc(this.state.email).get().then((doc) => {
    //             if (doc.data()) {
    //                 incomeRef = this.db.collection("UserBase").doc(this.state.email).collection("business-tax");

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
                <div class="col-md-3 mb-3">
                    <label htmlFor="inputpan">PAN</label>
                    <input disabled={this.state.editable ? "" : "disabled"} value={this.state.PAN} id="inputpan" name="PAN" type="number" className="form-control" onChange={this.handleChange} placeholder="PAN"></input>
                </div>
                <div class="col-md-6 mb-3">
                    <label htmlFor="inputbn">Business name</label>
                    <input  disabled={this.state.editable ? "" : "disabled"} value={this.state.bn} id="inputbn" name="bn" className="form-control" onChange={this.handleChange} ></input>
                </div>
                <div class="col-md-3 mb-3">
                    <label htmlFor="income"> Annual Income</label>
                    <input disabled={this.state.editable ? "" : "disabled"} value={this.state.income} id="income" name="income" type="number" className="form-control" onChange={this.handleChange} ></input>
                </div>
                
                
            </div>
            <div className="form-row">
                        <div class="col-md-12 mb-3">

                            <label htmlFor="drop-cat">Category of Business</label>
                            <select disabled={isEditable ? "" : "disabled"} value={this.state.category} id="drop-cat" className="custom-select" name="category" type='number' onChange={this.handleChange}>
                                <option >क: व्यापारिक वस्तु कर </option>
                                <option >खः विशेषग्य परामर्श सेवा तथा अन्य व्यवसाय सेेवा ‍</option>
                                <option >गः उत्पादनमुऋक व्यवसाय </option>
                                <option >घः क्रिषि तथा वन्यजन्तु </option>
                                <option >ङः पर्यटन व्यवसाय </option>
                                <option >चः सेवा व्यवसाय </option>
                                <option >छः संचार सेवा व्यवसाय </option>
                                <option >जः विक्तीय सेवा व्यवसाय  </option>
                                <option >झः स्वास्थय सेवा व्यवसाय  </option>
                                <option >ञः शिक्षा व्यवसाय  </option>
                                <option >टः मर्मत संवार व्यवसाय  </option>
                                <option >ठः अन्य सेवा </option>
                                <option >डः अन्य व्यवसाय  </option>
                                <option >ढः निर्माण व्यवसाय  </option>
                                <option >णः उर्जा मुञक उधोग</option>
                                <option >तः निर्माण उधोग</option>
                                
                            </select>
                        </div>
                    </div>
            <div className="form-row">
            <div class="col-md-4 mb-4">
                    <label htmlFor="income"> Business Nature</label>
                    <input disabled={this.state.editable ? "" : "disabled"} value={this.state.nature} id="nature" name="nature" type="number" className="form-control" onChange={this.handleChange} ></input>
                </div>
                
                <div class="col-md-3 mb-3">
                    <label htmlFor="taxAmount"> Tax rate</label>
                    <input disabled={this.state.editable ? "" : "disabled"}  value={this.state.taxAmount} id="taxAmount" name="taxAmount" className="form-control" onChange={this.handleChange} placeholder="Eg: Rs 120000"></input>
                </div>

                <div class="col-md-5 mb-3">
                    <label htmlFor="dueDateBusiness"> Due date</label>
                    <input disabled={this.props.addNew ? "" : "disabled"} value={this.state.dueDate} type="text" id="dueDate" name="dueDate" className="form-control" onChange={this.handleChange} placeholder="YYYY/MM/DD"></input>
                </div>
                
                {/* <button disabled={this.state.editable ? "" : "disabled"}  onClick={this.writeBusinessDetails} className="btn btn-primary">Submit</button> */}
            </div>
            <div className="form-row">
            <div class="col-md-6 mb-3">
                    <label htmlFor="lastDate"> Last Paid Date</label>
                    <input disabled={this.state.addNew ? "" : "disabled"} value={this.state.lastDate} id="lastDate" name="lastDate" type="text" className="form-control" onChange={this.handleChange} ></input>
                </div>
                
                <div class="col-md-6 mb-3">
                    <label htmlFor="BRD">Business Registration Date</label>
                    <input disabled={this.state.editable ? "" : "disabled"}  value={this.state.BRD} id="BRD" name="BRD" className="form-control" type ="text" onChange={this.handleChange}></input>
                </div>
                </div>

        </section>);
    }
    render() { 
        return (<div align="center">
                
        <Card className="popupCards">
            <CardHeader style={{ backgroundColor: "#2D93AD", color: "aliceblue" }} tag="h4"> Business Tax  </CardHeader>


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
 
export default Business;