import React from 'react'

import AutoComplete from 'material-ui/AutoComplete';
import MenuItem from 'material-ui/MenuItem';
import MoreIcon from '../icon/MoreIcon';
import PhoneIcon from '../icon/PhoneIcon';
import CanclePhoneIcon from '../icon/CanclePhoneIcon';
import CreditCardIcon from '../icon/CreditCardIcon';
import VideoCallIcon from '../icon/VideoCallIcon';

import '../css/Phone.css';

class Phone extends React.Component {

    constructor(props) {
        super(props);
        this.numDisplayRef = React.createRef();
    }

    onChange(e) {
        this.props.action.onChange(e.target.name, e.target.value);
    }

    onKeyUp(e) {
        if (e.keyCode === 13 && !this.props.session.isCalling) {
            this.props.action.startCall();
        } else if (this.props.session.isCalling && ((e.keyCode >= 48 && e.keyCode < 57) || e.key === '#' || e.key === '*')) {
            this.props.action.sendDTMF(e.key);
        }

    }

    onKeyUpItem(e) {
        if (e.keyCode === 13) {
            e.target.click();
        }
    }

    clickPhone(e) {
        var digit = e.target.dataset.digit;
        this.props.action.onChange('numDisplay', this.props.stateLayout.numDisplay + '' + digit);

        if (this.props.session.isCalling) {
            this.props.action.sendDTMF(digit);
        }

        this.numDisplayRef.current.focus();

    }

    convertSipStatus(status) {
        switch (status) {
            case "sipStatus/DISCONNECTED":
                return 'Disconnected';
            case "sipStatus/CONNECTING":
                return 'Connecting';
            case "sipStatus/CONNECTED":
                return 'Connected';
            case "sipStatus/REGISTERED":
                return 'Online';
            case "sipStatus/ERROR":
                return 'Offline';
            default:
                return '';
        }
    }

    convertCallStatus() {
        const status = this.props.call ? this.props.call.status : '';
        const uri = (this.props.rtcSession
            && this.props.rtcSession.remote_identity
            && this.props.rtcSession.remote_identity.uri) ? this.props.rtcSession.remote_identity.uri : {};
        switch (status) {
            case "callStatus/STARTCALL":
                return 'Callling: ' + (uri.user || '');
            case "callStatus/STARTING":
                return 'Waiting answer: ' + (uri.user || '');
            case "callStatus/ACTIVE":
                return '';
            default:
                return '';
        }
    }


    stopCall() {
        this.props.action.stopCall();
    }

    requestConsent() {
        this.props.action.requestConsent(this.props.stateLayout.numDisplay, this.props.stateLayout.numDisplay)
    }

