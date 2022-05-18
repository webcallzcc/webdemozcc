import React, { Component } from 'react';
import './component/css/App.css';
import { SipProvider } from '@webcallzcc/react-sip';
import Confirm from './component/container/Confirm';
import Notifier from './component/container/Notifier';
import Loading from './component/container/Loading';
import Login from './component/container/Login';
import Dashboard from './component/container/Dashboard';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import APIUtils from './utils/APIUtils';

class App extends Component {


  constructor(props) {
    super(props);

    let user = { name: '', password: '' };
    let step = 'login';
    try {
      const userStr = localStorage.getItem('userLogin');
      if (userStr) {
        const userLogin = JSON.parse(userStr);
        if (userLogin.name && userLogin.auth && userLogin.password) {
          user = userLogin;
          step = 'loading';
        }
      }
    } catch (ex) {

    }


    let setting = { autoAnswer: 0 };

    try {
      const settingStr = localStorage.getItem('settingCalls');
      if (settingStr) {
        setting = JSON.parse(settingStr);
      }
    } catch (ex) {

    }

    var configSip = {}

    try {
      const config = localStorage.getItem('configSip');
      if (config) {
        configSip = JSON.parse(config);
      }
    } catch (ex) {
    }

    for (var k in window.SETTING) {
      if (k && window.SETTING[k]) {
        configSip[k] = window.SETTING[k];
      }
    }

    this.state = {
      user: user,
      setting: setting,
      config: configSip,
      step: step,
      confirm: {
        show: false
      }
    }
    this.notifierRef = React.createRef();

  }

  componentDidMount() {
    APIUtils.setAccessToken(this.state.config.oaAccessToken);
    APIUtils.setHostAPI(this.state.config.hostopenapi);
  }

  onRegister() {
    if (this.state.step == 'phone') {
      return;
    }
    localStorage.setItem('userLogin', JSON.stringify(this.state.user));
    this.setState({ step: 'phone' });
  }

  onRegisterFailed(data) {
    if (this.state.step == 'loginloading' || this.state.step == 'loading') {
      this.state.user.password = '';
      this.setState({ step: 'login', user: this.state.user });
    }
  }

  logOut() {
    const user = localStorage.getItem('userLogin');
    if (user) {
      const userLogin = JSON.parse(user);
      userLogin.password = '';
      localStorage.setItem('userLogin', JSON.stringify(userLogin));
      this.setState({ user: userLogin, step: 'login' });
    } else {
      this.setState({ user: { name: '', password: '' }, step: 'login' });
    }
  }

  onNotify(data) {
    if (this.state.step == 'loading')
      return;
    this.notifierRef.current.notify(data);
  }

  oneHideNotification(uid) {
    this.notifierRef.current.hideNotification(uid);
  }

  setUserLogin(userLogin) {
    if (userLogin.name && userLogin.auth && userLogin.password) {
      this.setState({ user: userLogin, step: 'loginloading' });
      return;
    }
  }

  changeSetting(name, value) {
    this.state.setting[name] = value;
    this.setState({ setting: this.state.setting });
    localStorage.setItem('settingCalls', JSON.stringify(this.state.setting));
  }

  showConfirm(title, callback) {
    this.setState({ confirm: { show: true, title: title, callback: callback } });
  }

  closeConfirm() {
    this.setState({ confirm: { show: false, title: "", callback: null } });
  }

  setConfig(config) {
    this.setState({ config: config });
    localStorage.setItem('configSip', JSON.stringify(config));
    APIUtils.setAccessToken(config.oaAccessToken);
    APIUtils.setHostAPI(config.hostopenapi);

  }

  render() {

    return (
      <MuiThemeProvider>
        <div className="App">

          <Confirm confirm={this.state.confirm} close={this.closeConfirm.bind(this)} />
          <Notifier ref={this.notifierRef} />
          <SipProvider
            host={window.SETTING.host || this.state.config.host}
            socket={window.SETTING.socket || this.state.config.socket}
            user={this.state.user.name}
            auth={this.state.user.auth}
            password={this.state.user.password}
            noPassword={false}
            autoRegister={true}
            autoAnswer={this.state.setting.autoAnswer ? true : false}
            iceRestart={false}
            streamLocalId='local-video'
            streamRemoteId='remote-video'
            sessionTimersExpires={120}
            extraHeaders={{ register: [], invite: [] }}
            iceServers={[
            ]}
            onRegister={this.onRegister.bind(this)}
            onRegisterFailed={this.onRegisterFailed.bind(this)}
            onNotify={this.onNotify.bind(this)}
            debug={false} // whether to output events to console; false by default
          >
            {
              (this.state.step === 'login' || this.state.step === 'loginloading') && <Login
                {...this.props}
                step={this.state.step}
                user={this.state.user}
                config={this.state.config}
                setConfig={this.setConfig.bind(this)}
                onNotify={this.onNotify.bind(this)}
                logOut={this.logOut.bind(this)}
                setUserLogin={this.setUserLogin.bind(this)} />

            }
            {this.state.step === 'loading' && <Loading  {...this.props} user={this.state.user} />}
            {this.state.step === 'phone' && <Dashboard
              {...this.props}
              user={this.state.user}
              onNotify={this.onNotify.bind(this)}
              logOut={this.logOut.bind(this)}
              setting={this.state.setting}
              showConfirm={this.showConfirm.bind(this)}
              changeSetting={this.changeSetting.bind(this)}
            />}

          </SipProvider>

        </div>
      </MuiThemeProvider>
    );
  }

}

export default App;
