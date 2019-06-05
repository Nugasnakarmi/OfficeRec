import React, { Component } from 'react';
import fire from './config/fire';
import firebase from 'firebase';
import Business from './Business';
import {
    Spinner
} from 'reactstrap';

import {Accordion, Modal, Card } from 'react-bootstrap'

class EditBusiness extends Component {
    constructor(props) {
        super(props);
        this.state = {

            email: '',
            warningStatus: 'inactive'
        };
        this.db = fire.firestore();
       
        this.countItem = 0;
        this.itemList = [];
        this.displayText = [];

        this.handleChange = this.handleChange.bind(this);
        this.writeBusinessDetails = this.writeBusinessDetails.bind(this);


    }
    handleChange = e => this.setState({ [e.target.name]: e.target.value });
    writeBusinessDetails(e) {
        e.preventDefault();
        var userRef;
        var incomeRef;
        if (this.state.email) {
            userRef = this.db.collection("UserBase").doc(this.state.email).get().then((doc) => {
                if (doc.data()) {
                    incomeRef = this.db.collection("UserBase").doc(this.state.email).collection("business-tax");

                    incomeRef.doc(this.state.bn).set({
                        PAN: parseFloat(this.state.PAN),
                        ['business name']: this.state.bn,
                        ['type of employment']: this.state.employType,
                        ['annual income']: parseFloat(this.state.income),
                        taxAmount: parseFloat(this.state.taxAmountBusiness),
                        ['due date']: firebase.firestore.Timestamp.fromDate(new Date(this.state.dueDateBusiness))

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
    componentDidMount() {
        let totalRecords  = 0;
        let idList = [];
        var landRef = this.db.collection("UserBase").doc(this.props.user).collection("business-tax");
        landRef.get().then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
                this.countItem++;
                console.log(doc.id, " => ", doc.data());
                this.itemList.push({ ...doc.data(), id: doc.id });
                idList.push(parseFloat(doc.id));
            });
        }).then(() => {
            //console.clear();
            console.log("NO of property", this.countItem);
            console.log("The list", this.itemList);
            if(!this.itemList ){
                this.maxID = 0
            }
            else{
                this.maxID = Math.max(...idList);
                
            }
            this.itemList.map((item, index) => {
                this.displayText.push(<Card>
                    <Accordion.Toggle as={Card.Header} eventKey={index}>
                        {item.id986}: {item.businessname}/{item.PAN}
                    </Accordion.Toggle>
                    <Accordion.Collapse eventKey={index}>
                        <Card.Body>
                            <Business user={this.props.user} details={item} isAdmin={this.props.isAdmin} refresh={this.toggleUpdate} />
                        </Card.Body>
                    </Accordion.Collapse>
                </Card>)
                totalRecords++;
            })
            if (this.props.isAdmin){
                this.displayText.push(<Card align ="center">
                    <Accordion.Toggle as={Card.Header} eventKey={totalRecords}>
                        <b>Add Record</b>
                    </Accordion.Toggle>
                    <Accordion.Collapse eventKey={totalRecords}>
                        <Card.Body>
                            <Business addNew = {true} user={this.props.user}  maxID = {this.maxID} details={null} isAdmin={this.props.isAdmin} refresh={this.toggleUpdate} />
                        </Card.Body>
                    </Accordion.Collapse>
                </Card>)
            }
            this.setState({
                loaded: true
            });

            //set a state to list loaded.
        });
    }



    render() {
        if (!this.state.email) {
            this.setState({
                email: this.props.user
            })
        }
        // var adbs = require("ad-bs-converter");

        // let nepdate= adbs.ad2bs("1990/8/10");
        // console.log(nepdate);
        // let engdate = adbs.bs2ad("2047/4/26");
        // console.log(engdate['month']);
        return (
            
            // <section>
                
            //     <div className="form-row">
            //         <div class="col-md-3 mb-3">
            //             <label htmlFor="inputpan">PAN</label>
            //             <input value={this.state.PAN} id="inputpan" name="PAN" type="number" className="form-control" onChange={this.handleChange} placeholder="PAN"></input>
            //         </div>
            //         <div class="col-md-3 mb-3">
            //             <label htmlFor="income"> Annual Business</label>
            //             <input value={this.state.income} id="income" name="income" type="number" className="form-control" onChange={this.handleChange} placeholder="Eg: Rs 120000"></input>
            //         </div>
            //         <div class="col-md-6 mb-3">
            //             <label htmlFor="employType"> Employment type</label>
            //             <input value={this.state.employType} id="employType" name="employType" className="form-control" onChange={this.handleChange} placeholder="Eg: Business-person"></input>
            //         </div>
            //     </div>
            //     <div className="form-row">
            //         <div class="col-md-6 mb-3">
            //             <label htmlFor="inputbn">Business name</label>
            //             <input value={this.state.bn} id="inputbn" name="bn" className="form-control" onChange={this.handleChange} placeholder="Eg: ABC trading pvt ltd."></input>
            //         </div>
            //         <div class="col-md-3 mb-3">
            //             <label htmlFor="dueDateBusiness"> Due date</label>
            //             <input value={this.state.dueDateBusiness} type="date" id="dueDateBusiness" name="dueDateBusiness" className="form-control" onChange={this.handleChange} placeholder="Eg: 12th March 2020"></input>
            //         </div>
            //         <div class="col-md-3 mb-3">
            //             <label htmlFor="taxAmount"> Tax amount</label>
            //             <input value={this.state.taxAmountBusiness} id="taxAmountBusiness" name="taxAmountBusiness" className="form-control" onChange={this.handleChange} placeholder="Eg: Rs 120000"></input>
            //         </div>
            //         <button onClick={this.writeBusinessDetails} className="btn btn-primary">Submit</button>
            //     </div>

            // </section>
               <Accordion defaultActiveKey="0">
               {this.state.loaded ? (this.displayText) : <Spinner color="info" />}
           </Accordion>
        )
    }
}

export default EditBusiness;
