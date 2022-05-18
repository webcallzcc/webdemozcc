import React from 'react'
import TextField from 'material-ui/TextField';
import Stopwatch from '../layout/Stopwatch';
import MoreIcon from '../icon/MoreIcon';
import CalledIcon from '../icon/CalledIcon';

import HangUpIcon from 'material-ui/svg-icons/communication/call-end';
import MicIcon from 'material-ui/svg-icons/av/mic';
import MuteMicIcon from 'material-ui/svg-icons/av/mic-off';
import VideoCamIcon from 'material-ui/svg-icons/av/videocam';
import MuteVideoCamIcon from 'material-ui/svg-icons/av/videocam-off';
import { IfFragment, If, Else } from '../layout/Condition';
import '../css/Session.css'

class Session extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            hasVideo: true
        }
        this.test = null;

    }

    componentDidMount() {
    }

    onChange = e => this.setState({ [e.target.name]: e.target.value });

    getName(clid, phone) {
        var user = this.props.stateLayout.contacts.find(e => e.phone === phone);
        if (user)
            return user.name;
        return clid || phone;
    }



    render() {
        var name = ''
        var pathName = ''
        if (this.props.session.uri) {
            name = this.getName(this.props.session.displayName, this.props.session.uri.user);
            if (name !== this.props.session.uri.user) {
                pathName = this.props.session.uri.user + " (" + name + ")"
            } else {
                pathName = name;
            }
        }
        const hasVideo = (this.props.session.calltype && this.props.session.calltype == 'video') ? true : false;

        return (
            <div className="container" id="session">
                <div className="row d-flex justify-content-center">
                    <div className="card col-sm-12" style={{ padding: 0 }}>
                        <div className="card-header up" style={{ padding: '3px' }}>
                            <div className=" form-group col-sm-12 phoneNum" >
                                <TextField
                                    name="numDisplay"
                                    className="numDisplay"
                                    fullWidth
                                    underlineShow={false}
                                    disabled={true}
                                    placeholder="..."
                                    inputStyle={{
                                        color: '#fff',
                                        textAlign: "center",
                                        fontSize: "45px",
                                    }}
                                    autoComplete="off"
                                    style={{
                                        height: "100%",
                                        display: "flex",
                                        alignItems: "center",
                                    }}
                                    defaultValue={pathName}
                                />
                                <div className='icon-more' onClick={() => this.props.action.showPopup()}>
                                    <MoreIcon className='icon-more-svg' />
                                </div>
                            </div>
                        </div>
                        <div className="card-body d-flex justify-content-center" style={{ padding: 0 }}>

                            <div className='session-body'>
                                <div className="sip-time">
                                    {
                                        this.props.session.isCalling &&
                                        <Stopwatch startTime={this.props.session.startTime} />
                                    }
                                </div>

                                <video
                                    ref='localVideo'
                                    className={'local-video' + (hasVideo ? '' : ' hidden')}
                                    id='local-video'
                                    autoPlay
                                    muted
                                />

                                <video
                                    ref='remoteVideo'
                                    id='remote-video'
                                    className={'remote-video' + (hasVideo ? '' : ' hidden')}
                                    autoPlay
                                />

                                <If condition={!hasVideo}>
                                    <div className='no-remote-video-info'>
                                        <CalledIcon
                                            className='no-remote-btn'
                                            fill={'#000'}
                                        />
                                    </div>
                                </If>
                                <div className='controls-container'>
                                    <div className='controls'>

                                        <IfFragment condition={hasVideo}>
                                            <If condition={this.props.session.muteStatus.video}>
                                                <MuteVideoCamIcon
                                                    className='control'
                                                    color={'#fff'}
                                                    onClick={() => this.props.action.changeMuteVideo(false)}
                                                />
                                            </If>
                                            <Else>
                                                <VideoCamIcon
                                                    className='control'
                                                    color={'#fff'}
                                                    onClick={() => this.props.action.changeMuteVideo(true)}
                                                />
                                            </Else>
                                        </IfFragment>

                                        <HangUpIcon
                                            className='control'
                                            color={'#ff0000'}
                                            onClick={this.props.action.stopCall.bind(this)}
                                        />
                                        <IfFragment>
                                            <If condition={this.props.session.muteStatus.audio}>
                                                <MuteMicIcon
                                                    className='control'
                                                    color={'#fff'}
                                                    onClick={() => this.props.action.changeMuteAudio(false)}
                                                />
                                            </If>
                                            <Else>
                                                <MicIcon
                                                    className='control'
                                                    color={'#fff'}
                                                    onClick={() => this.props.action.changeMuteAudio(true)}
                                                />
                                            </Else>
                                        </IfFragment>

                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div >
        );
    }
}

export default Session
