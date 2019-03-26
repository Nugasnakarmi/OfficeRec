import React, { Component } from 'react';
import './sidebar.css';

const bStyle = {
    height: '40px'
};

class Sidebar extends Component {
    constructor(props) {
        super(props);
        this.toggle = this.toggle.bind(this);
        this.state = {
            dash: '',
            add_user: '',
            edit_details: '',
            toggler: true,
            user: ''
        };
    }
    toggle() {
        this.setState({
            toggler: true
        });
    }
    componentWillMount() {

    }
    render() {

        let link = this.props.link;
        const user1 = this.state.user;

        if (!this.state.user && this.props.user) {
            this.setState({
                user: this.props.user
            });

        }
        // console.log(this.state.user);

        if (link === 'Dashboard' && this.state.toggler) {
            this.setState({ toggler: false, dash: 'active', add_user: '', edit_details: '' });
        }
        else if (link === 'Add User' && this.state.toggler) {
            this.setState({ toggler: false, dash: '', add_user: 'active', edit_details: '' });
        }
        else if (link === 'Edit Details' && this.state.toggler) {
            this.setState({ toggler: false, dash: '', add_user: '', edit_details: 'active'});
        }
        else if (!link && this.state.toggler) {

            this.setState({ toggler: false, dash: '', details: '' });
        }
        // console.log(this.state.dash);
        return (
            <div>

                {this.state.user ?
                    <div onClick={this.toggle} className='d-flex bd-highlight'>
                        <span className='abc' onClick={() => { this.props.handler('Dashboard') }} status={this.state.dash}>
                            Dashboard
                        </span>


                        <span className='abc' onClick={() => { this.props.handler('Add User') }} status={this.state.add_user}>
                            Add User
                        </span>
                        <span className='abc' onClick={() => { this.props.handler('Edit Details') }} status={this.state.edit_details}>
                            Edit Details
                        </span>
                        <span className='flex-grow-1 d-flex justify-content-end'>
                            <span className='abc'>Hi {user1}!!
                        </span>
                            <button type="submit" onClick={() => { this.props.signout() }} className="btn btn-outline-primary" style={bStyle}> Logout </button>
                        </span>
                    </div>
                    : <h1>waiting</h1>}
            </div>
        );
    }
}
export default Sidebar;