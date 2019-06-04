import React, { Component } from 'react';
import fixDate from './FixDate';
import income from './res/income.png';
import './detailscontent.css';

class Business extends Component {
    constructor(props) {
        super(props);
        this.state = {  }
    }

    componentDidMount(){
        console.log(this.props.details);
    }
    
    render() { 
        return (<div className="item-box">
        <h3>Income Tax</h3>
        <div className="row">
            <div className="location col-6">
                <p className='content-para'>Company Name: {this.props.details['business name']}</p>
                <p className='content-para'>Employment Type: {this.props.details['type of employment']}</p>
                <p className='content-para'>PAN: {this.props.details.PAN}</p>
                <p className='content-para'>Annual Income: NRs {this.props.details['annual income']}</p>
                <p className='content-para'>Tax Amount: NRs {this.props.details['taxAmount']}</p>
                <p className='content-para'>Due: {this.props.details['due date']}</p>
            </div>
            <div className="col-6 logodiv">
                <img className="logo" src={income}></img>
            </div>

        </div>
    </div>);
    }
}
 
export default Business;