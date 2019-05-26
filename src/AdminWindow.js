import React, { Component } from 'react';
import fire from './config/fire';
import Details from './Details';
import RecordList from './RecordList';
<<<<<<< HEAD
import Popup from './Popup';
import './AdminWindow.css';

//import fixDate from './FixDate';
=======
import {
    Table,
    TableBody,
    TableFooter,
    TableHeader,
    TableHeaderColumn,
    TableRow,
    TableRowColumn,
} from 'material-ui/Table';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'
import TextField from 'material-ui/TextField';
import Toggle from 'material-ui/Toggle';
import { red100 } from 'material-ui/styles/colors';

const styles = {
    propContainer: {
        width: 200,
        overflow: 'hidden',
        margin: '20px auto 0',
    },
    propToggleHeader: {
        margin: '20px auto 10px',
    },
};
>>>>>>> 7db32f14060c794ce06871497a9154e786c09c26

class AdminWindow extends Component {
    constructor(props) {
        super(props);
        this.state = {
            userInfo: '',
            email: '',
            searched: false,
            loaded: false,
<<<<<<< HEAD
            listed: false,
            popupActive:false,
            activeUser:''
=======
            fixedHeader: true,
            fixedFooter: true,
            stripedRows: false,
            showRowHover: true,
            selectable: true,
            multiSelectable: false,
            enableSelectAll: false,
            deselectOnClickaway: true,
            showCheckboxes: false,
            height: '300px',
            

>>>>>>> 7db32f14060c794ce06871497a9154e786c09c26
        };
        //let recordLabel = [];
        this.db = fire.firestore();
        this.handleClick = this.handleClick.bind(this);
        this.togglePopup = this.togglePopup.bind(this);
        this.closePopup = this.closePopup.bind(this);
        this.recordLabel = [];
    }

    handleChange = e => {
        this.setState({ [e.target.name]: e.target.value });
        this.setState({ loaded: false })
    }


    handleClick(e) {
        e.preventDefault();
        (this.state.email !== '') ? (this.setState({
            loaded: true,
            searched: true
        })) : (window.alert("enter email please"));
    }

