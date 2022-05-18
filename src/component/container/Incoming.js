import React, { Component } from 'react'
import TransitionAppear from '../layout/TransitionAppear';
import '../css/Incoming.css'



export class Incoming extends Component {

    comparePhone(e, phone) {
        if (!phone || !e || !e.shared_info || !e.shared_info.phone) return false;
        phone = phone + "";
        if (phone.startsWith("0")) {
            phone = "84" + phone.substr(1);
        } else if (phone.startsWith("+")) {
            phone = phone.substr(1);
        }
        return e.shared_info.phone + "" == phone;

    }

    getName(phone) {
        var user = this.props.stateLayout.contacts.find(e => e.user_id == phone || this.comparePhone(e, phone));
        if (user)
            return user.display_name;
        return phone;
    }

    render() {
        var name = '';
        if (this.props.remote_identity && this.props.remote_identity.display_name) {
            name = this.props.remote_identity.display_name;
        } else if (this.props.session.uri && this.props.session.uri.user) {
            name = this.getName(this.props.session.uri.user);
        }
        return (
            <TransitionAppear duration={1000}>
                <div id="incoming">
                    <div className='incoming-body'>
                        <div className='incoming-title'>
                            <div className='incoming-title-name'>
                                {name}
                            </div>
                            <div className='incoming-title-uri'>
                                {this.props.session.uri ? this.props.session.uri.user + '@' + this.props.session.uri.host : ''}
                            </div>
                        </div>
                        <div className='incoming-button'>
                            <button className='btn btn-danger incoming-btn-fa'
                                onClick={this.props.action.stopCall}
                            >
                                <i className='fa fa-phone-slash'></i> Reject
                            </button>
                            <button className='btn btn-primary incoming-btn-fa'
                                onClick={this.props.action.answerCall}
                            >
                                <i className='fa fa-phone-alt'></i> Answer
                            </button>
                        </div>
                    </div>

                </div>
            </TransitionAppear>

        )
    }
}

export default Incoming;
