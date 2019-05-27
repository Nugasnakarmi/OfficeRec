import React, { Component } from 'react';
import fire from './config/fire';
import firebase from 'firebase';

class EditHouse extends Component {
    constructor(props) {
        super(props);
        this.state = {

            email: '',
            warningStatus: 'inactive',
            category: '0',
            sqft: 0,
            storey: 0,
            currentYear: "75-76",
            houseVal: 0,
            propTax: 0,
            valuated: false
        };
        this.db = fire.firestore();

        this.handleChange = this.handleChange.bind(this);
        this.handleChangeVal = this.handleChangeVal.bind(this);
        this.handleChangelandVal = this.handleChangelandVal.bind(this);


        this.implementCategory = this.implementCategory.bind(this);
        this.handleSelectCategoryChange = this.handleSelectCategoryChange.bind(this);
        this.writeHouseDetails = this.writeHouseDetails.bind(this);
        this.getPropertyTax = this.getPropertyTax.bind(this);
        this.getValuation = this.getValuation.bind(this);
    }
    handleChange = e => this.setState({ [e.target.name]: e.target.value });
    handleChangeVal = e => {
        this.setState({ [e.target.name]: e.target.value });
        this.getValuation();
        // this.getPropertyTax();
    }
    handleChangelandVal = e => {
        this.setState({ [e.target.name]: e.target.value });

        this.getPropertyTax();
    }



    handleChangeDate = e => this.setState({ [e.target.name]: e.target.date });
    
    implementCategory = e => {
        return new Promise((resolve, reject) => {
            this.setState({ category: e.target.value });
            resolve(this.state.category);
        });
        
        //this.getValuation();
        // this.getPropertyTax();

    }

    handleSelectCategoryChange(e){
        this.implementCategory(e).then(this.getValuation);
        }

    getValuation() {
        var valuation, multiplier, category;
        // if (notvaluated) {
        //     category = 1;
        // }
        // else {{

        // if(this.state.category)
        // {
        //     category = this.state.category;

        // }
        // else
        // {
        //     category = 0;
        // }
        category = this.state.category;
        console.log("The category is", category)
        // }
        this.db.collection("TaxRate").doc(this.state.currentYear).collection("PropertyValuation").doc("HouseVal").get().then((doc) => {
            if (doc.data()) {
                multiplier = doc.data()[category];
                valuation = multiplier * this.state.sqft * this.state.storey;

                this.setState(
                    {
                        houseVal: valuation,
                        valuated: true
                    }
                )

            }
        })

    }

    getPropertyTax() {
        var totalVal = this.state.houseVal + parseFloat(this.state.landVal);
        var propertyTax = 0, x, crore = 10000000, percent = 0.01, multiplier = 1;
        this.db.collection("TaxRate").doc(this.state.currentYear).collection("PropertyTax").doc("totalVal").get().then((doc) => {
            var PropValArr = new Array();
            var cal = totalVal;
            PropValArr = doc.data();
            if (PropValArr) {
                for (x in PropValArr) {
                    console.log("step:", x, PropValArr[x], "cal:", cal)
                    console.log(propertyTax)
                    if (x > 6) {
                        if ((cal <= 2 * crore) || (x == 11)) {
                            propertyTax += PropValArr[x] * percent * cal
                            cal -= cal;
                            console.log("x 11 here");
                        }

                        else {
                            propertyTax += PropValArr[x] * percent * 2 * crore;
                            cal -= 2 * crore;
                        }
                    }
                    else if (cal <= crore) {
                        propertyTax += PropValArr[x] * percent * cal
                        break;
                    }



                    else {

                        propertyTax += PropValArr[x] * percent * crore
                        cal -= crore;

                    }


                }
            }


            console.log("tax :", propertyTax)
            // this.setState(
            //     {
            //         propTax: propertyTax,

            //     }
            // )
        }


        )

    }
    writeHouseDetails(e) {
        e.preventDefault();
        var userRef;
        var houseRef;
        var droplist = document.getElementById("drop-house")
        var selected = droplist.options[droplist.selectedIndex].value;
        console.log(selected);
        if (this.state.email) {
            userRef = this.db.collection("UserBase").doc(this.state.email).get().then((doc) => {
                if (doc.data()) {
                    houseRef = this.db.collection("UserBase").doc(this.state.email).collection("house-tax");

                    houseRef.doc(this.state.houseno).set({
                        houseno: parseFloat(this.state.houseno),
                        Location: {
                            province: this.state.hprovince,
                            district: this.state.hdistrict,
                            municipality: this.state.hmunicipality,
                            ward: parseFloat(this.state.hward)

                        },
                        nostoreys: parseFloat(this.state.storey),
                        type: selected,
                        ['due date']: firebase.firestore.Timestamp.fromDate(new Date(this.state.dueDateHouse)),
                        taxAmount: parseFloat(this.state.taxAmountHouse),
                        coowner: this.state.coowner
                    }).then(() => { window.alert("updated successfully") }).catch((error) => { window.alert(error.message) });
                }
                else {
                    window.alert("User does not exist")
                }
            })
        }
        else {
            window.alert("User cannot be empty");
        }

    }
    render() {
        if (!this.state.email) {
            this.setState({
                email: this.props.user
            })
            console.log("INSIDE RENDER, CATEGORY", this.state.category);
        }
        return (
            <section>
                <h2> Property details </h2>
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

                    <div class="col-md-6 mb-3">
                        <label htmlFor="storey">Number of Storeys</label>
                        <input value={this.state.storey} id="storey" name="storey" className="form-control" onChange={this.handleChangeVal} type="number" placeholder="Eg: 4"></input>
                    </div>

                    <div class="col-md-6 mb-3">
                        <label htmlFor="drop-house">No. of Square feets</label>
                        <input value={this.state.sqft} id="sqft" name="sqft" type="number" className="form-control" onChange={this.handleChangeVal} placeholder="Eg: 600 "></input>
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
                {/* {this.state.valuated ? null : this.getValuation()} */}
                <b>House Valuation</b> : Nrs. {this.state.houseVal}


                <div className="form-row">
                    <div class="col-md-6 mb-3">
                        <label htmlFor="landval-house">Land cartilaged by house valuation</label>
                        <input value={this.state.landVal} id="landval-house" name="landVal" type="number" min="0" onChange={this.handleChangelandVal}></input>
                    </div>
                    {/* <div class="col-md-6 mb-3">
                        <label htmlFor="drop-house">Type of residence</label>
                        <select id="drop-house" className="custom-select">
                            <option>Residential</option>
                            <option>Rented</option>
                        </select>
                    </div> */}

                    <b>Total Valuation</b> : Nrs. {this.state.houseVal + parseFloat(this.state.landVal)}

                </div>
                {this.getPropertyTax()}
                {/* <b>Property Tax</b> : Nrs. {this.state.propTax} */}

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
                    <div className="form-row">

                        <div class="col-md-12">
                            <label htmlFor="coowner">Co-owner</label>
                            <input value={this.state.coowner} id="coowner" name="coowner" className="form-control" onChange={this.handleChange} placeholder="Hira Kaji Shrestha"></input>                            </div>

                        {/* <button onClick={} className="btn btn-primary">Search co-owner</button> */}

                    </div>
                    <button onClick={this.writeHouseDetails} className="btn btn-primary">Submit</button>




                </div>


            </section>

        )
    }
}

export default EditHouse;
