import React from 'react';
import { If } from './Condition';
import CloseIcon from '../icon/CloseIcon';

export class SidebarRight extends React.Component {
    render() {
        return (
            <div className='sidebar-right-show' style={{ width: this.props.show ? '100%' : '0px' }}>
                <div className='sidebar-right' style={{ width: this.props.show ? '300px' : '0px' }}>

                    <div className='sidebar-close' onClick={() => this.props.onHide && this.props.onHide()}>
                        <CloseIcon className='sidebar-close-svg' />
                    </div>
                    <If condition={this.props.show}>
                        {this.props.children}
                    </If>
                </div>
            </div>

        )
    }
}

export default SidebarRight;
