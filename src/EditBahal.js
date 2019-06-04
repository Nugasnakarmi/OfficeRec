import React, { Component } from 'react';
import fire from './config/fire';
import {
    Spinner
} from 'reactstrap';
import { Accordion, Card, Button } from 'react-bootstrap';
import Bahal from './Bahal';

class EditBahal extends Component {
    constructor(props) {
        super(props);
        this.state = {
        };
        this.db = fire.firestore();
        this.countItem = 0;
        this.itemList = [];
        this.displayText = [];

    }

    componentDidMount() {
        let totalRecords = 0;
        let idList = [];
        var rentRef = this.db.collection("UserBase").doc(this.props.user).collection("rent-tax");
        rentRef.get().then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
                this.countItem++;
                console.log(doc.id, " => ", doc.data());
                this.itemList.push({ ...doc.data(), id: doc.id });
                idList.push(parseFloat(doc.id));
            });
        }).then(() => {
            //console.clear();
            if (!this.itemList) {
                this.maxID = Math.max(...idList);
            }
            else {
                this.maxID = 0
            } this.itemList.map((item, index) => {
                this.displayText.push(<Card>
                    <Accordion.Toggle as={Card.Header} eventKey={index}>
                        {item.id}
                    </Accordion.Toggle>
                    <Accordion.Collapse eventKey={index}>
                        <Card.Body>
                            <Bahal user={this.props.user} details={item} isAdmin={this.props.isAdmin} refresh={this.toggleUpdate} />
                        </Card.Body>
                    </Accordion.Collapse>
                </Card>)
                totalRecords++;
            })
            if (this.props.isAdmin) {
                this.displayText.push(<Card align="center">
                    <Accordion.Toggle as={Card.Header} eventKey={totalRecords}>
                        <b>Add Record</b>
                    </Accordion.Toggle>
                    <Accordion.Collapse eventKey={totalRecords}>
                        <Card.Body>
                            <Bahal addNew={true} user={this.props.user} maxID={this.maxID} details={null} isAdmin={this.props.isAdmin} refresh={this.toggleUpdate} />
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
        return (
            <Accordion defaultActiveKey="0">
                {this.state.loaded ? (this.displayText) : <Spinner color="info" />}
            </Accordion>
        )
    }
}

export default EditBahal;
