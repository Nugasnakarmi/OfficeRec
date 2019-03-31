import React, { Component } from 'react';

import fixDate from './FixDate';
import './detailscontent.css'

class Vehicle extends Component {
    constructor(props) {
        super(props);
        this.state = {}
    }

    render() {
        console.log("RENDER");
        return (<div className="item-box">
            <h3>Vehicle</h3>
            <div className="row">
                <div className="location col-6">
                    {/* <p className='content-para'>Registration Number: NRs. {this.props.details.vrn}</p> */}
                    <p className='content-para'>Vehicle Type: NRs. {this.props.details.type}</p>
                    <p className='content-para'>Tax Amount: NRs. {this.props.details.amount}</p>
                    <p className='content-para'>Due: {fixDate(this.props.details['due'])}</p>
                </div>
                <div className="col-6">
                    <img className="img-responsive" src="https://shellabears.com.au/wp-content/themes/shellabears/images/suburb-icon-sold-pin.png" height="75" width="75"></img>
                </div>

            </div>
        </div>);
    }
}

export default Vehicle;