import React, { Component } from 'react';

import MainWindow from './MainWindow';
import fire from './config/fire';
import Sidebar from './Sidebar';
import AdminWindow from './AdminWindow';

class Home extends Component {
    constructor(props) {
        super(props);
        this.logout = this.logout.bind(this);
        this.changelink = this.changelink.bind(this);
        this.db = fire.firestore();


        // this.changeToggler = this.changeToggler.bind(this);
        this.state = {
            abc: '',
            toggler: 'disappear',
            loaded: false,
            isAdmin: false
            // state.isAdmin: this.db.collection('UserBase').doc('abc@mail.com')
            //     .get().then((doc) => { return doc.data().state.isAdmin })
        };
        this.db.collection('UserBase').doc('abc@mail.com').get()
            .then((doc) => {
                this.setState({
                    isAdmin: doc.data().isAdmin
                })
            }).then(() =>
                this.setState({
                    loaded: true
                }));
                
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
    // UNSAFE_componentWillMount()
    // {
    //  }   



    // changeToggler() {
    //     if (this.state.toggler === 'disappear') {
    //         this.setState({
    //             toggler: 'appear shadow sidebar'
    //         });
    //     }
    //     else if (this.state.toggler === 'appear shadow sidebar') {
    //         this.setState({
    //             toggler: 'disappear'
    //         });
    //     }
    // }
    changelink(value) {
        this.setState({
            abc: value
        });
        console.log("Changed");
    }
    render() {

        var user = this.props.user;
        this.state.isAdmin ? (console.log("this is admin")) : (console.log("this is user"));
        return (
            <div>
                {this.state.loaded ?
                    <div>
                        <div className='sticky-top top-bar bg-dark'><Sidebar link={this.state.abc} handler={this.changelink} user={user} signout={this.logout}></Sidebar></div>
                        <div className="row">
                            <div>
                                {this.state.isAdmin ? <AdminWindow /> : (<MainWindow link={this.state.abc} user={user} />)}
                            </div>
                        </div>
                    </div>

                    : <div>Loading</div>}
            </div>
        );
    }
}

export default Home;



