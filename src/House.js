import React, { Component } from 'react';
import './detailscontent.css';
import fixDate from './FixDate';
import house from './res/house.png';
import './detailscontent.css';

class Land extends Component {

    render() {
        console.log("RENDER");
        return (<div className="item-box">
            <h3>Land at {this.props.details.Location.municipality} Kitta {this.props.details.kittaId}</h3>
            <div className="row">
                <div className="location col-6">
                    <p className='content-para location-heading'>Location</p>
                    <p className='content-para'>Province: {this.props.details.Location.province}</p>
                    <p className='content-para'>District: {this.props.details.Location.district}</p>
                    <p className='content-para'>Municipality: {this.props.details.Location.municipality}</p>
                    <p className='content-para'>Ward Number: {this.props.details.Location.ward}</p>
                    <p className='content-para'>House Number: {this.props.details.houseno}</p>
                </div>
                <div className = "col-6 logodiv">
                    <img className = "logo" src = {house}></img>
                </div>
                <div className="col-6">
                    <p className='content-para'>Number of Storeys: {this.props.details.nostoreys} sq. meter</p>
                    <p className='content-para'>Type of Residence: {this.props.details.type}</p>
                </div>
                <div className="col-6">
                    <p className='content-para'>Tax Amount: NRs. {this.props.details.taxAmount}</p>
                    <p className='content-para'>Due: {fixDate(this.props.details['due date'])}</p>
                </div>
            </div>
        </div>);
    }
}

export default Land;