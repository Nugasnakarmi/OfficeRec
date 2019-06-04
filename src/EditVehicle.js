import React, { Component } from 'react';
import fire from './config/fire';
import firebase from 'firebase';
import adbs from 'ad-bs-converter';
import {
    Spinner
} from 'reactstrap';
import { Accordion, Card } from 'react-bootstrap'
import Vehicle from './Vehicle';

class EditVehicle extends Component {
    constructor(props) {
        super(props);
        this.state = {
            email: '',
            VRN: '',
            type: '',
            companyName:'',
            model:'',
            noofCyl:'',
            hpcc: '',
            vehicleColor:'',
            manDate:'',
            regDate: '',
            lastDate: '',
            seatCapacity:'',
            ChassisNo:'',
            EngineNo:'',
            PDtype:'',
            useType:'',
            CustomNissa:'',
            dueDate:'',
            taxAmount:'',
            warningStatus: 'inactive'
        };
        this.db = fire.firestore();

        this.handleChange = this.handleChange.bind(this);
        this.handleChangeVRN = this.handleChangeVRN.bind(this);
        this.handleSelectChange = this.handleSelectChange.bind(this);
        this.setVehicleType = this.setVehicleType.bind(this);
        this.recordPayment = this.recordPayment.bind(this);
        this.writeVehicleDetails = this.writeVehicleDetails.bind(this);

        this.itemList = [];
        this.displayText = [];
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

    handleSelectChange(e){
        this.setVehicleType(e).then(() => {
            console.log("TYPE OF VEHICLE", this.state.type);
        }).catch((error) => console.log(error));
    }

    // calculateTax(){
    //     if (this.state.email){
    //         userRef = this.db.collection("TaxRate").doc('VehicleTax').get().then((doc) => {
    //             if (doc.data()) {
            
    //     }
    // }

    recordPayment(e) {
        e.preventDefault();
        let today = new Date(); //todays date object
        //console.log(today);
        console.log('regdate', this.state.regDate); //input reg date
        console.log('last payment', this.state.lastDate); //input date of last payment
        let todayString = [today.getFullYear(),today.getMonth()+1, today.getDate()].join('/');  //string of date delimited by /
        let todayBS = adbs.ad2bs(todayString);  //todays date in BS
        console.log('paid today', todayBS);
        var regDateArr = this.state.regDate.split('/').map(function (str) {
            return Number(str);
        });
        var regDateObj = { year: regDateArr[0], month: regDateArr[1], day: regDateArr[2] }; //object of registered date
        
        var lastDateArr = this.state.lastDate.split('/').map(function (str) {
            return Number(str);
        });
        var lastDateObj = { year: lastDateArr[0], month: lastDateArr[1], day: lastDateArr[2] }; //object of last paid date
    
        var due = {...regDateObj, year: lastDateObj.year+1, day: regDateObj.day-1}; //due date in key:value pair
        console.log("Due date is", due);
        
        //english due date
        let engDue = adbs.bs2ad([due.year, due.month, due.day].join('/'));
        //console.log("ENGDUE", engDue);
        let dueDateAD = new Date([engDue.year, engDue.month, engDue.day].join ('/'));
        console.log("Due date in AD", dueDateAD);

        //Overdue Calculation
        if (dueDateAD < today){
            let dueYears = [];
            let unpaidNo = todayBS.en.year - due.year;
            let dueThisYearBS = {...regDateObj, year: todayBS.en.year};
            let dueThisYearAD = adbs.bs2ad([dueThisYearBS.year, dueThisYearBS.month, dueThisYearBS.day].join('/')); //This year's due date in string form
            let dueThisYear = new Date([dueThisYearAD.year, dueThisYearAD.month, dueThisYearAD.day].join ('/')); //Due date of this year
            console.log("Due date for this year is ", dueThisYear);
            let additionalYear = (dueThisYear < today) ? 1 : 0; //to compensate if current month is beyond due date for this year
            console.log(`overdue by ${unpaidNo} years`);
            for (let i = 0; i < unpaidNo + additionalYear; i++){
                let dueYear = due.year + i;
                let yearString = dueYear.toString().substr(-2) + '-' + (dueYear + 1).toString().substr(-2);
                dueYears.push(yearString);
            }
            console.log(`unpaid years: ${dueYears}`);
            console.log("Due date exceeded!!!!!!!!!!!");
        }
        else{
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

                                //TESTING BY PURAK, REMOVE COMMENT LATER
                                // ['registered date']: firebase.firestore.Timestamp.fromDate(new Date(this.state.regDate)),
                                ['registered date']: this.state.regDate,
                                ['due date']: firebase.firestore.Timestamp.fromDate(new Date(this.state.dueDate)),
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
                                ['Bhansar ko Nissa']: this.state.CustomNissa



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

    componentDidMount(){
        let totalRecords  = 0;
        //let idList = [];
        var landRef = this.db.collection("UserBase").doc(this.props.user).collection("vehicle-tax");
        landRef.get().then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
                this.countItem++;
                console.log(doc.id, " => ", doc.data());
                this.itemList.push({ ...doc.data(), id: doc.id });
                //idList.push(parseFloat(doc.id));
            });
        }).then(() => {
            //console.clear();
            console.log("NO of property", this.countItem);
            console.log("The list", this.itemList);
            //this.maxID = Math.max(...idList);
            this.itemList.map((item, index) => {
                this.displayText.push(<Card>
                    <Accordion.Toggle as={Card.Header} eventKey={index}>
                        {item.id}
                    </Accordion.Toggle>
                    <Accordion.Collapse eventKey={index}>
                        <Card.Body>
                            <Vehicle user={this.props.user} details={item} isAdmin={this.props.isAdmin} refresh={this.toggleUpdate} />
                        </Card.Body>
                    </Accordion.Collapse>
                </Card>)
                totalRecords++;
            })
            if (this.props.isAdmin){
                this.displayText.push(<Card>
                    <Accordion.Toggle as={Card.Header} eventKey={totalRecords}>
                        <b>Add Record</b>
                    </Accordion.Toggle>
                    <Accordion.Collapse eventKey={totalRecords}>
                        <Card.Body>
                            <Vehicle addNew = {true} user={this.props.user} details={null} isAdmin={this.props.isAdmin} refresh={this.toggleUpdate} />
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
        return (
           

            <Accordion defaultActiveKey="0">
                {this.state.loaded ? (this.displayText) : <Spinner color="info" />}
            </Accordion>
        )

    }




}
export default EditVehicle;