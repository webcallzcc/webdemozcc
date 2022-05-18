import React from 'react';
import TransitionAppear from '../layout/TransitionAppear';
import '../css/Confirm.css';

export default class Confirm extends React.Component {

    cancle() {
        if (this.props.close)
            this.props.close();
    }
    confirm() {
        if (this.props.confirm && this.props.confirm.callback)
            this.props.confirm.callback();
        this.cancle();
    }

    render() {
        return (
            <TransitionAppear duration={1000}>
                {this.props.confirm.show && <div id="confirm">
                    <div className='confirm-body'>
                        <div className='confirm-title'>
                            <div className='confirm-title-name'>
                                {this.props.confirm.title}
                            </div>
                            {/* <div className='confirm-title-uri'>
                                {this.props.name}
                            </div> */}
                        </div>
                        <div className='confirm-button'>
                            <button className='btn btn-danger confirm-btn-fa'
                                onClick={this.cancle.bind(this)}
                            >
                                Thoát
                            </button>
                            <button className='btn btn-primary confirm-btn-fa'
                                onClick={this.confirm.bind(this)}
                            >
                                Đồng ý
                            </button>
                        </div>
                    </div>
                </div>
                }
            </TransitionAppear>

        )
    }
}

