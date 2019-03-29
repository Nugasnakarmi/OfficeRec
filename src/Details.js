import React, { Component } from 'react';
import Land from './Land';
import Vehicle from './Vehicle';
import fire from './config/fire';
import fixDate from './FixDate';

class Details extends Component {
    constructor(props) {
        super(props);
        this.taxTypes = ['land-tax', 'vehicle-tax', 'income-tax'];
        this.dataObject = {};
        this.getSubcollections = this.getSubcollections.bind(this);
        this.landData = [];
        this.vehicleData = [];
        this.incomeData = [];
        this.state = {}
    }

    componentDidMount() {
        //GETS THE SUBCOLLECTIONS (added by Purak) (Code under construction)
        this.db = fire.firestore();
        for (var collectionName of this.taxTypes) {
            this.getSubcollections(collectionName);
        }
        //this.taxTypes.forEach(this.getSubcollections);
        //console.log("the taxlist", this.taxTypes);
    }

    getSubcollections(passedCollection) {
        if (this.props.user) {
            var fullPath = 'UserBase/' + this.props.user + '/' + passedCollection
            this.db.collection(fullPath).get().then((subdoc) => {
                let itemNumber = 1;
                subdoc.forEach((sd) => {
                    var itemName = passedCollection + itemNumber;
                    //console.log("ItemName", itemName);
                    //console.log(sd.data());
                    this.taxTypes.passedCollection = sd.data();
                    this.dataObject[itemName] = sd.data();
                    itemNumber++;
                });
            }).then(() => {
                //console.log('Data fetched from userbase', this.dataObject);
                //console.log(this.dataObject["land-tax1"]);;

                for (let key in this.dataObject) {
                    //console.log("key", key);
                    if (key.includes('land-tax')) {
                        this.landData.push(this.dataObject.key);
                    }
                    else if (key.includes('vehicle-tax')) {
                        this.vehicleData.push(this.dataObject.key);
                    }
                    else if (key.includes('income-tax')) {
                        this.incomeData.push(this.dataObject.key);
                    }
                }
            }).then(() => {
                console.log('LandData', this.landData);
                console.log('VehicleData', this.vehicleData);
                console.log('IncomeData', this.incomeData);
            });


            //console.table("LandData", this.landData);
        }
    }

    render() {
        // for (let key in this.dataObject){
        //     if (key.toString.includes('land-tax')){
        //        this.landData.push(this.data.key);
        //     }
        //     else if (key.toString.includes('vehicle-tax')){
        //         this.vehicleData.push(this.data.key);
        //      }
        //     else if (key.toString.includes('income-tax')){
        //         this.vehicleData.push(this.data.key);
        //      }
        // }
        // console.table("LandData", this.landData);
        return (<div>
            <h1>The Details Pane</h1>
            <Land location="khjlkh"></Land>
            <Vehicle vehicleType='2Wheeler'></Vehicle>
        </div>);
    }
}

export default Details;