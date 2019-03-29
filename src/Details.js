import React, { Component } from 'react';
import Land from './Land';
import Vehicle from './Vehicle';
import fire from './config/fire';
class Details extends Component {
    constructor(props) {
        super(props);
        this.taxTypes = ['land-tax','vehicle-tax','income-tax'];
        this.dataObject = {};
        this.getSubcollections = this.getSubcollections.bind(this);

        this.state = {}
    }

    componentDidMount() {
        //GETS THE SUBCOLLECTIONS (added by Purak) (Code under construction)
        this.db = fire.firestore();
        for (var collectionName of this.taxTypes){
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
                
            });
            console.log('Data fetched from userbase', this.dataObject);
        }
    }

    render() {
        return (<div>
            <h1>The Details Pane</h1>
            <Land location="khjlkh"></Land>
            <Vehicle vehicleType='2Wheeler'></Vehicle>
        </div>);
    }
}

export default Details;