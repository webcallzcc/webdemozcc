import React from 'react'
import '../css/Login.css'
import SettingsIcon from 'material-ui/svg-icons/action/settings';
import TextField from 'material-ui/TextField'
import { Modal, Button, Overlay, Popover } from 'react-bootstrap';

export default class NewLogin extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      name: '',
      auth: '',
      password: '',
      socket: '',
      host: '',
      appId: '',
      hostopenapi: '',
      oaAccessToken: ''
    }

  }

  componentDidMount() {
    const user = localStorage.getItem('userLogin');
    if (user) {
      const userLogin = JSON.parse(user);
      this.setState({ name: userLogin.name || '', auth: userLogin.auth || '', password: userLogin.password || '' })
    }
    this.setState({ ...this.props.config })
  }

  onChange = e => this.setState({ [e.target.name]: e.target.value });


  onSubmit = e => {
    e.preventDefault();
    if (!this.state.name) {
      return;
    } else if (!this.state.auth) {
      return;
    } else if (!this.state.name) {
      return;
    }
    const userLogin = {
      name: this.state.name || '',
      auth: this.state.auth || '',
      password: this.state.password || ''
    }

    this.props.setUserLogin(userLogin);

    // this.props.history.push("/");
  }

  handleSubmitConfig() {
    const config = {
      socket: this.state.socket || '',
      host: this.state.host || '',
      appId: this.state.appId || '',
      hostopenapi: this.state.hostopenapi || '',
      oaAccessToken: this.state.oaAccessToken || '',
    }

    this.props.setConfig(config);

    this.setState({ showConfig: false });
  }
  handleGetOaAccessToken() {
    window.open("https://developers.zalo.me/tools/explorer/" + this.state.appId, "_blank");
  }

  handleClickSettings() {
    this.setState({ showConfig: true });
  }

  hanleHiddenConfig() {
    this.setState({ showConfig: false });
  }

  render() {
    return (
      <div>
        <div className="bg-svg"/>
        <div id="container">
          <div className="login-content">
            <form id="loginForm" onSubmit={this.onSubmit}>
              <div className='settings-icon-container'>
                <SettingsIcon
                  className='icon'
                  color='#666'
                  hoverColor='#333'
                  onClick={this.handleClickSettings.bind(this)}
                />
              </div>
              <div id="proImg">
                <div>Login CRM</div>
              </div>
              <h2 className="title"></h2>

              <div className="input-div one">
                <div className="i">
                  <i className="fas fa-user"></i>
                </div>
                <div id="user">
                  <input name="name" value={this.state.name} onChange={this.onChange} type="text" id="inputUser" placeholder='Tài khoản' required />
                </div>
              </div>

              <div className="input-div one">
                <div className="i">
                  <i className="fas fa-key"></i>
                </div>
                <div id="auth">
                  <input name="auth" value={this.state.auth} onChange={this.onChange} type="text" id="inputAuth" placeholder='Khóa xác thực' required />
                </div>
              </div>

              <div className="input-div pass">
                <div className="i">
                  <i className="fas fa-lock"></i>
                </div>
                <div id="passwd">
                  <input name="password" value={this.state.password} onChange={this.onChange} type="password" id="inputPass" placeholder='Mật khẩu' required />
                </div>
              </div>
              <input type="submit" id="btn" value="Đăng nhập" disabled={this.props.state == 'loginloading'} />
            </form>
          </div>
        </div>

        <Modal show={this.state.showConfig}
          aria-labelledby="contained-modal-title-vcenter"
          backdrop="static"
          keyboard={true}
          centered={true}
          onHide={(e) => this.hanleHiddenConfig()}
        >
          <Modal.Header>
            <div className="ttl_main">ZCC Settings</div>
            <div className="btn-close" onClick={() => this.hanleHiddenConfig()}></div>
          </Modal.Header>

          <Modal.Body>
            <div className="config-modal-body">
              <div className='item'>
                <TextField
                  floatingLabelText='Host server'
                  name='host'
                  value={this.state.host || ''}
                  floatingLabelFixed
                  fullWidth
                  onChange={this.onChange.bind(this)}
                />
              </div>

              <div className='item'>
                <TextField
                  floatingLabelText='WebSocket URI'
                  name='socket'
                  value={this.state.socket || ''}
                  floatingLabelFixed
                  fullWidth
                  onChange={this.onChange.bind(this)}
                />
              </div>

              <div className='item'>
                <TextField
                  floatingLabelText='Host OpenAPI'
                  name='hostopenapi'
                  value={this.state.hostopenapi || ''}
                  floatingLabelFixed
                  fullWidth
                  onChange={this.onChange.bind(this)}
                />
              </div>

              <div className='item'>
                <TextField
                  floatingLabelText='App ID'
                  name='appId'
                  value={this.state.appId || ''}
                  floatingLabelFixed
                  fullWidth
                  onChange={this.onChange.bind(this)}
                />
              </div>

              <div className='item'>
                <TextField
                  floatingLabelText='OA Access Token'
                  name='oaAccessToken'
                  value={this.state.oaAccessToken || ''}
                  floatingLabelFixed
                  style={{ width: 'calc(100% - 50px)' }}
                  onChange={this.onChange.bind(this)}
                />
                <Button style={{ width: '50px' }}
                  variant="dark"
                  onClick={() => this.handleGetOaAccessToken()}>Get</Button>
              </div>

            </div>
          </Modal.Body>

          <Modal.Footer style={{ justifyContent: 'space-around' }}>
            <Button style={{ width: '150px' }} variant="danger" onClick={() => this.hanleHiddenConfig()}>CANCLE</Button>
            <Button style={{ width: '150px' }} variant="primary" onClick={() => this.handleSubmitConfig()}>OK</Button>
          </Modal.Footer>
        </Modal>
      </div>
    )
  }
}

