import React, { Component } from 'react';
import Land from './Land';
import Vehicle from './Vehicle';
import Income from './Income';
import fire from './config/fire';
import House from './House';
//import fixDate from './FixDate';
//import { throws } from 'assert';

class Details extends Component {
    constructor(props) {
        super(props);
        this.taxTypes = ['land-tax', 'vehicle-tax', 'income-tax', 'house-tax'];
        this.dataObject = {};
        this.getSubcollections = this.getSubcollections.bind(this);
        this.filterData = this.filterData.bind(this);
        this.landData = [];
        this.vehicleData = [];
        this.incomeData = [];
        this.houseData = [];
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
            var fullPath = 'UserBase/' + this.props.user + '/' + passedCollection
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
        this.incomeData = [];
        this.houseData = [];
        if (this.dataObject) {

            for (let key in this.dataObject) {
                console.log("key", key);
                if (key.includes('land-tax')) {
                    this.landData.push(this.dataObject[key]);
                }
                else if (key.includes('vehicle-tax')) {
                    this.vehicleData.push(this.dataObject[key]);
                }
                else if (key.includes('income-tax')) {
                    this.incomeData.push(this.dataObject[key]);
                }
                else if (key.includes('house-tax')) {
                    this.houseData.push(this.dataObject[key]);
                }
            }
            this.setState({ loaded: !this.state.loaded });
            //console.log('LandData', this.landData);
            //console.log('VehicleData', this.vehicleData);
            //console.log('IncomeData', this.incomeData);
            // console.table("LandData", this.landData);
        }
    }

    render() {
        console.log("Render starts");
        if (this.landData && this.vehicleData && this.incomeData) {
            console.log('LandData', this.landData);
            console.log('VehicleData', this.vehicleData);
            console.log('IncomeData', this.incomeData);
        }
        // let renderLand = (this.landData.length) ? <Land details={this.landData} /> : '';
        // let renderVehicle = (this.vehicleData.length) ? <Vehicle details={this.vehicleData} /> : '';
        // let renderIncome = (this.incomeData.length) ? <Income details={this.landData} /> : '';
        console.log('loaded?', this.state.loaded);
        return (<div className = "container">
            <h2 style = {{margin : '15px'}}>The Details Pane</h2>
            {this.landData.length ? this.landData.map((item) => (<Land details={item} />)) : ''}
            {this.vehicleData.length ? this.vehicleData.map((item) => (<Vehicle details={item} />)) : ''}
            {this.incomeData.length ?   this.incomeData.map((item) => (<Income details={item} />)) : ''}
            {this.houseData.length ?   this.houseData.map((item) => (<House details={item} />)) : ''}
            {/* {renderLand}
            {renderVehicle}
            {renderIncome} */}
        </div>);
    }
}

export default Details;