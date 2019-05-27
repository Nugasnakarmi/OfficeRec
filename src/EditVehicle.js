import React, { Component } from 'react';
import fire from './config/fire';
import firebase from 'firebase';


class EditVehicle extends Component {
    constructor(props) {
        super(props);
        this.state = {

            email: '',
            VRN: '',
            type: '',
            
            warningStatus: 'inactive'
        };
        this.db = fire.firestore();

        this.handleChange = this.handleChange.bind(this);
        this.handleChangeVRN = this.handleChangeVRN.bind(this);
        this.handleSelectChange = this.handleSelectChange.bind(this);

        this.writeVehicleDetails = this.writeVehicleDetails.bind(this);
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

    handleSelectChange(e) {

        this.setState({ [e.target.name]: e.target.value });
        // console.log("Vehicle type chosen", this.state.type);
    }
    writeVehicleDetails(e) {
        e.preventDefault();
        var userRef;
        if (this.state.email) {
            var droplist = document.getElementById("drop-vehicle")
            
            var selected = droplist.selectedIndex;
            // var vehiclecount;
            var vehicleRef;
            var re = /^[a-z]{2} [1-9]{1,2} [a-z]{2,3} [0-9]{1,4}$/i;
            var test = re.test(this.state.VRN);
            console.log(test);
            userRef = this.db.collection("UserBase").doc(this.state.email).get().then((doc) => {
                if (doc.data()) {
                    if (test) {
                        this.setState({ warningStatus: "inactive" })
                        vehicleRef = this.db.collection("UserBase").doc(this.state.email).collection("vehicle-tax").doc(this.state.VRN);
                        vehicleRef.set(
                            {
                                amount: parseFloat(this.state.taxAmount),
                                ['registered date']: firebase.firestore.Timestamp.fromDate(new Date(this.state.regDate)),
                                ['due date']: firebase.firestore.Timestamp.fromDate(new Date(this.state.dueDate)),
                                type: this.state.type,
                                VRN: this.state.VRN,
                                companyName: this.state.companyName,
                                model: this.state.model,
                                ['Year of Manufacture']: this.state.manDate,
                               
                                ['No of Cylinders']: this.state.noofCyl,
                                ChassisNo : this.state.ChassisNo,
                                EngineNo :this.state.EngineNo,
                                ['HorsePower/CC']: this.state.hpcc,
                                vehicleColor:this.state.vehicleColor,
                                seatCapacity:this.state.seatCapacity,
                                Use: this.state.useType,
                                ['Petrol/Diesel']: this.state.PDtype,
                                ['Bhansar ko Nissa'] :this.state.CustomNissa


                        
                            }//, { merge: true }
                        ).then(() => { window.alert("updated successfully") }).catch((error) => { window.alert(error.message) });
                        console.log(doc.data())
                    }
                    else {
                        //document.getElementById("vrnDown").innerHTML = "Please correct format for VRN";
                        this.setState({
                            warningStatus: 'active'
                        });
                        // window.alert("Please put spaces as specified for VRN ")
                    }



                }
                else {
                    window.alert("User does not exist");
                }
            })
            console.log(selected + 1);


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
                            <input value={this.state.noofCyl} className="form-control" id="noofCyl" name="noofCyl" type="number" min ="1" onChange={this.handleChange} placeholder="Eg: 1"></input>
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
                        <div class="col-md-6 mb-3">
                            <label htmlFor="manDate" position="left">Year of Manufacture</label>
                            <input value={this.state.manDate} className="form-control" id="manDate" name="manDate" type="number" min="2000" onChange={this.handleChange} placeholder="Eg: 2014"></input>
                        </div>
                        <div class="col-md-6 mb-3">
                            <label htmlFor="regDate" position="left">Date of Registration</label>
                            <input value={this.state.regDate} className="form-control" id="regDate" name="regDate" type="date" onChange={this.handleChange} placeholder="Eg: 7th March 2010"></input>
                        </div>
                    </div>
                    <div className="form-row">


                        <div class="col-md-3  mb-3">
                            <label htmlFor="seatCapacity" position="left">Seat Capacity</label>
                            <input value={this.state.seatCapacity} className="form-control" id="seatCapacity" name="seatCapacity" type="number" min ="1" onChange={this.handleChange} placeholder="Eg: 2"></input>
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
                                <option>Petrol</option>
                                <option>Diesel</option>
                            </select>
                            
                        </div>
                    </div>

                    <div class="form-row">
                        <div class="col-md-6 mb-3">
                            <label htmlFor="drop-useType" position="left">Use</label>
                            <select id="drop-useType" onChange={this.handleSelectChange} name='useType' value={this.state.useType} className="custom-select">
                                <option>Private</option>
                                <option>Public</option>
                                <option>Government</option>
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

                        <button onClick={this.writeVehicleDetails} className="btn btn-primary">Submit</button>


                    </div>
                </form>
            </section>


        )

    }




}
export default EditVehicle;