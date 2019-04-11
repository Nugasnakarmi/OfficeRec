import React, { Component } from 'react';
import fire from './config/fire';
import firebase from 'firebase';


class EditVehicle extends Component {
    constructor(props) {
        super(props);
        this.state = {

            email: '',
            VRN: '',

            exampleVRN: 'BA 2 PA 0000',
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
        var droplist = document.getElementById("drop-vehicle")
        var selected = droplist.selectedIndex;
        selected ? (this.setState(
            {
                exampleVRN: "BA 3 CHA 1234"
            }
        )
        )
            :
            (this.setState(
                {
                    exampleVRN: "ME 2 PA 1231"
                })

            )
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
                        if (selected === 0) {
                            vehicleRef = this.db.collection("UserBase").doc(this.state.email).collection("vehicle-tax").doc(this.state.VRN);
                            //    vehicleRef.get().then( (doc) =>{
                            //        vehiclecount= doc.data()["count"]
                            //     });
                            vehicleRef.set(
                                {
                                    amount: parseFloat(this.state.taxAmount),
                                    ['due date']: firebase.firestore.Timestamp.fromDate(new Date(this.state.dueDate)),
                                    type: "2 wheeler",
                                    VRN: this.state.VRN
                                }, { merge: true }
                            ).then(() => { window.alert("updated successfully") }).catch((error) => { window.alert(error.message) });

                        }
                        else {
                            console.log("4 wheeler");
                            vehicleRef = this.db.collection("UserBase").doc(this.state.email).collection("vehicle-tax").doc(this.state.VRN);
                            vehicleRef.set({
                                amount: parseFloat(this.state.taxAmount),
                                ['due date']: firebase.firestore.Timestamp.fromDate(new Date(this.state.dueDate)),
                                type: "4 wheeler",
                                VRN: this.state.VRN
                            }, { merge: true }).then(() => { window.alert("updated successfully") }).catch((error) => { window.alert(error.message) });;
                        }
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
        if( !this.state.email )
        {
            this.setState({
                email : this.props.user
            })
        }
        return (

            <section>
                <h2> Vehicle details here </h2>
                <div className="form-group">
                    <label htmlFor="drop-vehicle" position="left">Vehicle Type</label>
                    <select id="drop-vehicle" onChange={this.handleSelectChange} className="custom-select">
                        <option> two-wheeler</option>
                        <option> four-wheeler</option>
                    </select>
                </div>
                <form>
                    <div className="form-group">
                        <span> <label htmlFor="vrn" id="vrnUp">Vehicle Registration Number</label>
                            <i><label className="hidden" htmlFor="vrn" id="vrnDown" status={this.state.warningStatus}>Please enter as in the format specified.</label> </i> </span>
                        <input value={this.state.VRN} className="form-control upper" name="VRN" type="text" id="vrn" onChange={this.handleChangeVRN} placeholder={this.state.exampleVRN}></input>

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