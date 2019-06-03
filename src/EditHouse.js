import React, { Component } from 'react';
import fire from './config/fire';
import House from './House' ;
// import {
//     Alert, Card, Button, CardHeader, CardFooter, CardBody,
//     CardTitle, CardText
// } from 'reactstrap';
import { Accordion, Card} from 'react-bootstrap';
import {Spinner} from 'reactstrap';

class EditHouse extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loaded:false
        };
        this.db = fire.firestore();
        this.countItem = 0;
        this.itemList = [];
        this.displayText = [];
    }

    componentDidMount() {
        let totalRecords  = 0;
        var houseRef = this.db.collection("UserBase").doc(this.props.user).collection("house-tax");
        houseRef.get().then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
                this.countItem++;
                console.log(doc.id, " => ", doc.data());
                this.itemList.push(doc.data());
            });
        }).then(() => {
            //console.clear();
            console.log("NO of property", this.countItem);
            console.log("The list", this.itemList);
            this.itemList.map((item, index) => {
                this.displayText.push(<Card>
                    <Accordion.Toggle as={Card.Header} eventKey={index}>
                        House {item.houseno}: State {item.Location.province}/{item.Location.district}/{item.Location.municipality}
                    </Accordion.Toggle>
                    <Accordion.Collapse eventKey={index}>
                        <Card.Body>
                            <House user={this.props.user} details={item} isAdmin={this.props.isAdmin} refresh={this.toggleUpdate} />
                        </Card.Body>
                    </Accordion.Collapse>
                </Card>)
                totalRecords++;
            })
            if (this.props.isAdmin){
                this.displayText.push(<Card align ="center">
                    <Accordion.Toggle as={Card.Header} eventKey={totalRecords}>
                        <b>Add Record</b>
                    </Accordion.Toggle>
                    <Accordion.Collapse eventKey={totalRecords}>
                        <Card.Body>
                            <House addNew = {true} user={this.props.user} details={null} isAdmin={this.props.isAdmin} refresh={this.toggleUpdate} />
                        </Card.Body>
                    </Accordion.Collapse>
                </Card>)
            }
            this.setState({
                loaded: true
            });
            //set a state to list loaded.
        });
    
    }
    render() {
        return (<Accordion defaultActiveKey="0">
            {this.state.loaded ? (this.displayText) : <Spinner color="info" />}
        </Accordion>
        )
    }
}

export default EditHouse;
