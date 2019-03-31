import React, { Component } from 'react';
import './detailscontent.css';
import fixDate from './FixDate';

class Land extends Component {
    constructor(props) {
        super(props);
        this.state = {

        };
        this.display = '';
    }

    componentDidMount() {
        console.log("received props", this.props.details);
        // for (let item in this.props.details){
        //     this.displayobject();
        // }
        console.log("CDM");
    }

    render() {
        console.log("RENDER");
        return (<div className="item-box">
            <h3>Land Record</h3>
            <div>
                <div className="location">
                    <p className='content-para'><b>Location</b></p>
                    <p className='content-para'>Province: {this.props.details.Location.province}</p>
                    <p className='content-para'>District: {this.props.details.Location.district}</p>
                    <p className='content-para'>Municipality: {this.props.details.Location.municipality}</p>
                    <p className='content-para'>Ward Number: {this.props.details.Location.ward}</p>
                </div>
                <p className='content-para'>Area: {/*this.props.details.listingId*/}</p>
                <p className='content-para'>Listing ID: {this.props.details.listingId}</p>
                <p className='content-para'>Tax Amount: Rs. {this.props.details.taxAmount}</p>
                <p className='content-para'>Due: {fixDate(this.props.details['due date'])}</p>
            </div>
        </div>);
    }
}

export default Land;