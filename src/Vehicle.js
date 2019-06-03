import React, { Component } from 'react';
import fire from './config/fire';
import fixDate from './FixDate';
import './detailscontent.css'
import wheel2 from './res/2wheel.png';
import wheel4 from './res/4wheel.png';
import { ButtonToolbar, Button, Modal } from 'react-bootstrap';
import adbs from 'ad-bs-converter';
import { Alert, Card, CardBody , CardHeader} from 'reactstrap';

class Vehicle extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loaded: false,
            editable: this.props.addNew ? true : false,
            email: this.props.details ? this.props.details.email : '',
            VRN: this.props.details ? this.props.details.VRN : '',
            type: this.props.details ? this.props.details.type : '',
            companyName: this.props.details ? this.props.details.companyName : '',
            model: this.props.details ? this.props.details.model : '',
            noofCyl: this.props.details ? this.props.details.noofCyl : '',
            hpcc: this.props.details ? this.props.details['HorsePower/CC'] : '',
            vehicleColor: this.props.details ? this.props.details.vehicleColor : '',
            manDate: this.props.details ? this.props.details['Year of Manufacture'] : '',
            regDate: this.props.details ? this.props.details['registered date'] : '',
            lastDate: this.props.details ? this.props.details.lastDate : '',
            seatCapacity: this.props.details ? this.props.details.seatCapacity : '',
            ChassisNo: this.props.details ? this.props.details.ChassisNo : '',
            EngineNo: this.props.details ? this.props.details.EngineNo : '',
            PDtype: this.props.details ? this.props.details['Petrol/Diesel'] : '',
            useType: this.props.details ? this.props.details.Use : '',
            CustomNissa: this.props.details ? this.props.details['Bhansar ko Nissa'] : '',
            dueDate: this.props.details ? this.props.details['due date'] : '',
            taxAmount: this.props.details ? this.props.details.amount : '',
            warningStatus: 'inactive'
        };



        this.handleChange = this.handleChange.bind(this);
        this.handleChangeVRN = this.handleChangeVRN.bind(this);
        this.handleSelectChange = this.handleSelectChange.bind(this);
        this.setVehicleType = this.setVehicleType.bind(this);
        this.recordPayment = this.recordPayment.bind(this);
        //this.writeVehicleDetails = this.writeVehicleDetails.bind(this);
        this.edit = this.edit.bind(this);
        this.cancel = this.cancel.bind(this);
        this.renderForm = this.renderForm.bind(this);
        this.save = this.save.bind(this);
        this.delete = this.delete.bind(this);
        this.handleShow = this.handleShow.bind(this);
        this.handleClose = this.handleClose.bind(this);

        this.editButton = [<ButtonToolbar><Button variant="warning" onClick={this.edit}>Edit</Button>, <Button variant="warning" onClick={this.recordPayment}>Record Payment</Button>, <Button variant="danger" onClick={this.handleShow}>Delete</Button> </ButtonToolbar>]
        this.saveButton = [<ButtonToolbar><Button variant="success" onClick={this.save}>Save</Button>, <Button variant="light" onClick={this.cancel}>Cancel</Button></ButtonToolbar>]
        this.db = fire.firestore();
    }

    handleChange = e => this.setState({ [e.target.name]: e.target.value });

    handleChangeVRN(e) {
        const input = e.target;
        var start = input.selectionStart;
        var end = input.selectionEnd;
        var length = input.value.length;
        console.log(length);
        var asc = input.value.toUpperCase().charCodeAt(length - 1);
        console.log(asc);
        if ((asc >= 65 && asc <= 90) || (asc >= 48 && asc <= 57) || (asc === 32) || (length === 0)) {
            this.setState(
                { [input.name]: input.value.toUpperCase() },
                () => input.setSelectionRange(start, end))
        }
    }

    setVehicleType(e) {
        return new Promise((resolve, reject) => {
            this.setState({ [e.target.name]: e.target.value });
            resolve(this.state.type);
        });
        // console.log("Vehicle type chosen", this.state.type);
    }

    handleSelectChange(e) {
        this.setVehicleType(e).then(() => {
            console.log("TYPE OF VEHICLE", this.state.type);
        }).catch((error) => console.log(error));
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

    save(e) {
        e.preventDefault();
        let writeID = this.props.addNew ? (this.state.VRN) : this.props.details.id;
        console.log("WriteID", writeID);
        var vehicleRef;
        var re = /^[a-z]{2} [1-9]{1,2} [a-z]{2,3} [0-9]{1,4}$/i;
        var test = re.test(this.state.VRN);
        console.log(test);
        if (test) {
            this.setState({ warningStatus: "inactive" })
            vehicleRef = this.db.collection("UserBase").doc(this.props.user).collection("vehicle-tax").doc(writeID);
            vehicleRef.set(
                {
                    amount: parseFloat(this.state.taxAmount),
                    ['registered date']: this.state.regDate,
                    ['due date']: this.state.dueDate,
                    type: this.state.type,
                    VRN: this.state.VRN,
                    companyName: this.state.companyName,
                    model: this.state.model,
                    ['Year of Manufacture']: this.state.manDate,
                    ['No of Cylinders']: this.state.noofCyl,
                    ChassisNo: this.state.ChassisNo,
                    EngineNo: this.state.EngineNo,
                    ['HorsePower/CC']: this.state.hpcc,
                    vehicleColor: this.state.vehicleColor,
                    seatCapacity: this.state.seatCapacity,
                    Use: this.state.useType,
                    ['Petrol/Diesel']: this.state.PDtype,
                    ['Bhansar ko Nissa']: this.state.CustomNissa,
                    lastDate: this.state.lastDate
                }//, { merge: true }
            ).then(() => {
                window.alert("Success!");
                this.props.refresh();
            }).catch((error) => {
                window.alert("Error: ", error);
                
            });
        }
        else {
            //document.getElementById("vrnDown").innerHTML = "Please correct format for VRN";
            this.setState({
                warningStatus: 'active'
            });
            // window.alert("Please put spaces as specified for VRN ")
        }
    }

    recordPayment(e) {
        e.preventDefault();
        let today = new Date(); //todays date object
        console.log('regdate', this.state.regDate); //input reg date
        console.log('last payment', this.state.lastDate); //input date of last payment
        let todayString = [today.getFullYear(), today.getMonth() + 1, today.getDate()].join('/');  //string of date delimited by /
        let todayBS = adbs.ad2bs(todayString);  //todays date in BS
        var regDateArr = this.state.regDate.split('/').map(function (str) {
            return Number(str);
        });
        var regDateObj = { year: regDateArr[0], month: regDateArr[1], day: regDateArr[2] }; //object of registered date BS

        this.setState({
            lastDate: [todayBS.en.year, todayBS.en.month, todayBS.en.day].join('/'),
            dueDate: [todayBS.en.year + 1, regDateObj.month, regDateObj.day-1].join('/'),
            taxAmount: 0
        });
        this.db.collection("UserBase").doc(this.props.user).collection("vehicle-tax").doc(this.props.details.id).set({
            ['due date']: this.state.dueDate,
            lastDate: this.state.lastDate,
            amount: this.state.taxAmount
        }).then(() => {
            window.alert("Success!");
            this.props.refresh();
        }).catch((error) => {
            window.alert("Error: ", error);
        });
        
  



        console.log('paid today', todayBS);
        

        var lastDateArr = this.state.lastDate.split('/').map(function (str) {
            return Number(str);
        });
        var lastDateObj = { year: lastDateArr[0], month: lastDateArr[1], day: lastDateArr[2] }; //object of last paid date

        var due = { ...regDateObj, year: lastDateObj.year + 1, day: regDateObj.day - 1 }; //due date in key:value pair
        console.log("Due date is", due);

        //english due date
        let engDue = adbs.bs2ad([due.year, due.month, due.day].join('/'));
        //console.log("ENGDUE", engDue);
        let dueDateAD = new Date([engDue.year, engDue.month, engDue.day].join('/'));
        console.log("Due date in AD", dueDateAD);

        //Overdue Calculation
        if (dueDateAD < today) {
            let dueYears = [];
            let unpaidNo = todayBS.en.year - due.year;
            let dueThisYearBS = { ...regDateObj, year: todayBS.en.year };
            let dueThisYearAD = adbs.bs2ad([dueThisYearBS.year, dueThisYearBS.month, dueThisYearBS.day].join('/')); //This year's due date in string form
            let dueThisYear = new Date([dueThisYearAD.year, dueThisYearAD.month, dueThisYearAD.day].join('/')); //Due date of this year
            console.log("Due date for this year is ", dueThisYear);
            let additionalYear = (dueThisYear < today) ? 1 : 0; //to compensate if current month is beyond due date for this year
            console.log(`overdue by ${unpaidNo} years`);
            for (let i = 0; i < unpaidNo + additionalYear; i++) {
                let dueYear = due.year + i;
                let yearString = dueYear.toString().substr(-2) + '-' + (dueYear + 1).toString().substr(-2);
                dueYears.push(yearString);
            }
            console.log(`unpaid years: ${dueYears}`);
            console.log("Due date exceeded!!!!!!!!!!!");
        }
        else {
            console.log("Time Left!! :)")
        }


        //do calculations based on the month
        //------------------MONTH BASED CALCULATIONS OF TAX-------------------------------------
        /*
        switch (dateObj.month){
            case 1:
            case 2:
            case 3:
            case 12:
                
        }
        */
        //console.log('converted', adbs.bs2ad(this.state.regDate));

    }

    delete(e) {
        e.preventDefault();
        if (this.state.inputID === this.props.user) {
            this.db.collection("UserBase").doc(this.props.user).collection("vehicle-tax").doc(this.props.details.id).delete().then(() => {
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

    renderForm(isEditable) {
        // if (isEditable) {
            return (
                <div align ="center">
                <section >
                       
                    <Card style={{ marginBottom :"2.5%"}}>
                        <div >
                        Basic information
                        </div>
                        <hr size ="80%"/>
                        <CardBody>
                       
                        <div className ="form-group row">
                        <div class="col-md-4 sm-4">
                            <span> <label htmlFor="vrn" id="vrnUp">Vehicle Registration Number</label>
                                <i><label className="hidden" htmlFor="vrn" id="vrnDown" status={this.state.warningStatus}>Please enter as in the format specified.</label> </i> </span>
                             <input disabled={this.props.addNew ? "": "disabled"} value={this.state.VRN} className="form-control upper" name="VRN" type="text" id="vrn" onChange={this.handleChangeVRN} placeholder="BA 3 CHA 1234"></input> 
                        </div>
                        <div className ="col-md-4 sm-4">
                            <label htmlFor="drop-vehicle" position="left">Vehicle Type</label>
                            <select disabled={this.state.editable ? "": "disabled"}id="drop-vehicle" onChange={this.handleSelectChange} name='type' value={this.state.type} className="custom-select">
                                <optgroup label='Category I'>

                                    <option value='Motorcycle'>Motorcycle/Scooter</option>
                                    <option value='Minitruck/Minibus'>Minitruck/Minibus</option>
                                    <option value='Truck/Bus'>Truck/Bus</option>
                                    <option value='Car'>Car</option>
                                    <option value='Jeep'>Jeep</option>
                                    <option value='Van'>Van</option>
                                    <option value='Microbus'>Microbus</option>
                                </optgroup>
                                <optgroup label='Category II'>
                                    <option value='Dozer'>Dozer</option>
                                    <option value='Excavator'>Excavator</option>
                                    <option value='Loader'>Loader</option>
                                    <option value='Roller'>Roller</option>
                                    <option value='Tripper'>Tripper</option>
                                    <option value='Crane'>Crane</option>
                                    <option value='Mini-tripper'>Mini-tripper</option>
                                </optgroup>
                                <optgroup label='Category III'>
                                    <option value='Tractor'>Tractor</option>
                                    <option value='Power Tiller'>Power Tiller</option>
                                </optgroup>
                            </select>

                        </div>
                       
                        <div class="  col-md-4  sm-4 ">
                            <label htmlFor="companyName" position="left">Company Name</label>
                            <input disabled={this.state.editable ? "": "disabled"} value={this.state.companyName} className="form-control" id="companyName" name="companyName" type="text" onChange={this.handleChange} placeholder="TVS"></input>
                        </div>
                    
                 
                  
                        </div>
                        <div className="form-row">


                            <div class="col-md-3  mb-3">
                                <label htmlFor="model" position="left">Model</label>
                                <input disabled={this.state.editable ? "": "disabled"} value={this.state.model} className="form-control" id="model" name="model" type="text" onChange={this.handleChange} placeholder="Eg: Apache"></input>
                            </div>
                            <div class="col-md-3  mb-3">
                                <label htmlFor="noofCyl" position="left">No of Cylinders</label>
                                <input disabled={this.state.editable ? "": "disabled"}value={this.state.noofCyl} className="form-control" id="noofCyl" name="noofCyl" type="number" min="1" onChange={this.handleChange} placeholder="Eg: 1"></input>
                            </div>
                            <div class="col-md-3  mb-3">
                                <label htmlFor="hpcc" position="left">Horse Power/ CC</label>
                                <input disabled={this.state.editable ? "": "disabled"}value={this.state.hpcc} className="form-control" id="hpcc" name="hpcc" type="text" onChange={this.handleChange} placeholder="Eg:200"></input>
                            </div>
                            <div class="col-md-3  mb-3">
                                <label htmlFor="vehicleColor" position="left">Vehicle Color</label>
                                <input disabled={this.state.editable ? "": "disabled"}value={this.state.vehicleColor} className="form-control" id="vehicleColor" name="vehicleColor" type="text" onChange={this.handleChange} placeholder="Eg: White"></input>
                            </div>
                        </div>
                        </CardBody>
                   </Card>

                   <Card style={{ marginBottom :"2.5%"}}>
                        <CardBody>
                
                        <div class="form-row">
                            <div class="col-md-4 mb-3">
                                <label htmlFor="drop-useType" position="left">Use</label>
                                <select disabled={this.state.editable ? "": "disabled"} id="drop-useType" onChange={this.handleSelectChange} name='useType' value={this.state.useType} className="custom-select">
                                    <option value='Private'>Private</option>
                                    <option value='Rented'>Rented</option>
                                    <option value='Government'>Government</option>
                                </select>
                            </div>
                            <div class="col-md-4 mb-3">
                                <label htmlFor="CustomNissa" position="left">Bhansar Nissa</label>
                                <input  disabled={this.state.editable ? "": "disabled"}value={this.state.CustomNissa} className="form-control" id="CustomNissa" name="CustomNissa" type="text" onChange={this.handleChange} placeholder="Eg: ME45599 2074/03/16"></input>

                            </div>
                            <div class="col-md-4  mb-3">
                                <label htmlFor="seatCapacity" position="left">Seat Capacity</label>
                                <input disabled={this.state.editable ? "": "disabled"} value={this.state.seatCapacity} className="form-control" id="seatCapacity" name="seatCapacity" type="number" min="1" onChange={this.handleChange} placeholder="Eg: 2"></input>
                            </div>
                        </div>
                        <div className="form-row">
                            
                            <div class="col-md-4  mb-3">
                                <label htmlFor="ChassisNo" position="left">Chassis No</label>
                                <input disabled={this.state.editable ? "": "disabled"}  value={this.state.ChassisNo} className="form-control" id="ChassisNo" name="ChassisNo" type="text" onChange={this.handleChangeVRN} placeholder="Eg: MDS236A9942P32099"></input>
                            </div>
                            <div class="col-md-4  mb-3">
                                <label htmlFor="EngineNo" position="left">Engine No</label>
                                <input disabled={this.state.editable ? "": "disabled"} value={this.state.EngineNo} className="form-control" id="EngineNo" name="EngineNo" type="text" onChange={this.handleChangeVRN} placeholder="Eg: 6R9D42030456"></input>
                            </div>
                            <div class="col-md-4  mb-3">
                                <label htmlFor="drop-PD" position="left">Petrol/Diesel</label>

                                <select disabled={this.state.editable ? "": "disabled"} id="drop-PD" onChange={this.handleSelectChange} name='PDtype' value={this.state.PDtype} className="custom-select">
                                    <option value="Petrol">Petrol</option>
                                    <option value='Diesel'>Diesel</option>
                                </select>

                            </div>
                        </div>
                        </CardBody>
                   </Card>
                   <Card  style={{ marginBottom :"2.5%"}}>
                        <CardBody>
                
                   <div class="form-row">

                            <div class="col-md-6 mb-3">
                                <label htmlFor="inputDate" position="left">Due date</label>
                                <input disabled value={this.state.dueDate} className="form-control" id="inputDate" name="dueDate" type="date" onChange={this.handleChange}></input>
                            </div>
                            <div class="col-md-6 mb-3">
                                <label htmlFor="inputTax" position="left">Tax amount</label>
                                <input disabled={this.state.editable ? "": "disabled"} value={this.state.taxAmount} id="inputTax" name="taxAmount" className='form-control' type="number" min="0" onChange={this.handleChange} placeholder="Rs 1000"></input>
                            </div>
                            {/* <button onClick={this.recordPayment} className="btn btn-primary">Record Payment</button>
                            <button onClick={this.writeVehicleDetails} className="btn btn-primary">Submit</button> */}
                        </div>
                        <div class="form-row">
                            <div class="col-md-4 mb-3">
                                <label htmlFor="manDate" position="left">Year of Manufacture</label>
                                <input disabled={this.state.editable ? "": "disabled"}value={this.state.manDate} className="form-control" id="manDate" name="manDate" type="number" min="2000" onChange={this.handleChange} placeholder="Eg: 2014"></input>
                            </div>
                            <div class="col-md-4 mb-3">
                                <label htmlFor="lastDate" position="left">Last Paid</label>
                                <input disabled={this.state.editable ? "": "disabled"}value={this.state.lastDate} className="form-control" id="lastDate" name="lastDate" type="text" onChange={this.handleChange} placeholder="YYYY/MM/DD"></input>
                            </div>
                            {/* <div class="col-md-6 mb-3">
                            <label htmlFor="regDate" position="left">Date of Registration</label>
                            <input value={this.state.regDate} className="form-control" id="regDate" name="regDate" type="date" onChange={this.handleChange} placeholder="Eg: 7th March 2010"></input>
                        </div> */}
                            {/* THIS IS TEST CODE FOR NEPALI DATE ------ PURAK */}
                            <div class="col-md-4 mb-3">
                                <label htmlFor="regDate" position="left">Date of Registration</label>
                                <input disabled={this.state.editable ? "": "disabled"} value={this.state.regDate} className="form-control" id="regDate" name="regDate" type="text" onChange={this.handleChange} placeholder="YYYY/M/DD"></input>
                            </div>
                        </div>
                        

                        </CardBody>
                   </Card> 
                   
                </section>
                </div>
            );
        }
         //ALL OF THIS CODE IS UNNECESSARY

        

    componentDidMount() {
        this.baseState = { ...this.state, loaded: true };
    }

    render() {
        console.log("RENDER");
        return (
            // <div className="item-box">
            //     <h3>Vehicle</h3>
            //     <div className="row">
            //         <div className="location col-6">
            //             <p className='content-para'>Registration Number: {this.props.details.VRN}</p>
            //             <p className='content-para'>Vehicle Type: {this.props.details.type}</p>
            //             <p className='content-para'>Tax Amount: NRs. {this.props.details.amount}</p>
            //             <p className='content-para'>Due: {fixDate(this.props.details['due date'])}</p>
            //         </div>
            //         <div className="col-6 logodiv">
            //             {<img className="logo" src={this.props.details.type.includes('2') ? wheel2 : wheel4}></img>}
            //         </div>

            //     </div>
            // </div>
            <div>
                <Card className ="popupCards">
                <CardHeader style={{backgroundColor:"#2D93AD", color :"aliceblue"}} tag="h4">  Vehicle details here   </CardHeader>


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

export default Vehicle;