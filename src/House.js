import React, { Component } from 'react';
import './detailscontent.css';
import fire from './config/fire';
import './detailscontent.css';
import {
    Alert, Card, Button, CardHeader, CardFooter, CardBody,
    CardTitle, CardText
} from 'reactstrap';

class Land extends Component {
    constructor(props) {
        super(props);
        this.state = {
            warningStatus: 'inactive',
            category: '0',
            sqft: 0,
            storey: 0,
            currentYear: "75-76",
            houseVal: 0,
            propTax: 0,
            toValuate: false,
            builtYear: 0,
            depreciation: 0,
            depRate: 0,
            depPeriod: 0,
            toTax: false,
            visible: false
        };
        this.db = fire.firestore();
    }

    render() {
        console.log("RENDER");
        return (
            // <div className="item-box">
            //     <h3>House at {this.props.details.Location.municipality} House Number {this.props.details.houseno}</h3>
            //     <div className="row">
            //         <div className="location col-6">
            //             <p className='content-para location-heading'>Location</p>
            //             <p className='content-para'>Province: {this.props.details.Location.province}</p>
            //             <p className='content-para'>District: {this.props.details.Location.district}</p>
            //             <p className='content-para'>Municipality: {this.props.details.Location.municipality}</p>
            //             <p className='content-para'>Ward Number: {this.props.details.Location.ward}</p>
            //             <p className='content-para'>House Number: {this.props.details.houseno}</p>
            //         </div>
            //         <div className = "col-6 logodiv">
            //             <img className = "logo" src = {house}></img>
            //         </div>
            //         <div className="col-6">
            //             <p className='content-para'>Number of Storeys: {this.props.details.nostoreys} sq. meter</p>
            //             <p className='content-para'>Type of Residence: {this.props.details.type}</p>
            //         </div>
            //         <div className="col-6">
            //             <p className='content-para'>Tax Amount: NRs. {this.props.details.taxAmount}</p>
            //             <p className='content-para'>Due: {fixDate(this.props.details['due date'])}</p>
            //         </div>
            //     </div>
            // </div>

            <div>
                <Card className="popupCards">
                    <CardHeader style={{ backgroundColor: "#2D93AD", color: "aliceblue" }} tag="h4"> Property details </CardHeader>
                    <CardBody>
                        <section>
                            <div className="form-row">
                                <div className="col-md-12 mb-3">
                                    <label htmlFor="houseno">House number</label>
                                    <input value={this.state.houseno} id="houseno" name="houseno" type="number" className="form-control" onChange={this.handleChange} placeholder="Eg: house number"></input>

                                </div>

                            </div>
                            <label htmlFor="inputHouseLocation">Enter Location</label>
                            <div class="form-row" id="inputHouseLocation">
                                <div class="col-md-3 mb-3">
                                    <input value={this.state.hprovince} id="inputhprovince" name="hprovince" className="form-control" type="text" onChange={this.handleChange} placeholder=" Province"></input>
                                </div>
                                <div class="col-md-3 mb-3">
                                    <input value={this.state.hdistrict} id="inputhdistrict" name="hdistrict" className="form-control" type="text" onChange={this.handleChange} placeholder=" District "></input>
                                </div>
                                <div class="col-md-3 mb-3">
                                    <input value={this.state.hmunicipality} id="inputhmuni" name="hmunicipality" className="form-control" type="text" onChange={this.handleChange} placeholder=" Municipality"></input>
                                </div>
                                <div class="col-md-3 mb-3">
                                    <input value={this.state.hward} id="inputhward" name="hward" type="number" className="form-control" min="1" onChange={this.handleChange} placeholder=" Ward"></input>
                                </div>
                            </div>
                            <div className="form-row">

                                <div class="col-md-4 mb-3">
                                    <label htmlFor="storey">Number of Storeys</label>
                                    <input value={this.state.storey} id="storey" name="storey" className="form-control" onChange={this.handleChangeVal} type="number" placeholder="Eg: 4"></input>
                                </div>

                                <div class="col-md-4 mb-3">
                                    <label htmlFor="drop-house">No. of Square feets</label>
                                    <input value={this.state.sqft} id="sqft" name="sqft" type="number" className="form-control" onChange={this.handleChangeVal} placeholder="Eg: 600 "></input>
                                </div>
                                <div class="col-md-4 mb-3">
                                    <label htmlFor="builtYear">Year built</label>
                                    <input value={this.state.builtYear} id="builtYear" name="builtYear" className="form-control" onChange={this.handleYearChange} type="number" min="1900" placeholder="Eg: 2050"></input>
                                </div>




                            </div>
                            <div className="form-row">
                                <div class="col-md-12 mb-3">

                                    <label htmlFor="drop-cat">Category of House</label>
                                    <select value={this.state.category} id="drop-cat" className="custom-select" name="category" type='number' onChange={this.handleSelectCategoryChange}>
                                        <option value="0">कः भित्र काँचो बाहिर पाको इट्टामा माटोको जोडाई भएको भवन र काठबाट बनेको भवन </option>
                                        <option value="1">खः  भित्रबाहिर पाको इट्टा वा ढुंगा र माटोको जोडाई भएको सबै किसिमको भवन </option>
                                        <option value="2">ग :  प्रिफायब भवन, गोदाम भवन </option>
                                        <option value="3">घ :  भित्र बाहिर पाको इट्टा र सिमेन्टको जोडाई भएको भवन </option>
                                        <option value="4">ङ :  स्टील स्ट्रक्चर (ट्रस) भवन </option>
                                        <option value="5">च :  आर.सी.सी फ्रेम स्ट्रक्चर भवन </option>




                                    </select>
                                </div>


                            </div>
                            <div class="col-md-4 mb-3">
                                <button onClick={this.getValuationPrompt} className="btn btn-primary">Get Valuation</button>
                            </div>
                            <Alert className="alert" color="success" isOpen={this.state.toValuate} toggle={this.onDismissValue}>
                                <p><b>House Valuation </b>: Nrs.<font color="	#7CFC00"> {this.state.houseVal}</font><br></br>
                                    <b>House Depreciation </b> : Nrs. <font color="	#FF0000">{this.state.depreciation}</font><br></br>
                                    <b> Depreciation Rate </b> : {this.state.depRate}<br></br>
                                    <b> Depreciation in </b> : {this.state.depPeriod} years <br></br>
                                </p>
                            </Alert>



                            <div className="form-row">
                                <div class="col-md-6 mb-3">
                                    <label htmlFor="landval-house">भवन संरचना रहेको र संरचनाले ओगटेको थप जग्गाको मुल्याङकन</label>
                                    <input value={this.state.landVal} className="form-control" id="landval-house" name="landVal" type="number" min="0" onChange={this.handleChangelandVal}></input>
                                </div>
                                {/* <div class="col-md-6 mb-3">
                        <label htmlFor="drop-house">Type of residence</label>
                        <select id="drop-house" className="custom-select">
                            <option>Residential</option>
                            <option>Rented</option>
                        </select>
                    </div> */}


                                <p><b>Property Valuation</b> : Nrs. {this.state.houseVal + parseFloat(this.state.landVal)}</p>

                            </div>

                            <div class="col-md-4 mb-3">
                                <button onClick={this.getTaxPrompt} className="btn btn-primary">Get Property Tax</button>
                            </div>
                            {/* {this.getPropertyTax()} */}
                            <Alert className="alert" color="success" isOpen={this.state.toTax} toggle={this.onDismissTax}>

                                <p><b>Property Tax</b> : Nrs. {this.state.propTax}</p>
                            </Alert>


                            <div className="form-row">
                                <div class="col-md-6 mb-3">
                                    <label htmlFor="inputDate" position="left">Due date</label>
                                    <input value={this.state.dueDateHouse} className="form-control" id="inputDateHouse" name="dueDateHouse" type="date" onChange={this.handleChange} placeholder="Eg: 12th March 2019"></input>
                                    <h3>{this.state.date}</h3>
                                </div>
                                <div class="col-md-6 mb-3">
                                    <label htmlFor="inputTax" position="left">Tax amount</label>
                                    <input value={this.state.taxAmountHouse} className="form-control" id="inputTaxHouse" name="taxAmountHouse" type="number" min="0" onChange={this.handleChange} placeholder="Rs 5000"></input>

                                </div>
                                {/* <div className="form-row">

                                <div class="col-md-12">
                                    <label htmlFor="coowner">Co-owner</label>
                                    <input value={this.state.coowner} id="coowner" name="coowner" className="form-control" onChange={this.handleChange} placeholder="Hira Kaji Shrestha"></input>                            </div>

                                

                            </div> */}
                                <button onClick={this.writeHouseDetails} className="btn btn-primary">Submit</button>




                            </div>


                        </section>
                    </CardBody>
                </Card>
            </div>
        );
    }
}

export default Land;