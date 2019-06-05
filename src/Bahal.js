import React, { Component } from 'react';
import './detailscontent.css';
import fixDate from './FixDate';
import { Form, Row, Col, Button, ButtonToolbar, Modal } from 'react-bootstrap';
import fire from './config/fire';
import firebase from 'firebase';
import adbs from 'ad-bs-converter';
import {
    Alert, Card, CardHeader, CardFooter, CardBody,
    CardTitle, CardText
} from 'reactstrap';

class Bahal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loaded: false,
            landPrice: this.props.details ? this.props.details.landPrice : 0,
            housePrice: this.props.details ? this.props.details.housePrice : 0,
            coefficient: this.props.details ? this.props.details.housePrice : 'c1',
            use: this.props.details ? this.props.details.use : '0',
            agreedPrice: this.props.details ? this.props.details.agreedPrice : 0,
            editable: this.props.addNew ? true : false,
            province: this.props.details ? this.props.details.Location.province : '',
            district: this.props.details ? this.props.details.Location.district : '',
            municipality: this.props.details ? this.props.details.Location.municipality : '',
            ward: this.props.details ? this.props.details.Location.ward : '',
            area: this.props.details ? this.props.details.area : '',
            taxAmount: this.props.details ? this.props.details.taxAmount : '',
            dueDate: this.props.details ? this.props.details['due date'] : '',
            regDate: this.props.details ? this.props.details.regDate : '',
            lastDate: this.props.details ? this.props.details.lastDate : '',
            warningStatus: 'inactive',
            taxVisible: false,
            taxAmount: this.props.details ? this.props.details.taxAmount : '',
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

        this.handleAreaChange = this.handleAreaChange.bind(this);

        this.save = this.save.bind(this);
        this.delete = this.delete.bind(this);
        this.recordPayment = this.recordPayment.bind(this);
        this.handleShow = this.handleShow.bind(this);
        this.handleClose = this.handleClose.bind(this);
        this.getRentTax = this.getRentTax.bind(this);
        this.onDismiss = this.onDismiss.bind(this);


        this.editButton = [<ButtonToolbar  ><Button variant="warning" onClick={this.edit}>Edit</Button>, <Button variant="warning" onClick={this.recordPayment}>Record Payment</Button>, <Button variant="danger" onClick={this.handleShow}>Delete</Button> </ButtonToolbar>]
        this.saveButton = [<ButtonToolbar><Button variant="success" onClick={this.save}>Save</Button>, <Button variant="light" onClick={this.cancel}>Cancel</Button></ButtonToolbar>]
        this.c1 = [0.2, 0.3, 0.35, 0.4, 0.5, 0.75];
        this.c2 = [0.2, 0.25, 0.3, 0.35, 0.4, 0.5];

        this.db = fire.firestore();
        this.today = new Date(); //todays date object
        this.todayString = [this.today.getFullYear(), this.today.getMonth() + 1, this.today.getDate()].join('/');  //string of date delimited by /
        this.todayBS = adbs.ad2bs(this.todayString);  //todays date in BS
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
            this.setState({ [e.target.name]: e.target.value });
            resolve();
        });
    }

    handleSelectChange = (e) => {
        this.implementCategory(e).then(this.getRentTax);
    }

    recordPayment = (e) => {
        e.preventDefault();

        this.setState({
            lastDate: [this.todayBS.en.year, this.todayBS.en.month, this.todayBS.en.day].join('/')
            //also set a new due date
        });
        this.db.collection("UserBase").doc(this.props.user).collection("rent-tax").doc(this.props.details.id).set({
            //['due date']: this.state.dueDateLand,
            lastDate: this.state.lastDate
        }).then(() => {
            window.alert("Success!");
            // this.props.refresh();
        }).catch((error) => {
            window.alert("Error: ", error);
        });
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

    save = (e) => {
        e.preventDefault();
        let writeID = this.props.addNew ? (this.props.maxID + 1).toString() : this.props.details.id;
        console.log("WriteID", writeID);
        this.db.collection("UserBase").doc(this.props.user).collection("rent-tax").doc(writeID).set({
            Location: {
                province: this.state.province,
                district: this.state.district,
                municipality: this.state.municipality,
                ward: parseFloat(this.state.ward)
            },
            houseno: this.state.houseno,
            agreedPrice: this.state.agreedPrice,
            
            taxAmount: parseFloat(this.state.taxAmount),
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

    delete = (e) => {
        e.preventDefault();
        if (this.state.inputID === this.props.user) {
            this.db.collection("UserBase").doc(this.props.user).collection("rent-tax").doc(this.props.details.id).delete().then(() => {
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
    onDismiss = (e) => {
        this.setState({ taxVisible: false });
    }

    getRentTax() {
        var C = this.state.coefficient;
        var percent = 0.01;
        console.log("COEFFFFFF", this.c1[parseFloat(this.state.use)]);
        var taxAmountcoeff;
        if (this.state.coefficient === "c1"
        ) { taxAmountcoeff = (parseFloat(this.state.landPrice) / 100000 + parseFloat(this.state.housePrice) / 100) * this.c1[this.state.use] }
        else if (this.state.coefficient === 'c2') { taxAmountcoeff = (parseFloat(this.state.landPrice) / 100000 + parseFloat(this.state.housePrice) / 100) * this.c2[this.state.use] }
        
        let taxAmount = Math.max(taxAmountcoeff *parseFloat(this.state.area)*12 *10*percent, this.state.agreedPrice * 10 * percent * 12);
        console.log("Rent tax is", taxAmount)
        this.setState({
            taxAmount : taxAmount,
            taxVisible: true
        })
    };



    renderForm(isEditable) {
        return (<section>
            <label htmlFor="inputHouseLocation">Enter Location</label>
            <div class="form-row" id="inputHouseLocation">
                <div class="col-md-3 mb-3">
                    <input disabled={isEditable ? "" : "disabled"} value={this.state.province} id="inputprovince" name="province" className="form-control" type="text" onChange={this.handleChange} placeholder=" Province"></input>
                </div>
                <div class="col-md-3 mb-3">
                    <input disabled={isEditable ? "" : "disabled"} value={this.state.district} id="inputdistrict" name="district" className="form-control" type="text" onChange={this.handleChange} placeholder=" District "></input>
                </div>
                <div class="col-md-3 mb-3">
                    <input disabled={isEditable ? "" : "disabled"} value={this.state.municipality} id="inputmuni" name="municipality" className="form-control" type="text" onChange={this.handleChange} placeholder=" Municipality"></input>
                </div>
                <div class="col-md-3 mb-3">
                    <input disabled={isEditable ? "" : "disabled"} value={this.state.ward} id="inputward" name="ward" type="number" className="form-control" min="1" onChange={this.handleChange} placeholder=" Ward"></input>
                </div>
            </div>
            <div className='form-row'>
                <div className="col-md-6 mb-3">
                    <label htmlFor="houseno">House number</label>
                    <input disabled={isEditable ? "" : "disabled"} value={this.state.houseno} id="houseno" name="houseno" type="number" className="form-control" onChange={this.handleChange} placeholder="Eg: house number"></input>
                </div>
                <div className="col-md-3 mb-3">
                    <label htmlFor="agreedPrice">Rent As Per Contract</label>
                    <input disabled={isEditable ? "" : "disabled"} value={this.state.agreedPrice} id="agreedPrice" name="agreedPrice" type="number" className="form-control" onChange={this.handleChange} placeholder="in NPR."></input>
                </div>
                <div className="col-md-3 mb-3">
                    <label htmlFor="agreedPrice">Total Area Rented</label>
                    <input disabled={isEditable ? "" : "disabled"} value={this.state.area} id="area" name="area" type="number" min = '0' className="form-control" onChange={this.handleSelectChange} placeholder="in sqft."></input>
                </div>
            </div>
            <div className='form-row'>
                <div className="col-md-3 sm-4">
                    <label htmlFor="use" position="left">Use</label>
                    <select disabled={this.state.editable ? "" : "disabled"} id="use" onChange={this.handleSelectChange} name='use' value={this.state.use} className="custom-select">
                        <optgroup label='Residential'>
                            <option value='0'>Floor Area</option>
                            <option value='1'>Carpet Area</option>
                        </optgroup>
                        <optgroup label='Office'>
                            <option value='2'>Floor Area</option>
                            <option value='3'>Carpet Area</option>
                        </optgroup>
                        <optgroup label='Business'>
                            <option value='4'>Floor Area</option>
                            <option value='5'>Carpet Area</option>
                        </optgroup>
                    </select>
                </div>
                <div className="col-md-3 sm-4">
                    <label htmlFor="landPrice">Rate of Land per Aana</label>
                    <input disabled={isEditable ? "" : "disabled"} value={this.state.landPrice} id="landPrice" name="landPrice" type="number" className="form-control" onChange={this.handleSelectChange} placeholder="in NPR."></input>
                </div>
                <div className="col-md-3 sm-4">
                    <label htmlFor="housePrice">Rate of House per sq.ft.</label>
                    <input disabled={isEditable ? "" : "disabled"} value={this.state.housePrice} id="housePrice" name="housePrice" type="number" className="form-control" onChange={this.handleSelectChange} placeholder="in NPR."></input>
                </div>
                <div className="col-md-3 sm-4">
                    <label htmlFor="coefficient" position="left">Coefficient</label>
                    <select disabled={this.state.editable ? "" : "disabled"} id="coefficient" onChange={this.handleSelectChange} name='coefficient' value={this.state.coefficient} className="custom-select">
                        <option value='c1'>c1</option>
                        <option value='c2'>c2</option>
                    </select>
                </div>

            </div>
            <button onClick={this.getRentTax} className="btn btn-primary">Get Rent Tax</button>
            {/* {this.getRentTax()} */}
            <Alert style={{ width: "100%" }} color="info" isOpen={this.taxVisible} toggle={this.onDismiss}>
                <p>Rent tax yearly : NRs.{this.state.taxAmount}</p>
            </Alert>
            <div className="col-md-12 mb-12">
                <Alert style={{ width: "100%" }} color="info" isOpen={true} toggle={this.onDismiss}>

                    <p>USE C1 FOR:<br /> सिंहदरवार – माइतीघर – थापाथली – त्रिपुरेश्वर; त्रिपुरेश्वर – सुन्धारा – खिचापोखरी – रणमुक्तेश्वर – पुरानो महानगरपालिका (सिद्धिचरण चोक) – दमकल – बसन्तपुर – हनुमानढोका – सुरज आर्केड – आकाश भैरब – जुद्धशालिक –न्युरोड गेट – भोंसिको – महाबौद्ध – वीर अस्पताल –कान्तिपथ); भोटाहिटी – असन चोक – कमलाक्षी; सुन्धाराबाट कान्तिपथ उत्तरतर्फ केशरमहल – त्रिदेबी मार्ग – नर्सिङ्ग चोक – जे.पी चोक – मनाङ्ग होटल – सोह्रखुट्टे उकालो – लेखनाथ मार्ग – नेपाल स्काउट चोक – केशर महल; केशर महल –नारायणहिटीको संग्राहालयको दक्षिण – दरबार मार्ग (महेन्द्र सालिक) – कृष्ण पाउरोटी चोक – पुतलीसडक – सिंहदरबार; रत्नपार्क – बागबजार – पुतलीसडक चोक, माइतीघर–नयाँबानेश्वर–तिनकुने–कोटेश्वर हुँदै बालकुमारी पुल, तिनकुने–सिनामगल–गौशाला–चावहिल–बौद्ध जोरपाटी सिमानासम्म, लैनचौर–लाजिम्पाट–पानिपोखरी–महाराजगञ्ज–बाँसबारी सिमानासम्म, सोह्रखुट्टे ओरालो–बालाजु चोक–बाइसधारा– बाइपास हुँदै माछापोखरीसम्म, सानेपा पुल– बल्खु–कलंकी–स्वयम्भु–बालाजु–गोंगबु चोक– महाराजगञ्ज नारायणगोपाल चोक–हुँदै चावहिल चोकसम्म, त्रिपुरेश्वर–टेकु– कालिमाटी–रविभवन हुँदै–कलंकी, काललिमाटी–बल्खु हुँदै सडकको दाँयाबाँया जोडिएका क्षेत्रहरू।
                         </p>
                    <p>USE C2 FOR: अन्य क्षेत्रहरू।
                         </p>

                </Alert>
            </div>
        </section>
        );
    }


    componentDidMount() {
        this.baseState = { ...this.state, loaded: true };
    }

    render() {
        return (
            // <div className="item-box">
            <div align="center">
                <Card className="popupCards">
                    <CardHeader style={{ backgroundColor: "#2D93AD", color: "aliceblue" }} tag="h4"> Rent details </CardHeader>


                    <CardBody>
                        {this.renderForm(this.state.editable)}

                        {this.props.isAdmin ? this.state.editable ? this.saveButton : this.editButton : null}

                    </CardBody>
                </Card>
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
            </div>);
    }
}

export default Bahal;