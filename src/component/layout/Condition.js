import React from 'react';

export class If extends React.Component {
    render() {
        if (this.props.condition) {
            return (
                <React.Fragment> {this.props.children} </React.Fragment>
            )
        }
        return (<React.Fragment></React.Fragment>)
    }
}

export class ElseIf extends React.Component {
    render() {
        if (this.props.condition) {
            return (
                <React.Fragment> {this.props.children} </React.Fragment>
            )
        }
        return (<React.Fragment></React.Fragment>)
    }
}

export class Else extends React.Component {
    render() {
        if (!this.props.condition) {
            return (
                <React.Fragment> {this.props.children} </React.Fragment>
            )
        }
        return (<React.Fragment></React.Fragment>)
    }
}

export class IfFragment extends React.Component {
    render() {
        if (this.props.condition !== undefined && !this.props.condition) {
            return (<></>)
        }
        const length = this.props.children.length;
        if (this.props.children[0].type != If) {
            throw "First child in IfFragment must is If";
        }
        for (var i = 1; i < length - 1; i++) {
            if (this.props.children[i].type == If || this.props.children[i].type == Else) {
                throw "Contents Component in IfFragment can not If or Eles";
            }
        }
        if (length > 1) {
            if (this.props.children[length - 1].type == If) {
                throw "Last child in IfFragment can not If";
            }
        }

        for (var i = 0; i < length; i++) {
            if (this.props.children[i].type == If || this.props.children[i].type == ElseIf) {
                if (this.props.children[i].props.condition) {
                    return (<React.Fragment>{this.props.children[i].props.children}</React.Fragment>)
                }
            } else if (this.props.children[i].type == Else) {
                return (<React.Fragment>{this.props.children[i].props.children}</React.Fragment>)
            }
        }
        return (<React.Fragment></React.Fragment>)
    }
}
