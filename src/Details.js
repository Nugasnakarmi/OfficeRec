import React, { Component } from 'react';
import Land from './Land';
import Vehicle from './Vehicle';
import Business from './Business';
import fire from './config/fire';
import House from './House';
import Bahal from './Bahal';
//import fixDate from './FixDate';
//import { throws } from 'assert';

class Details extends Component {
    constructor(props) {
        super(props);
        this.taxTypes = ['land-tax', 'vehicle-tax', 'business-tax', 'house-tax', 'rent-tax'];
        this.dataObject = {};
        this.getSubcollections = this.getSubcollections.bind(this);
        this.filterData = this.filterData.bind(this);
        this.landData = [];
        this.vehicleData = [];
        this.businessData = [];
        this.houseData = [];
        this.rentData = [];
        this.state = { loaded: false };
    }

    UNSAFE_componentWillMount() {
        //GETS THE SUBCOLLECTIONS (added by Purak) (Code under construction)
        this.db = fire.firestore();
        for (var collectionName of this.taxTypes) {
            this.getSubcollections(collectionName);
        }
        console.log("All collections names passed");
        //this.taxTypes.forEach(this.getSubcollections);
        //console.log("the taxlist", this.taxTypes);
    }

    getSubcollections(passedCollection) {
        if (this.props.user) {
            console.log('GetSubCollection runs for', passedCollection);
            var fullPath = 'UserBase/' + this.props.user + '/' + passedCollection;
            this.db.collection(fullPath).get().then((subdoc) => {
                let itemNumber = 1;
                subdoc.forEach((sd) => {
                    var itemName = passedCollection + itemNumber;
                    //console.log("ItemName", itemName);
                    //console.log(sd.data());
                    //this.taxTypes.passedCollection = sd.data();
                    this.dataObject[itemName] = sd.data();
                    itemNumber++;
                });
            }).then(this.filterData);
        }
    }

    filterData() {
        //console.log('Data fetched from userbase', this.dataObject);
        console.log('Data fetched from userbase', this.dataObject);
        this.landData = [];
        this.vehicleData = [];
        this.businessData = [];
        this.houseData = [];
        this.rentData = [];
        if (this.dataObject) {

            for (let key in this.dataObject) {
                console.log("key", key);
                if (key.includes('land-tax')) {
                    this.landData.push(this.dataObject[key]);
                }
                else if (key.includes('vehicle-tax')) {
                    this.vehicleData.push(this.dataObject[key]);
                }
                else if (key.includes('business-tax')) {
                    this.businessData.push(this.dataObject[key]);
                }
                else if (key.includes('house-tax')) {
                    this.houseData.push(this.dataObject[key]);
                }
                else if (key.includes('rent-tax')) {
                    this.rentData.push(this.dataObject[key]);
                }
            }
            this.setState({ loaded: !this.state.loaded });
            //console.log('LandData', this.landData);
            //console.log('VehicleData', this.vehicleData);
            //console.log('BusinessData', this.businessData);
            // console.table("LandData", this.landData);
        }
    }

    render() {
        console.log("Render starts");
        if (this.landData && this.vehicleData && this.businessData) {
            console.log('LandData', this.landData);
            console.log('VehicleData', this.vehicleData);
            console.log('BusinessData', this.businessData);
        }
        // let renderLand = (this.landData.length) ? <Land details={this.landData} /> : '';
        // let renderVehicle = (this.vehicleData.length) ? <Vehicle details={this.vehicleData} /> : '';
        // let renderBusiness = (this.businessData.length) ? <Business details={this.landData} /> : '';
        console.log('loaded?', this.state.loaded);
        return (<div className="container" style={{ 'margin-top': '70px' }}>
            {/* <h2 style = {{margin : '15px'}}>The Details Pane</h2> */}
            {this.landData.length ? this.landData.map((item) => (<Land details={item} isAdmin = {this.props.isAdmin}/>)) : ''}
            {this.vehicleData.length ? this.vehicleData.map((item) => (<Vehicle details={item} isAdmin = {this.props.isAdmin} />)) : ''}
            {this.businessData.length ? this.businessData.map((item) => (<Business details={item} isAdmin = {this.props.isAdmin}/>)) : ''}
            {this.houseData.length ? this.houseData.map((item) => (<House details={item} isAdmin = {this.props.isAdmin}/>)) : ''}
            {this.rentData.length ? this.rentData.map((item) => (<Bahal details={item} isAdmin = {this.props.isAdmin}/>)) : ''}
            {/* {renderLand}
            {renderVehicle}
            {renderBusiness} */}
        </div>);
    }
}

export default Details;