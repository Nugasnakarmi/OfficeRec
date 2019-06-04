import React, { Component } from 'react';
import fire from './config/fire';
import firebase from 'firebase';
import {
    Spinner
} from 'reactstrap';
import { Accordion, Card, Button } from 'react-bootstrap';
import Advertisement from './Advertisement'

class EditAdvertisement extends Component {
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
        let totalRecords  = 0;
        let idList = [];
        var advRef = this.db.collection("UserBase").doc(this.props.user).collection("advertisement-tax");
        advRef.get().then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
                this.countItem++;
                console.log(doc.id, " => ", doc.data());
                this.itemList.push({ ...doc.data(), id: doc.id });
                idList.push(parseFloat(doc.id));
            });
        }).then(() => {
            //console.clear();
            console.log("NO of advertisement", this.countItem);
            console.log("The list", this.itemList);
            if(!this.itemList ){
                this.maxID = 0
            }
            else{
                this.maxID = Math.max(...idList);
                
            }
            
            this.itemList.map((item, index) => {
                this.displayText.push(<Card>
                    <Accordion.Toggle as={Card.Header} eventKey={index}>
                        {item.id}: {item.businessname}/{item.PAN}
                    </Accordion.Toggle>
                    <Accordion.Collapse eventKey={index}>
                        <Card.Body>
                            <Advertisement user={this.props.user} details={item} isAdmin={this.props.isAdmin} refresh={this.toggleUpdate} />
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
                            <Advertisement addNew = {true} user={this.props.user}  maxID = {this.maxID} details={null} isAdmin={this.props.isAdmin} refresh={this.toggleUpdate} />
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
        if (!this.state.email) {
            this.setState({
                email: this.props.user
            })
        }
   
        return (
            
            
               <Accordion defaultActiveKey="0">
               {this.state.loaded ? (this.displayText) : <Spinner color="info" />}
           </Accordion>
        )
    }
}

export default EditAdvertisement;
