import React, { Component } from 'react';
import Land from './Land';
import Vehicle from './Vehicle';
import fire from './config/fire';
class Details extends Component {
    constructor(props) {
        super(props);
        this.taxTypes = ['land-tax', 'vehicle-tax', 'income-tax'];

        this.getSubcollections = this.getSubcollections.bind(this);

        this.state = {}
    }

    componentDidMount() {
        //GETS THE SUBCOLLECTIONS (added by Purak) (Code under construction)
        this.db = fire.firestore();
        this.taxTypes.map(this.getSubcollections);
    }

    getSubcollections(taxlist) {
        if (this.props.user) {
            this.db.collection('UserBase/' + this.props.user + '/' + taxlist).get().then((subdoc) => {
                subdoc.forEach((sd) => {
                    console.log("THE SUBDOCS ARE", sd.data());
                });
            });
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