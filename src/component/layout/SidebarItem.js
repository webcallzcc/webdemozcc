import React from 'react';

export class SidebarItem extends React.Component {
    render() {
        const path = this.props.route ? this.props.route.path : '';
        const className = this.props.route ? this.props.route.className : '';
        const featureName = this.props.route ? this.props.route.featureName : '';

        return (
            <div style={{ backgroundColor: this.props.active ? '#e5efff' : '#fff' }}>
                <div>
                    <li onClick={() => this.props.onClick && this.props.onClick(path)}>
                        <a id="linkOne" style={{ color: this.props.active ? 'rgb(255, 64, 84)' : '#001a33' }}>
                            <i className={className}></i><span id="menuOne">{featureName}</span>
                        </a>
                    </li>
                </div>
            </div >
        )
    }
}

export default SidebarItem;