    componentDidMount() {
        console.clear();

        this.db.collection("UserBase").get().then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
                // doc.data() is never undefined for query doc snapshots
                console.log(doc.id, " => ", doc.data());
<<<<<<< HEAD
                let valueObject = {id: doc.id, name: doc.data().Name, czn: doc.data()['Citizenship Number']};
                //console.log(this.recordLabel);
                this.recordLabel.push(valueObject);
               console.log("ValueObject", valueObject); 
=======
                if (doc.data().isAdmin !== true) {
                    let valueObject = { id: doc.id, name: doc.data().Name, czn: doc.data()['Citizenship Number'] };
                    //console.log(this.recordLabel);
                    this.recordLabel.push(valueObject);
                    console.log("ValueObject", valueObject);
                }


>>>>>>> 7db32f14060c794ce06871497a9154e786c09c26
            });
            console.log("List of data => ", this.recordLabel);
        })
            .then(() => {
                this.setState({
                    listed: true
                });
            }); //attach a promise here that sets state to reload
    }

    togglePopup(email){
        console.log(`you clicked on ${email}`);
        this.setState({
            activeUser: email,
            popupActive: !this.popupActive
        });
    }

    closePopup(){
        console.log("THE POPUP CLOSED");
        this.setState({
            activeUser: '',
            popupActive: false
        })
    }

    render() {
        return (
<<<<<<< HEAD
            <div className='admin-panel' style={{ 'marginTop': '60' }}>
                {/* <h2>Admin Panel</h2>
                <p>Search and view User Records here</p>
                <form >
                    <div className="form-group">
                        <input value={this.state.email} name="email" type="email" onChange={this.handleChange}
                            className="form-control" id="Inputname1" placeholder="Enter email" />
                        <label htmlFor="Inputemail1"><small>email of user </small> </label>
                    </div>
                </form>

                <button onClick={this.handleClick} className="btn btn-primary">Search</button>
                {(this.state.searched && this.state.loaded ? (<Details user={this.state.email}></Details>) :
                    <div>
                        <small> <i> Please search for user</i></small>
                    </div>)}
                <div className = 'record'> */}

                {/* </div> */}
                {this.state.listed ? this.recordLabel.map((item, index) => (<RecordList data = {item} index = {index} pop = {this.togglePopup} ></RecordList>)) : <div>Loading</div>}
                {this.state.popupActive === true ? <Popup id = {this.state.activeUser} close = {this.closePopup}></Popup> : null}
            </div>
        );
=======
            // <div className='admin-panel container' style={{ 'marginTop': '60' }}>
            // <h2>Admin Panel</h2>
            //     <p>Search and view User Records here</p>
            //     <form >
            //         <div className="form-group">
            //             <input value={this.state.email} name="email" type="email" onChange={this.handleChange}
            //                 className="form-control" id="Inputname1" placeholder="Enter email" />
            //             <label htmlFor="Inputemail1"><small>email of user </small> </label>
            //         </div>
            //     </form>

            //     <button onClick={this.handleClick} className="btn btn-primary">Search</button>
            //     {(this.state.searched && this.state.loaded ? (<Details user={this.state.email}></Details>) :
            //         <div>
            //             <small> <i> Please search for user</i></small>
            //         </div>)}
            //     <div className = 'record'>

            // </div>
            //     {this.recordLabel.map((item) => (<RecordList data={item}></RecordList>))}
            // </div>

            <div>
                <MuiThemeProvider>
            <Table
                height={this.state.height}
                fixedHeader={this.state.fixedHeader}
                fixedFooter={this.state.fixedFooter}
                selectable={this.state.selectable}
                multiSelectable={this.state.multiSelectable}
               
            >
                <TableHeader
                    displaySelectAll={this.state.showCheckboxes}
                    adjustForCheckbox={this.state.showCheckboxes}
                    enableSelectAll={this.state.enableSelectAll}>
                    <TableRow>
                        <TableHeaderColumn colSpan="4" tooltip="Super Header" style={{ textAlign: 'center' }}>
                            
                        </TableHeaderColumn>
                    </TableRow>
                    <TableRow>
                        <TableHeaderColumn tooltip="The ID">ID</TableHeaderColumn>
                        <TableHeaderColumn tooltip="The Name">Name</TableHeaderColumn>
                        <TableHeaderColumn tooltip="The Email">Email</TableHeaderColumn>
                        <TableHeaderColumn tooltip="The Czn">Citizenship Number</TableHeaderColumn>

                    </TableRow>
                </TableHeader>

                <TableBody
                    displayRowCheckbox={this.state.showCheckboxes}
                    deselectOnClickaway={this.state.deselectOnClickaway}
                    showRowHover={this.state.showRowHover}
                    stripedRows={this.state.stripedRows}>
                    {this.recordLabel.map((row, index) => (
                         index %2 ? (
                            <TableRow style={{backgroundColor: '#4B9130' }} key={index}>
                        <TableRowColumn>{index + 1}</TableRowColumn>
                        <TableRowColumn>{row.name}</TableRowColumn>
                        <TableRowColumn>{row.id}</TableRowColumn>
                        <TableRowColumn>{row.czn}</TableRowColumn>
                    </TableRow>)
                    : (
                    <TableRow style={{backgroundColor: '#FFFFFF' }} key={index}>
                    <TableRowColumn>{index + 1}</TableRowColumn>
                    <TableRowColumn>{row.name}</TableRowColumn>
                    <TableRowColumn>{row.id}</TableRowColumn>
                    <TableRowColumn>{row.czn}</TableRowColumn>
                </TableRow>)
                    ))
                }
                </TableBody>
{/* 
                <TableFooter
                    adjustForCheckbox={this.state.showCheckboxes}>
                    <TableRow>
                        <TableRowColumn>ID</TableRowColumn>
                        <TableRowColumn>Name</TableRowColumn>
                        <TableRowColumn>Status</TableRowColumn>
                    </TableRow>
                    <TableRow>
                        <TableRowColumn colSpan="3" style={{ textAlign: 'center' }}>
                            Super Footer
                        </TableRowColumn>
                    </TableRow>
                </TableFooter> */}

            </Table>
            </MuiThemeProvider>
    </div>);
>>>>>>> 7db32f14060c794ce06871497a9154e786c09c26
    }
}

export default AdminWindow;