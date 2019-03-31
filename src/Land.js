import React, { Component } from 'react';
import './detailscontent.css';

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
        return (<div className = "item-box">
            <h3>Land Record</h3>
            <div>
                <p className='content-para'>Location</p>
                <p className='content-para'>Province: {this.props.details.Location.province}</p>
                <p className='content-para'>District: {this.props.details.Location.district}</p>
                <p className='content-para'>Municipality: {this.props.details.Location.municipality}</p>
                <p className='content-para'>Ward Number: {this.props.details.Location.ward}</p>
                <p className='content-para'>Listing ID: {this.props.details.listingID}</p>
                <p className='content-para'>Tax Amount: {this.props.details.taxAmount}</p>
                <p className='content-para'>Due: {this.props.details['due-date']}</p>
            </div>
        </div>);
    }
}

export default Land;