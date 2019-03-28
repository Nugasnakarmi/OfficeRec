import React, { Component } from 'react';

import MainWindow from './MainWindow';
import fire from './config/fire';
import Sidebar from './Sidebar';
import AdminWindow from './AdminWindow';
import Details from './Details';
import AdminSidebar from './AdminSidebar'
import Precords from './precords';
import AddUser from './AddUser';

class Home extends Component {
    constructor(props) {
        super(props);
        this.logout = this.logout.bind(this);
        this.changelink = this.changelink.bind(this);
        this.verifyAdmin =this.verifyAdmin.bind(this);
        this.db = fire.firestore();
        this.email = this.props.user;

        // this.changeToggler = this.changeToggler.bind(this);
        this.state = {
            openTab: 'Dashboard',
            toggler: 'disappear',
            loaded: false,
            isAdmin: false
            // state.isAdmin: this.db.collection('UserBase').doc('openTab@mail.com')
            //     .get().then((doc) => { return doc.data().state.isAdmin })
        };
       
        // this.state.loaded = false;
        // this.state.isAdmin = false;

        // this.db.collection('UserBase').doc(this.email).get()
        //     .then((doc) => {
        //         this.setState({
        //             isAdmin: doc.data().isAdmin
        //         })
        //     }).then(() =>
        //         this.setState({
        //             loaded: true
        //         }));


        console.log('after promise', this.state.isAdmin);
        //     if( this.props.user != null){

        //            this.setState( 
        //                {
        //                    state.isAdmin: doc.data().state.isAdmin
        //                } )
        //         });
        //    }


    }

    logout() {
        fire.auth().signOut();
    }

    
    changelink(value) {
        this.setState({
            openTab: value
        });
        console.log("Changed");
    }

    verifyAdmin( User){
        User ? (this.db.collection('UserBase').doc(User).get()
        .then((doc) => {
                
                this.setState(
                    {
                        isAdmin : doc.data()['isAdmin'] 
                    }
                )
            })
        .then(() =>
            
        this.setState({
                        loaded: true
         } )
    ) ) :(console.log("user null") );
    }

    render() {
        

        let renderthing;
        var user= this.props.user;
       

        console.log('inside render', this.props.user);
         user = this.props.user;
        
        if(this.state.loaded === false){this.verifyAdmin(user);}
        
        if (this.state.openTab === 'Dashboard') renderthing = <AdminWindow />
        else if (this.state.openTab === 'Add User') renderthing = <AddUser />
        else if (this.state.openTab === 'Edit Details') renderthing = <Precords />
        
        return (
            
            <div>
                

        {this.state.isAdmin ? (console.log("this is admin")) : (console.log("this is user"))}

                {this.state.loaded ?
                    <div>
                        <div className='sticky-top top-bar bg-dark'>
                            {this.state.isAdmin ? <AdminSidebar link={this.state.openTab} handler={this.changelink} user={user} signout={this.logout}></AdminSidebar>
                                : <Sidebar link={this.state.openTab} handler={this.changelink} user={user} signout={this.logout}></Sidebar>}
                        </div>
                        <div className="d-flex flex-row">
                            <div>
                                {this.state.isAdmin ? 
                                    renderthing : ((this.state.openTab === 'Dashboard') ? <MainWindow user={user} /> : <Details user = {user}></Details>)}
                            </div>
                        </div>
                    </div>

                    : <div>Loading</div>}
            </div>
        );
    }
}
    export default Home;

