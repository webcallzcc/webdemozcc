import React from 'react';
import SidebarRight from '../layout/SidebarRight';
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import '../css/Setting.css';

export class Setting extends React.Component {

    constructor(props) {
        super(props);

    }

    onChange = e => this.props.action.changeSetting(e.target.name, e.target.value);

    onChangeSelect = (e, k, v) => this.props.action.changeSetting('autoAnswer', v);

    render() {
        return (
            <SidebarRight show={this.props.show} onHide={this.props.onHide}>

                <form id='setting'>
                    <div className='sidebar-header-title'>
                        <h2>Setting</h2>
                    </div>
                    <div className='item'>
                        <SelectField
                            floatingLabelText='Auto Answer'
                            name='autoAnswer'
                            value={this.props.session.setting.autoAnswer || 0}
                            fullWidth
                            inputStyle={{ color: '#fff' }}
                            floatingLabelStyle={{ color: '#fff' }}
                            labelStyle={{ color: '#fff' }}
                            onChange={this.onChangeSelect}
                        >
                            <MenuItem value={0} primaryText='OFF' />
                            <MenuItem value={1} primaryText='ON' />
                        </SelectField>
                    </div>


                    <div className='item buttons button-logout'>
                        <RaisedButton
                            label='Logout'
                            primary
                            style={{ display: 'block' }}
                            onClick={() => this.props.logOut && this.props.logOut()}
                        />
                    </div>
                </form>
            </SidebarRight>
        )
    }
}

export default Setting;
