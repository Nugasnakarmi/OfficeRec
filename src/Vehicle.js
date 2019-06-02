import React, { Component } from 'react';
import fire from './config/fire';
import fixDate from './FixDate';
import './detailscontent.css'
import wheel2 from './res/2wheel.png';
import wheel4 from './res/4wheel.png';
import { ButtonToolbar, Button, Modal } from 'react-bootstrap';

class Vehicle extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loaded: false,
            editable: this.props.addNew ? true : false,
            email: this.props.details ? this.props.details.email : '',
            VRN: this.props.details ? this.props.details.VRN :'',
            type: this.props.details ? this.props.details.type :'',
            companyName:this.props.details ? this.props.details.companyName :'',
            model:this.props.details ? this.props.details.model :'',
            noofCyl:this.props.details ? this.props.details.noofCyl :'',
            hpcc: this.props.details ? this.props.details['HorsePower/CC'] :'',
            vehicleColor:this.props.details ? this.props.details.vehicleColor :'',
            manDate:this.props.details ? this.props.details['Year of Manufacture'] :'',
            regDate: this.props.details ? this.props.details['registered date'] :'',
            lastDate: this.props.details ? this.props.details.lastDate :'',
            seatCapacity:this.props.details ? this.props.details.seatCapacity :'',
            ChassisNo:this.props.details ? this.props.details.ChassisNo :'',
            EngineNo:this.props.details ? this.props.details.EngineNo :'',
            PDtype:this.props.details ? this.props.details['Petrol/Diesel'] :'',
            useType:this.props.details ? this.props.details.Use :'',
            CustomNissa:this.props.details ? this.props.details['Bhansar ko Nissa'] :'',
            dueDate:this.props.details ? this.props.details['due date'] :'',
            taxAmount:this.props.details ? this.props.details.amount :'',
            warningStatus: 'inactive'
        };

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

    renderForm(isEditable) {
        if (isEditable) {
            return (
                <section>
                    <h2> Vehicle details here </h2>
                    <div className="form-row">
                        <div class="col-md-4  mb-3">
                            <label htmlFor="drop-vehicle" position="left">Vehicle Type</label>
                            <select id="drop-vehicle" onChange={this.handleSelectChange} name='type' value={this.state.type} className="custom-select">
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
                        <div class="col-md-4  mb-3">
                            <span> <label htmlFor="vrn" id="vrnUp">Vehicle Registration Number</label>
                                <i><label className="hidden" htmlFor="vrn" id="vrnDown" status={this.state.warningStatus}>Please enter as in the format specified.</label> </i> </span>
                            <input value={this.state.VRN} className="form-control upper" name="VRN" type="text" id="vrn" onChange={this.handleChangeVRN} placeholder="BA 3 CHA 1234"></input>
                        </div>
                        <div class="col-md-4  mb-3">
                            <label htmlFor="companyName" position="left">Company Name</label>
                            <input value={this.state.companyName} className="form-control" id="companyName" name="companyName" type="text" onChange={this.handleChange} placeholder="TVS"></input>
                        </div>
                    </div>
                    <form>
                        <div className="form-row">


                            <div class="col-md-3  mb-3">
                                <label htmlFor="model" position="left">Model</label>
                                <input value={this.state.model} className="form-control" id="model" name="model" type="text" onChange={this.handleChange} placeholder="Eg: Apache"></input>
                            </div>
                            <div class="col-md-3  mb-3">
                                <label htmlFor="noofCyl" position="left">No of Cylinders</label>
                                <input value={this.state.noofCyl} className="form-control" id="noofCyl" name="noofCyl" type="number" min="1" onChange={this.handleChange} placeholder="Eg: 1"></input>
                            </div>
                            <div class="col-md-3  mb-3">
                                <label htmlFor="hpcc" position="left">Horse Power/ CC</label>
                                <input value={this.state.hpcc} className="form-control" id="hpcc" name="hpcc" type="text" onChange={this.handleChange} placeholder="Eg:200"></input>
                            </div>
                            <div class="col-md-3  mb-3">
                                <label htmlFor="vehicleColor" position="left">Vehicle Color</label>
                                <input value={this.state.vehicleColor} className="form-control" id="vehicleColor" name="vehicleColor" type="text" onChange={this.handleChange} placeholder="Eg: White"></input>
                            </div>
                        </div>
                        <div class="form-row">
                            <div class="col-md-4 mb-3">
                                <label htmlFor="manDate" position="left">Year of Manufacture</label>
                                <input value={this.state.manDate} className="form-control" id="manDate" name="manDate" type="number" min="2000" onChange={this.handleChange} placeholder="Eg: 2014"></input>
                            </div>
                            <div class="col-md-4 mb-3">
                                <label htmlFor="lastDate" position="left">Last Paid</label>
                                <input value={this.state.lastDate} className="form-control" id="lastDate" name="lastDate" type="text" onChange={this.handleChange} placeholder="YYYY/MM/DD"></input>
                            </div>
                            {/* <div class="col-md-6 mb-3">
                            <label htmlFor="regDate" position="left">Date of Registration</label>
                            <input value={this.state.regDate} className="form-control" id="regDate" name="regDate" type="date" onChange={this.handleChange} placeholder="Eg: 7th March 2010"></input>
                        </div> */}
                            {/* THIS IS TEST CODE FOR NEPALI DATE ------ PURAK */}
                            <div class="col-md-4 mb-3">
                                <label htmlFor="regDate" position="left">Date of Registration</label>
                                <input value={this.state.regDate} className="form-control" id="regDate" name="regDate" type="text" onChange={this.handleChange} placeholder="YYYY/M/DD"></input>
                            </div>
                        </div>
                        <div className="form-row">
                            <div class="col-md-3  mb-3">
                                <label htmlFor="seatCapacity" position="left">Seat Capacity</label>
                                <input value={this.state.seatCapacity} className="form-control" id="seatCapacity" name="seatCapacity" type="number" min="1" onChange={this.handleChange} placeholder="Eg: 2"></input>
                            </div>
                            <div class="col-md-3  mb-3">
                                <label htmlFor="ChassisNo" position="left">Chassis No</label>
                                <input value={this.state.ChassisNo} className="form-control" id="ChassisNo" name="ChassisNo" type="text" onChange={this.handleChangeVRN} placeholder="Eg: MDS236A9942P32099"></input>
                            </div>
                            <div class="col-md-3  mb-3">
                                <label htmlFor="EngineNo" position="left">Engine No</label>
                                <input value={this.state.EngineNo} className="form-control" id="EngineNo" name="EngineNo" type="text" onChange={this.handleChangeVRN} placeholder="Eg: 6R9D42030456"></input>
                            </div>
                            <div class="col-md-3  mb-3">
                                <label htmlFor="drop-PD" position="left">Petrol/Diesel</label>

                                <select id="drop-PD" onChange={this.handleSelectChange} name='PDtype' value={this.state.PDtype} className="custom-select">
                                    <option value="Petrol">Petrol</option>
                                    <option value='Diesel'>Diesel</option>
                                </select>

                            </div>
                        </div>

                        <div class="form-row">
                            <div class="col-md-6 mb-3">
                                <label htmlFor="drop-useType" position="left">Use</label>
                                <select id="drop-useType" onChange={this.handleSelectChange} name='useType' value={this.state.useType} className="custom-select">
                                    <option value='Private'>Private</option>
                                    <option value='Rented'>Rented</option>
                                    <option value='Government'>Government</option>
                                </select>
                            </div>
                            <div class="col-md-6 mb-3">
                                <label htmlFor="CustomNissa" position="left">Bhansar Nissa</label>
                                <input value={this.state.CustomNissa} className="form-control" id="CustomNissa" name="CustomNissa" type="text" onChange={this.handleChange} placeholder="Eg: ME45599 2074/03/16"></input>

                            </div>
                        </div>
                        <div class="form-row">

                            <div class="col-md-6 mb-3">
                                <label htmlFor="inputDate" position="left">Due date</label>
                                <input value={this.state.dueDate} className="form-control" id="inputDate" name="dueDate" type="date" onChange={this.handleChange} placeholder="Eg: 12th March 2019"></input>
                            </div>
                            <div class="col-md-6 mb-3">
                                <label htmlFor="inputTax" position="left">Tax amount</label>
                                <input value={this.state.taxAmount} id="inputTax" name="taxAmount" className='form-control' type="number" min="0" onChange={this.handleChange} placeholder="Rs 1000"></input>
                            </div>

                            <button onClick={this.recordPayment} className="btn btn-primary">Record Payment</button>
                            <button onClick={this.writeVehicleDetails} className="btn btn-primary">Submit</button>


                        </div>
                    </form>
                </section>
            );
        }
        else{
            return(
            <section>
                <h2> Vehicle details here </h2>
                <div className="form-row">
                    <div class="col-md-4  mb-3">
                        <label htmlFor="drop-vehicle" position="left">Vehicle Type</label>
                        <select disabled id="drop-vehicle" onChange={this.handleSelectChange} name='type' value={this.state.type} className="custom-select">
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
                    <div class="col-md-4  mb-3">
                        <span> <label htmlFor="vrn" id="vrnUp">Vehicle Registration Number</label>
                            <i><label className="hidden" htmlFor="vrn" id="vrnDown" status={this.state.warningStatus}>Please enter as in the format specified.</label> </i> </span>
                        <input disabled value={this.state.VRN} className="form-control upper" name="VRN" type="text" id="vrn" onChange={this.handleChangeVRN} placeholder="BA 3 CHA 1234"></input>
                    </div>
                    <div class="col-md-4  mb-3">
                        <label htmlFor="companyName" position="left">Company Name</label>
                        <input disabled value={this.state.companyName} className="form-control" id="companyName" name="companyName" type="text" onChange={this.handleChange} placeholder="TVS"></input>
                    </div>
                </div>
                <form>
                    <div className="form-row">


                        <div class="col-md-3  mb-3">
                            <label htmlFor="model" position="left">Model</label>
                            <input disabled value={this.state.model} className="form-control" id="model" name="model" type="text" onChange={this.handleChange} placeholder="Eg: Apache"></input>
                        </div>
                        <div class="col-md-3  mb-3">
                            <label htmlFor="noofCyl" position="left">No of Cylinders</label>
                            <input disabled value={this.state.noofCyl} className="form-control" id="noofCyl" name="noofCyl" type="number" min="1" onChange={this.handleChange} placeholder="Eg: 1"></input>
                        </div>
                        <div class="col-md-3  mb-3">
                            <label htmlFor="hpcc" position="left">Horse Power/ CC</label>
                            <input disabled value={this.state.hpcc} className="form-control" id="hpcc" name="hpcc" type="text" onChange={this.handleChange} placeholder="Eg:200"></input>
                        </div>
                        <div class="col-md-3  mb-3">
                            <label htmlFor="vehicleColor" position="left">Vehicle Color</label>
                            <input disabled value={this.state.vehicleColor} className="form-control" id="vehicleColor" name="vehicleColor" type="text" onChange={this.handleChange} placeholder="Eg: White"></input>
                        </div>
                    </div>
                    <div class="form-row">
                        <div class="col-md-4 mb-3">
                            <label htmlFor="manDate" position="left">Year of Manufacture</label>
                            <input disabled value={this.state.manDate} className="form-control" id="manDate" name="manDate" type="number" min="2000" onChange={this.handleChange} placeholder="Eg: 2014"></input>
                        </div>
                        <div class="col-md-4 mb-3">
                            <label htmlFor="lastDate" position="left">Last Paid</label>
                            <input disabled value={this.state.lastDate} className="form-control" id="lastDate" name="lastDate" type="text" onChange={this.handleChange} placeholder="YYYY/MM/DD"></input>
                        </div>
                        {/* <div class="col-md-6 mb-3">
                            <label htmlFor="regDate" position="left">Date of Registration</label>
                            <input value={this.state.regDate} className="form-control" id="regDate" name="regDate" type="date" onChange={this.handleChange} placeholder="Eg: 7th March 2010"></input>
                        </div> */}
                        {/* THIS IS TEST CODE FOR NEPALI DATE ------ PURAK */}
                        <div class="col-md-4 mb-3">
                            <label htmlFor="regDate" position="left">Date of Registration</label>
                            <input disabled value={this.state.regDate} className="form-control" id="regDate" name="regDate" type="text" onChange={this.handleChange} placeholder="YYYY/M/DD"></input>
                        </div>
                    </div>
                    <div className="form-row">
                        <div class="col-md-3  mb-3">
                            <label htmlFor="seatCapacity" position="left">Seat Capacity</label>
                            <input disabled value={this.state.seatCapacity} className="form-control" id="seatCapacity" name="seatCapacity" type="number" min="1" onChange={this.handleChange} placeholder="Eg: 2"></input>
                        </div>
                        <div class="col-md-3  mb-3">
                            <label htmlFor="ChassisNo" position="left">Chassis No</label>
                            <input disabled value={this.state.ChassisNo} className="form-control" id="ChassisNo" name="ChassisNo" type="text" onChange={this.handleChangeVRN} placeholder="Eg: MDS236A9942P32099"></input>
                        </div>
                        <div class="col-md-3  mb-3">
                            <label htmlFor="EngineNo" position="left">Engine No</label>
                            <input disabled value={this.state.EngineNo} className="form-control" id="EngineNo" name="EngineNo" type="text" onChange={this.handleChangeVRN} placeholder="Eg: 6R9D42030456"></input>
                        </div>
                        <div class="col-md-3  mb-3">
                            <label htmlFor="drop-PD" position="left">Petrol/Diesel</label>

                            <select disabled id="drop-PD" onChange={this.handleSelectChange} name='PDtype' value={this.state.PDtype} className="custom-select">
                                <option value="Petrol">Petrol</option>
                                <option value='Diesel'>Diesel</option>
                            </select>

                        </div>
                    </div>

                    <div class="form-row">
                        <div class="col-md-6 mb-3">
                            <label htmlFor="drop-useType" position="left">Use</label>
                            <select disabled id="drop-useType" onChange={this.handleSelectChange} name='useType' value={this.state.useType} className="custom-select">
                                <option value='Private'>Private</option>
                                <option value='Rented'>Rented</option>
                                <option value='Government'>Government</option>
                            </select>
                        </div>
                        <div class="col-md-6 mb-3">
                            <label htmlFor="CustomNissa" position="left">Bhansar Nissa</label>
                            <input disabled value={this.state.CustomNissa} className="form-control" id="CustomNissa" name="CustomNissa" type="text" onChange={this.handleChange} placeholder="Eg: ME45599 2074/03/16"></input>

                        </div>
                    </div>
                    <div class="form-row">

                        <div class="col-md-6 mb-3">
                            <label htmlFor="inputDate" position="left">Due date</label>
                            <input disabled value={this.state.dueDate} className="form-control" id="inputDate" name="dueDate" type="date" onChange={this.handleChange} placeholder="Eg: 12th March 2019"></input>
                        </div>
                        <div class="col-md-6 mb-3">
                            <label htmlFor="inputTax" position="left">Tax amount</label>
                            <input disabled value={this.state.taxAmount} id="inputTax" name="taxAmount" className='form-control' type="number" min="0" onChange={this.handleChange} placeholder="Rs 1000"></input>
                        </div>

                        <button onClick={this.recordPayment} className="btn btn-primary">Record Payment</button>
                        <button onClick={this.writeVehicleDetails} className="btn btn-primary">Submit</button>


                    </div>
                </form>
            </section>
            );
        }
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
            </div>
        );
    }
}

export default Vehicle;