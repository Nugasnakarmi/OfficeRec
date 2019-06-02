import React, { Component } from 'react';
import './Popup.css';
import fire from './config/fire';
import MainWindow from './MainWindow';
import EditLand from './EditLand';
import EditHouse from './EditHouse';
import EditVehicle from './EditVehicle';
import EditIncome from './EditIncome';
import { Button } from 'react-bootstrap';

class Popup extends Component {
    constructor(props) {
        super(props);

        this.close = this.close.bind(this);
        this.donotClose = this.donotClose.bind(this);
        // this.handleEsc = this.handleEsc.bind(this);
        this.getSubcollections = this.getSubcollections.bind(this);
        this.filterData = this.filterData.bind(this);
        this.changeTab = this.changeTab.bind(this);

        this.db = fire.firestore();

        this.taxTypes = ['land-tax', 'vehicle-tax', 'income-tax', 'house-tax'];
        this.dataObject = {};
        this.landData = [];
        this.vehicleData = [];
        this.incomeData = [];
        this.houseData = [];
        this.tabData = {
            'personal': <MainWindow user={this.props.id} isAdmin = {this.props.isAdmin} />,
            'land':<EditLand user={this.props.id} isAdmin = {this.props.isAdmin}></EditLand>,
            'property': <EditHouse user={this.props.id} isAdmin = {this.props.isAdmin}></EditHouse>,
            'vehicle': <EditVehicle user={this.props.id} isAdmin = {this.props.isAdmin}></EditVehicle>,
            'income': <EditIncome user={this.props.id} isAdmin = {this.props.isAdmin}></EditIncome>
        };
        this.state = {
            loaded: false,
            activeTab: 'personal'
        };
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
        if (this.props.id) {
            console.log('GetSubCollection runs for', passedCollection);
            var fullPath = 'UserBase/' + this.props.id + '/' + passedCollection;
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
            console.log('LandData', this.landData);
            console.log('VehicleData', this.vehicleData);
            console.log('HouseData', this.houseData);
            console.table("LandData", this.landData);
        }
    }

    changeTab(heading) {
        this.setState({
            activeTab: heading
        });
        console.clear();
        console.log("ACTIVE TAB IS", this.state.activeTab);
    }

    close(e) {
        e.preventDefault();
        this.props.close();
    }

    donotClose(e) {
        e.stopPropagation();
    }

    // handleEsc(e){
    //     if (e.key === 'Escape'){
    //         console.log("ESC Press");
    //         this.close(e);
    //     }
    // }

    render() {
        return (
            <div className='popup' onClick={this.close} >
                <div className='popup-inner' align="center" onClick={this.donotClose}>
                    <ul className="nav nav-tabs">
                        <li className="nav-item" onClick={() => { this.changeTab('personal') }}>
                            <a className="nav-link active" href="#">Personal</a>
                        </li>
                        {this.landData.length
                            ? (<li className="nav-item" onClick={() => { this.changeTab('land') }}>
                                <a className="nav-link" href="#">Land</a>
                            </li>)
                            : null}
                        {this.houseData.length
                            ? (<li className="nav-item" onClick={() => { this.changeTab('property') }}>
                                <a className="nav-link" href="#">Property</a>
                            </li>)
                            : null}
                        {this.vehicleData.length
                            ? (<li className="nav-item" onClick={() => { this.changeTab('vehicle') }}>
                                <a className="nav-link" href="#">Vehicle</a>
                            </li>)
                            : null}
                        {this.incomeData.length
                            ? (<li className="nav-item" onClick={() => { this.changeTab('income') }}>
                                <a className="nav-link" href="#">Income</a>
                            </li>)
                            : null}
                    </ul>
                    <div className='scrollable-content'>
                        {this.tabData[this.state.activeTab]}
                    </div>
                    <Button variant="primary" onClick={this.close} style={{ 'margin-lef`t': '100px' }}>Close</Button>
                </div>
            </div >
        );
    }
}

export default Popup;