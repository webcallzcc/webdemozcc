import React from 'react';
import Incoming from './Incoming';
import Setting from './Setting';
import { If } from '../layout/Condition';
import SidebarItem from '../layout/SidebarItem';
import Contact from '../pages/Contact';
import Phone from '../pages/Phone';
import RecentCall from '../pages/RecentCall';
import RecentConsent from '../pages/RecentConsent';
import Session from '../pages/Session';
import ZaloOpenAPI from '../../utils/ZaloOpenAPI';
import { Modal, Button, Overlay, Popover, Form, Select } from 'react-bootstrap'
import "../css/Common.css";
import "../css/sidebarTwo.css";


const allRoutes = [
    {
        "key": 1,
        "featureName": "Phone",
        "className": "fas fa-phone-alt",
        "path": "/phone",
        "exact": true,
        "component": <Phone />
    },
    {
        "key": 2,
        "featureName": "Recent Consent",
        "className": "fas fa-credit-card",
        "path": "/recent-consents",
        "exact": true,
        "component": <RecentConsent />
    },
    {
        "key": 3,
        "featureName": "History Call",
        "className": "fas fa-clock",
        "path": "/recent-calls",
        "exact": true,
        "component": <RecentCall />
    },
    {
        "key": 4,
        "featureName": "OA Follower",
        "className": "fas fa-address-book",
        "path": "/contacts",
        "exact": true,
        "component": <Contact />
    },
];


