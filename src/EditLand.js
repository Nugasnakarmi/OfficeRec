import React, { Component } from 'react';
import fire from './config/fire';
import firebase from 'firebase';
import {
    Spinner
} from 'reactstrap';
import { Accordion, Card, Button } from 'react-bootstrap';
import Land from './Land';

class EditLand extends Component {
    constructor(props) {
        super(props);
        this.state = {

            email: '',
            warningStatus: 'inactive',
            landCat: 1,
            currentYear: "75-76",
            
            area: 0,
            taxVisible: false,
            taxAmountLand: 0,
            Aana: 31.79,
            taxRate: 0,

            loaded: false,
            updated: false
        };
        this.db = fire.firestore();

        this.handleChange = this.handleChange.bind(this);
        this.handleSelectChange = this.handleSelectChange.bind(this);
        this.writeLandDetails = this.writeLandDetails.bind(this);
        this.implementCategory = this.implementCategory.bind(this);
        this.getlandTax = this.getlandTax.bind(this);
        this.handleAreaChange = this.handleAreaChange.bind(this);
        this.showLandTax = this.showLandTax.bind(this);
        this.toggleUpdate = this.toggleUpdate.bind(this);

        this.countItem = 0;
        this.itemList = [];
        this.displayText = [];
    }
    handleChange = e => this.setState({ [e.target.name]: e.target.value });
    handleAreaChange = e => {
        this.getlandTax();
        this.setState({ [e.target.name]: e.target.value });

    }

    implementCategory = e => {
        return new Promise((resolve, reject) => {
            this.setState({ landCat: e.target.value });
            resolve(this.state.landCat);
        });

        //this.getValuation();
        // this.getPropertyTax();

    }

    handleSelectChange(e) {
        this.implementCategory(e).then(this.getlandTax);
    }
    // handleSelectChange(e) {
    //     this.setState({ [e.target.name]: e.target.value });
    // }

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

    toggleUpdate() {
        this.setState({
            updated: !this.state.updated
        });
    }

    writeLandDetails(e) {
        e.preventDefault();
        var landRef;
        var query;
        var count = 0;
        var docCount = 0;
        var updateCount;
        var userRef;
        // var fullPath = "UserBase/" + this.state.email + "/land-tax";
        landRef = this.db.collection("UserBase").doc(this.state.email).collection("land-tax");

        if (this.state.email) {
            userRef = this.db.collection("UserBase").doc(this.state.email).get().then((doc) => {
                if (doc.data()) {
                    query = landRef
                        .where("kittaId", "==", parseFloat(this.state.kittaId))
                        .where("Location.ward", "==", parseFloat(this.state.ward))
                        .where("Location.municipality", "==", this.state.municipality)
                        .where("Location.province", "==", this.state.province)
                        .where("Location.district", "==", this.state.district)
                        ;
                    console.log(query);
                    // 
                    query
                        .get()
                        .then(function (querySnapshot) {


                            querySnapshot.forEach(function (doc) {
                                docCount++;
                                // doc.data() is never undefined for query doc snapshots
                                console.log(doc.id, " => ", doc.data());
                                // if(updateCount < parseFloat(doc.id) ){
                                //     updateCount = parseFloat(doc.id)
                                // };
                                updateCount = doc.id;
                            });
                        }).then(() => {
                            landRef.get().then((sd) => {
                                sd.forEach((doc) => {

                                    console.log(doc.id, " =>", doc.data())
                                    if (count < parseFloat(doc.id)) {
                                        count = parseFloat(doc.id)
                                    };
                                });
                            }).then(() => {
                                if (docCount === 0) {
                                    landRef.doc((parseFloat(count) + 1).toString()).set({
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
                                        ['due date']: firebase.firestore.Timestamp.fromDate(new Date(this.state.dueDateLand))

                                    }, { merge: true });
                                    window.alert("data added successfully");
                                }
                                else {
                                    landRef.doc(updateCount.toString()).set({
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
                                        ['due date']: firebase.firestore.Timestamp.fromDate(new Date(this.state.dueDateLand))

                                    }, { merge: true });
                                    window.alert("data updated");
                                }
                            });
                        }).catch(function (error) {
                            console.log("Error getting documents: ", error);
                        });
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
        var landRef = this.db.collection("UserBase").doc(this.props.user).collection("land-tax");
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
            // if(!this.itemList ){
            //     this.maxID = Math.max(...idList);
            // }
            // else{
            //     this.maxID = 0
            // }
            this.maxID = Math.max(...idList);
            this.itemList.map((item, index) => {
                this.displayText.push(<Card>
                    <Accordion.Toggle as={Card.Header} eventKey={index}>
                        {item.id}: {item.Location.province}/{item.Location.district}/{item.Location.municipality}
                    </Accordion.Toggle>
                    <Accordion.Collapse eventKey={index}>
                        <Card.Body>
                            <Land user={this.props.user} details={item} isAdmin={this.props.isAdmin} refresh={this.toggleUpdate} />
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
                            <Land addNew = {true} user={this.props.user}  maxID = {this.maxID} details={null} isAdmin={this.props.isAdmin} refresh={this.toggleUpdate} />
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

export default EditLand;
