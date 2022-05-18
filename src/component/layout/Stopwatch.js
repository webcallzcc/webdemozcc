import React, { Component } from 'react'
import moment from 'moment';

class Stopwatch extends Component {

    constructor(props) {
        super(props);
        this.state = {
            time: '00:00',
        }
        this.intervalTimer = null;
        this.mounted = false;
    }

    componentDidMount() {
        this.mounted = true;

        this.intervalTimer = setInterval(function () {
            if (!this.mounted)
                return;
            var now = this.props.startTime ? Date.now() - this.props.startTime : 0;
            this.setState({ time: moment.duration(now).asHours().toFixed() + ":" + moment(now).format("mm:ss") })

        }.bind(this), 1000);

    }

    componentWillUnmount() {
        this.mounted = false;
        if (this.intervalTimer) {
            clearInterval(this.intervalTimer);
        }
        this.intervalTimer = null;

    }


    render() {

        return (
            <span>{this.state.time}</span>
        );
    }
}

export default Stopwatch