    render() {

        const calllogs = this.props.session.calllogs.map(e => e.user + "");
        const contacts = this.props.stateLayout.contacts.map(e => e.phone + "");
        const keys = {};
        this.props.stateLayout.contacts.forEach(key => keys[key.phone] = key);

        const data = [...new Set([...contacts, ...calllogs])].map(phone => {
            var text = keys[phone] ? phone + " (" + keys[phone].name + ")" : phone;
            return {
                text: phone,
                value:
                    (<MenuItem
                        onKeyUp={(event) => this.onKeyUpItem(event, phone)}
                        primaryText={text}
                        className="menu-item-input"
                    />)
            }
        });


        const disabledCall = !this.props.stateLayout.numDisplay || !this.props.session.registered || this.props.session.isCalling;

        return (
            <div className="container" id="phone">
                <div className="row d-flex justify-content-center">
                    <div className="card col-sm-12" style={{ padding: 0, }}>
                        <div className="card-header up" style={{ padding: '3px' }}>
                            <div className=" form-group col-sm-12 phoneNum" >
                                <AutoComplete
                                    ref={this.numDisplayRef}
                                    name="numDisplay"
                                    className="numDisplay"
                                    fullWidth
                                    underlineShow={false}
                                    placeholder="Name / Phone …"
                                    inputStyle={{
                                        color: '#fff',
                                        textAlign: "center",
                                        fontSize: "45px",
                                    }}
                                    style={{
                                        height: "100%",
                                        display: "flex",
                                        alignItems: "center",
                                    }}
                                    openOnFocus={true}
                                    maxSearchResults={4}
                                    menuCloseDelay={0}
                                    searchText={this.props.stateLayout.numDisplay}
                                    onUpdateInput={(searchText) => { this.props.action.onChange("numDisplay", searchText) }}
                                    filter={(searchText, key) => searchText && (key.indexOf(searchText) !== -1)}
                                    dataSource={data}
                                    onKeyUp={this.onKeyUp.bind(this)}
                                />
                                <div className='icon-more' onClick={() => this.props.action.showPopup()}>
                                    <MoreIcon className='icon-more-svg' />
                                </div>
                            </div>
                        </div>
                        <div className="card-body d-flex justify-content-center" style={{ padding: 0 }}>

                            <div className='phone-body'>
                                <div className=" form-group col-sm-12 phone-dtmf">
                                    <div id="sip-dialpad">
                                        <div className='sip-digit'>
                                            <button type="button" className="btn btn-default digit" data-digit="1" onClick={this.clickPhone.bind(this)}><div className="btn-digit-number" data-digit="1">1</div></button>
                                            <button type="button" className="btn btn-default digit" data-digit="2" onClick={this.clickPhone.bind(this)}><div className="btn-digit-number" data-digit="2">2</div></button>
                                            <button type="button" className="btn btn-default digit" data-digit="3" onClick={this.clickPhone.bind(this)}><div className="btn-digit-number" data-digit="3">3</div></button>
                                        </div>
                                        <div className='sip-digit'>
                                            <button type="button" className="btn btn-default digit" data-digit="4" onClick={this.clickPhone.bind(this)}><div className="btn-digit-number" data-digit="4">4</div></button>
                                            <button type="button" className="btn btn-default digit" data-digit="5" onClick={this.clickPhone.bind(this)}><div className="btn-digit-number" data-digit="5">5</div></button>
                                            <button type="button" className="btn btn-default digit" data-digit="6" onClick={this.clickPhone.bind(this)}><div className="btn-digit-number" data-digit="6">6</div></button>
                                        </div>
                                        <div className='sip-digit'>
                                            <button type="button" className="btn btn-default digit" data-digit="7" onClick={this.clickPhone.bind(this)}><div className="btn-digit-number" data-digit="7">7</div></button>
                                            <button type="button" className="btn btn-default digit" data-digit="8" onClick={this.clickPhone.bind(this)}><div className="btn-digit-number" data-digit="8">8</div></button>
                                            <button type="button" className="btn btn-default digit" data-digit="9" onClick={this.clickPhone.bind(this)}><div className="btn-digit-number" data-digit="9">9</div></button>
                                        </div>
                                        <div className='sip-digit'>
                                            <button type="button" className="btn btn-default digit" data-digit="*" onClick={this.clickPhone.bind(this)}><div className="btn-digit-number" data-digit="*">*</div></button>
                                            <button type="button" className="btn btn-default digit" data-digit="0" onClick={this.clickPhone.bind(this)}><div className="btn-digit-number" data-digit="0">0</div></button>
                                            <button type="button" className="btn btn-default digit" data-digit="#" onClick={this.clickPhone.bind(this)}><div className="btn-digit-number" data-digit="#">#</div></button>
                                        </div>
                                        <div className='sip-digit'>


                                            <button type="button" className="btn btn-default digit"
                                                onClick={this.requestConsent.bind(this)}
                                                disabled={disabledCall}
                                            >
                                                <CreditCardIcon style={{ fill: disabledCall ? 'rgb(145 168 151)' : 'rgb(52, 179, 85)' }} className='sip-content-svg' />
                                            </button>

                                            {!this.props.session.isCalling &&
                                                <button type="button" className="btn btn-default digit"
                                                    onClick={() => this.props.action.startCall(false)}
                                                    disabled={disabledCall}
                                                >
                                                    <PhoneIcon style={{ fill: disabledCall ? 'rgb(145 168 151)' : 'rgb(52, 179, 85)' }} className='sip-content-svg' />
                                                </button>
                                            }

                                            {this.props.session.isCalling &&
                                                <button type="button" className="btn btn-default digit"
                                                    onClick={() => this.props.action.stopCall()}
                                                >
                                                    <CanclePhoneIcon style={{ fill: 'rgb(255, 64, 84)' }} className='sip-content-svg' />
                                                </button>
                                            }

                                            <button type="button" className="btn btn-default digit"
                                                onClick={() => this.props.action.startCall(true)}
                                                disabled={disabledCall}
                                            >
                                                <VideoCallIcon style={{ fill: disabledCall ? 'rgb(145 168 151)' : 'rgb(52, 179, 85)' }} className='sip-content-svg' />
                                            </button>

                                        </div>

                                    </div>
                                </div>

                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default Phone
