import React, { Component } from 'react';
import fire from './config/fire';

class MainWindow extends Component {
    constructor(props) {
        super(props);
        this.state = { value: '' }
        this.db = fire.firestore();
        this.db.collection('User').doc('W2xD0Op2KkA1yVDvhZZ2').get().then((doc) => {
            this.setState({
                value: doc.data()
            });
        });

    }

    // componentWillMount(){
    //     var db = fire.firestore();
    //     var datab = db.collection('User');
    //     console.log (datab);
    // }

    render() {
    //    console.log(this.state.value);
        var link = this.props.link;
        return (
            <div>
                <nav className='navbar-main'></nav>
                <h1>Main Window here</h1>
                {link}
                {this.props.user}
                {this.state.value['Citizenship Number']}
            </div>
        );
    }
}

export default MainWindow;