export default class Dashboard extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            numDisplay: '',
            showMenu: true,
            showPopup: false,
            showRequestConsent: false,
            userRequestConsent: { user_id: '', name: '' },
            activeMore: false,
            contacts: [],
            consents: [],
            reasonRequestConsent: '',
            typeRequestConsent: 'audio',
            valueRequestConsent: 0,
            errorMsg: '',
            layout: '/phone'
        }

        this.versionConsent = "1.0";
        this.mounted = false;
        this.widthShowMenu = true;
        this.cancleMenuRef = React.createRef();
        this.openMenuRef = React.createRef();
        this.radioReason = React.createRef();



    }

    componentDidMount() {
        this.mounted = true;
        window.addEventListener('resize', this.handleResize.bind(this));
        window.addEventListener("unload", this.handleUnload.bind(this));
        window.addEventListener("beforeunload", this.handleBeforeUnload.bind(this));
        this.handleResize();

        ZaloOpenAPI.getfollowerAlls(data => {
            if (!this.mounted)
                return;
            this.setState({ contacts: data });
        });

        setTimeout(async function () {
            try {
                var consentsStr = localStorage.getItem("consents");
                var consents = JSON.parse(consentsStr) || [];
                var consentNew = [];

                for (var k in consents) {
                    var consent = consents[k];
                    if (consent.version != this.versionConsent) {
                        continue;
                    }
                    if (consent.msg == "Waitting for user approval") {
                        try {
                            await ZaloOpenAPI.checkConsent(consent.user_id).then(data => {
                                consent.msg = "User approved the request";
                                consentNew.push(consent);
                            }).catch(ex => {
                                if (ex == "User approved the request"
                                    || ex == "OA has not yet requested user consent"
                                    || ex == "Consent expired"
                                    || ex == "User blocked"
                                    || true) {

                                    consent.msg = ex;
                                    consentNew.push(consent);
                                }

                            });
                        } catch (ex) {
                        }

                    } else {
                        consentNew.push(consent);
                    }
                }
                localStorage.setItem("consents", JSON.stringify(consentNew));
                this.setState({ consents: consentNew });
            } catch (ex) {

            }
        }.bind(this), 1000);
    }

    componentWillUnmount() {
        this.mounted = false;
        window.removeEventListener('resize', this.handleResize.bind(this))
        window.removeEventListener("unload", this.handleUnload.bind(this));
        window.removeEventListener("beforeunload", this.handleBeforeUnload.bind(this));
    }

    handleResize() {
        if (!this.mounted)
            return;
        var width = window.innerWidth;
        if (width < 1024 && this.state.showMenu && this.widthShowMenu && this.cancleMenuRef && this.cancleMenuRef.current && this.cancleMenuRef.current.click) {
            this.widthShowMenu = false;
            this.cancleMenuRef.current.click();
        } else if (width >= 1024 && !this.state.showMenu && !this.widthShowMenu && this.openMenuRef && this.openMenuRef.current && this.openMenuRef.current.click) {
            this.widthShowMenu = true;
            this.openMenuRef.current.click();
        }
    }

    handleUnload() {
        if (this.isCalling()) {
            this.props.stopCall();
        }
        this.props.unregisterSip();
    }


    handleBeforeUnload(e) {
        if (this.isCalling()) {
            e.returnValue = "You are the calling! Are you sure you want to leave call";
            return e.returnValue;
        }
        e.preventDefault();
        delete e["returnValue"];
        return "";
    }

    showMenu(show) {
        this.setState({ showMenu: show });
    }

    convertSipStatus(status) {
        switch (status) {
            case "sipStatus/DISCONNECTED":
                return 'disconnected';
            case "sipStatus/CONNECTING":
                return 'connecting';
            case "sipStatus/CONNECTED":
                return 'connected';
            case "sipStatus/REGISTERED":
                return 'registered';
            case "sipStatus/ERROR":
                return 'error';

        }
    }

    onClickMenu(path) {
        this.setState({ layout: path });
    }

    comparePhone(e, phone) {
        var phoneno = /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/;
        if (!phone || !e || !e.shared_info || !e.shared_info.phone) return false;
        if (!phone.match(phoneno)) return false;
        phone = phone + "";
        if (phone.startsWith("0")) {
            phone = "84" + phone.substr(1);
        }
        return e.shared_info.phone + "" == phone;

    }

    getName(phone) {
        var user = this.state.contacts.find(e => e.user_id == phone || this.comparePhone(e, phone));
        if (user)
            return user.display_name;
        return phone;
    }

    startCall(hasVideo) {
        if (!this.state.numDisplay)
            return;
        if (this.state.numDisplay.length < 7) {
            this._startCall(this.state.numDisplay, hasVideo);
        } else {
            this.checkAndStartCall(this.state.numDisplay, hasVideo);
        }
    }

    _startCall(name, hasVideo) {
        this.props.startCall(name, hasVideo ? true : false);
        this.setState({ layout: '/session', numDisplay: '' });
    }

    checkAndStartCall(name, hasVideo) {
        ZaloOpenAPI.checkConsent(name).then(data => {
            this._startCall(name, hasVideo);
        }).catch(err => {
            console.log('err', err);
            if (err == "User approved the request") {
                this._startCall(name, hasVideo);
            } else if (err == "OA has not yet requested user consent") {
                this.requestConsent(name, this.getName(name));
            } else if (err == "Consent expired") {
                this.requestConsent(name, this.getName(name));
                this.props.onNotify({
                    level: 'error',
                    title: 'Call Error',
                    message: err
                })
            } else if (err == "Waitting for user approval" || err == "User blocked") {
                this.props.onNotify({
                    level: 'error',
                    title: 'Call Error',
                    message: err
                })
            } else {
                this.props.onNotify({
                    level: 'error',
                    title: 'Call Error',
                    message: err
                })
            }
        });

    }

    stopCall() {
        this.props.stopCall();
        this.setState({ layout: '/phone' });

    }

    answerCall() {
        this.props.answerCall();
        this.setState({ layout: '/session' });
    }


    changeHold() {
        this.props.action.changeHold(this.props.localHold ? false : true);
    }

    onChange(name, value) {
        this.setState({ [name]: value });
    }

    changePhone(phone, autoCall) {
        const isCalling = this.props.call && this.props.call.direction && this.props.call.status;

        if (isCalling) {
            return;
        }
        if (autoCall) {
            this.checkAndStartCall(phone, false);
        } else {
            this.setState({ layout: '/phone', numDisplay: phone });
        }
    }

    onChangeTypeCall(e) {
        this.setState({ typeRequestConsent: e.target.value })
    }

    handleChangeRadio(e) {
        this.setState({ valueRequestConsent: e });
    }
    onChangeReasonConsent(e) {
        this.setState({ reasonRequestConsent: e.target.value });
        if (this.radioReason && this.radioReason.current) {
            this.radioReason.current.click();
        }
    }



    requestConsent(user_id, name) {
        this.setState({ showRequestConsent: true, userRequestConsent: { user_id: user_id, name: name } });
    }

    sendRequestConsent(user_id, name) {
        ZaloOpenAPI.requestConsent(user_id, this.state.typeRequestConsent, this.state.valueRequestConsent).then(data => {
            this.props.onNotify({
                level: 'info',
                title: 'Request Consent',
                message: data.message
            })
            this.setState({ showRequestConsent: false, userRequestConsent: { user_id: '', name: '' }, typeRequestConsent: 'audio', valueRequestConsent: '' });

            var consents = this.state.consents;
            var data = { user_id: user_id, name: name, time: new Date().getTime(), version: this.versionConsent, msg: "Waitting for user approval" };
            consents = consents.filter(e => e.user_id != user_id);
            consents.push(data);
            this.setState({ consents: consents });
            localStorage.setItem("consents", JSON.stringify(consents));

        }).catch(err => {
            this.props.onNotify({
                level: 'error',
                title: 'Request Consent Error',
                message: err
            })

            if (err != "Already allowed to call") {
                var consents = this.state.consents;
                var data = { user_id: user_id, name: name, time: new Date().getTime(), version: this.versionConsent, msg: err };
                consents = consents.filter(e => e.user_id != user_id);
                consents.push(data);
                this.setState({ consents: consents });
                localStorage.setItem("consents", JSON.stringify(consents));
            }

        });

    }

    showPopup() {
        this.setState({ showPopup: true });
    }

    onSubmitSetting(e) {
        e.preventDefault();
    }

    onNotify(e) {
        this.props.onNotify(e);
    }

    logOut() {
        if (this.isCalled() && !window.confirm("You are calling")) {
            return;
        }
        this.props.stopCall();
        this.props.unregisterSip();
        this.props.logOut();
    }

    sendDTMF(e) {
        if (!this.isCalled())
            return;
        this.props.action.sendDTMF(e);
    }

    isCalling() {
        return this.props.call && this.props.call.direction && this.props.call.status;
    }

    isCalled() {
        return this.props.call && this.props.call.direction && this.props.call.status && this.props.call.status == 'callStatus/ACTIVE';
    }

    isRegistered() {
        return this.props.sip && this.props.sip.status && this.props.sip.status == 'sipStatus/REGISTERED';
    }

    render() {
        const isCalling = this.isCalling();
        const isCalled = this.isCalled();

        const shwoRecvCall = (isCalling && this.props.call.status == 'callStatus/STARTING' && this.props.call.direction == 'callDirection/INCOMING') ? true : false;
        const startTime = this.props.rtcSession && this.props.rtcSession.start_time ? this.props.rtcSession.start_time : null;
        const calltype = (isCalling && this.props.call.calltype) ? this.props.call.calltype : null;

        const uri = (this.props.rtcSession
            && this.props.rtcSession.remote_identity
            && this.props.rtcSession.remote_identity.uri) ? this.props.rtcSession.remote_identity.uri : null;

        const layout = (this.state.layout == '/session' && !uri) ? '/phone' : this.state.layout;

        if (layout == '')
            layout = 'phone';

        const calllogs = this.props.call && this.props.call.calllogs ? this.props.call.calllogs : [];

        const canHold = this.props.rtcSession && this.props.rtcSession.isEstablished();

        const registered = this.isRegistered();

        const session = {
            setting: this.props.setting,
            uri: uri,
            calltype: calltype,
            calllogs: calllogs,
            isCalling: isCalling,
            isCalled: isCalled,
            startTime: startTime,
            canHold: canHold,
            localHold: this.props.localHold,
            muteStatus: this.props.muteStatus,
            registered: registered
        };

        const action = {
            ...this.props.action,
            requestConsent: function (e, n) { this.requestConsent(e, n) }.bind(this),
            removeCallLog: function (e) { this.props.action.removeCallLog(e) }.bind(this),
            showPopup: function () { this.showPopup() }.bind(this),
            onChange: function (e, v) { this.onChange(e, v) }.bind(this),
            changePhone: function (e, k) { this.changePhone(e, k) }.bind(this),
            changeHold: function () { this.changeHold(); }.bind(this),
            startCall: function (e) { this.startCall(e); }.bind(this),
            stopCall: function () { this.stopCall() }.bind(this),
            answerCall: function () { this.answerCall() }.bind(this),
            onNotify: function (e) { this.onNotify(e) }.bind(this),
            sendDTMF: function (e) { this.sendDTMF(e) }.bind(this),
            changeSetting: function (k, v) { this.props.changeSetting(k, v) }.bind(this),
            showConfirm: function (k, v) { this.props.showConfirm(k, v) }.bind(this),
        };

        const stateLayout = {
            showMenu: this.state.showMenu,
            numDisplay: this.state.numDisplay,
            contacts: this.state.contacts,
            consents: this.state.consents
        }

        return (
            <div>
                <If condition={shwoRecvCall}>
                    <Incoming action={action} session={session} stateLayout={stateLayout} remote_identity={this.props.remote_identity} />
                </If>
                <Modal show={this.state.showRequestConsent}
                    dialogClassName="request-modal"
                    backdrop="static"
                    keyboard={false}
                    centered={true}
                >
                    <Modal.Header>
                        <div className="ttl_main">Yêu cầu quyền gọi</div>
                        <div className="btn-close" onClick={() => this.setState({ showRequestConsent: false, userRequestConsent: { user_id: '', name: '' } })}></div>
                    </Modal.Header>

                    <Modal.Body>
                        <div className="request-modal-body">
                            {this.state.errorMsg && <div class="nofi_label noti_red noti_sm mb-16">
                                <div class="flexBox midle"><i class="icon_noti noti_time"></i>
                                    <div class="sub w_full pl-9">{this.state.errorMsg}</div>
                                </div>
                            </div>
                            }
                            <div className="text">OA cần được người dùng cấp quyền để thực hiện cuộc gọi. Vui lòng chọn lý do gọi để xin cấp quyền.</div>
                            <div className="text mt-16" style={{ marginBottom: '10px' }}> <strong style={{ fontWeight: "700" }}>Chọn loại cuộc gọi</strong></div>
                            <Form.Select aria-label="" className='form-control' onChange={this.onChangeTypeCall.bind(this)}>
                                <option value="audio">Audio</option>
                                <option value="video">Video</option>
                            </Form.Select>

                            <div className="text mt-16"> <strong style={{ fontWeight: "700" }}>Chọn lý do gọi</strong></div>
                            <div className="list_option">
                                <Form.Check type="radio" name="radio" onChange={() => this.handleChangeRadio(101)} label="Tư vấn sản phẩm/ dịch vụ" />
                                <Form.Check type="radio" name="radio" onChange={() => this.handleChangeRadio(102)} label="Đặt lịch / đặt hẹn" />
                                <Form.Check type="radio" name="radio" onChange={() => this.handleChangeRadio(103)} label="Thông báo đơn hàng" />
                            </div>
                            <div className="nofi_label noti_defaul">
                                <div className={"flexBox midle heading " + (this.state.activeMore ? "active" : "")} onClick={() => this.setState({ activeMore: !this.state.activeMore })}>
                                    <div className="icon_more">
                                        <i className="icon_noti"></i><strong>Tìm hiểu thêm</strong>
                                    </div>
                                    <i className="icon_down"></i></div>
                                <div className="list_dirc list_sm mt-6" style={{ display: this.state.activeMore ? "block" : "none" }}>
                                    <li>Yêu cầu có hiệu lực trong 24h. Quá thời gian này, OA cần gửi lại yêu cầu mới để xin cấp quyền.</li>
                                    <li>OA có thể gửi tối đa 3 yêu cầu gọi trong 72 giờ.</li>
                                    <li>OA chỉ có thể gọi trong khoảng thời gian được Người dùng cho phép và trong khung giờ 7h - 21h.</li>
                                </div>
                            </div>
                            <Button variant="primary" className="btn-request"
                                onClick={() => this.sendRequestConsent(this.state.userRequestConsent.user_id, this.state.userRequestConsent.name)}
                            >Gửi yêu cầu</Button>
                        </div>
                    </Modal.Body>
                </Modal>
                <div className="d-flex" style={{
                    margin: "0", padding: "0", overflowX: "hidden",
                    background: "white", color: "rgba(255,255,255,1.0)", minHeight: '100vh'
                }}>
                    <input type="checkbox" id="check" />
                    <label htmlFor="check">
                        <i className="fas fa-arrow-left" ref={this.cancleMenuRef} id="cancel" onClick={() => this.showMenu(false)}></i>
                        <i className="fas fa-arrow-right" ref={this.openMenuRef} id="showMenu" onClick={() => this.showMenu(true)}></i>
                    </label>
                    <div id="sidebar">
                        <div id="profile_info">
                            <div>
                                <div id="profile_img">
                                    <span className={this.convertSipStatus(this.props.sip ? this.props.sip.status : '')}></span>
                                </div>
                                <div id="profile_data">
                                    <p id="name">{this.props.user ? this.props.user.name : ''}</p>
                                </div>
                            </div>
                        </div>

                        <ul>

                            {
                                allRoutes.map((route) => {
                                    return (
                                        <SidebarItem
                                            key={route.key}
                                            route={route}
                                            onClick={this.onClickMenu.bind(this)}
                                            active={route.path == layout}
                                        />
                                    )
                                })
                            }
                            <div style={{ border: 'solid 1px #5c5b5b' }}></div>

                            <If condition={uri}>
                                <SidebarItem
                                    route={{ path: '/session', className: 'fas fa-user', featureName: uri ? (uri.display_name || uri.user) : '' }}
                                    active={'/session' == layout}
                                    onClick={this.onClickMenu.bind(this)}
                                />
                            </If>

                        </ul>

                    </div>

                    <Setting show={this.state.showPopup}
                        onHide={() => this.setState({ showPopup: false })}
                        logOut={this.props.logOut.bind(this)}
                        session={session}
                        action={action}
                        onSubmitSetting={this.onSubmitSetting.bind(this)}
                    />

                    {/*Start Content Area */}

                    <div className="container container-body" style={{
                        width: '100%',
                        padding: '0px',
                        margin: '0px',
                        maxWidth: '100%'
                    }}>
                        {allRoutes.map((route) => {
                            return (
                                <div key={route.key} className="row d-flex justify-content-center">
                                    <div style={{ display: route.path == layout ? 'contents' : 'none' }}>
                                        {React.cloneElement(route.component, { session: session, action: action, stateLayout: stateLayout })}
                                    </div>
                                </div>
                            )
                        })}

                        <If condition={uri}>
                            <div className="row d-flex justify-content-center">
                                <div style={{ display: '/session' == layout ? 'contents' : 'none' }}>
                                    <Session {...this.props} session={session} action={action} stateLayout={stateLayout} />
                                </div>
                            </div>
                        </If>
                    </div>
                </div>

            </div>
        )
    }
}
