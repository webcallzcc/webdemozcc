import React from 'react';

export default class HoldIcon extends React.Component {

    render() {
        return (
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 80" width="1.5em" height="1.5em" {...this.props}><path d="M55.6 50.8c-1.1-.7-2.2.7-6.6 3.5-4.4 2.8-13.8-6.6-14.8-7.6 0 0-11.1-9.8-8.4-14.6 2.6-4.6 4-5.7 3.3-6.8-.7-1-6.9-9.2-8.1-10-1.1-.8-4.1-.2-6.9 3.3-2.8 3.6-4.8 7.5.7 17C21 46.5 27.4 52.3 28.1 52.8c0 0 6 6.5 17.8 12.7 9.8 5.1 13.6 2.9 17 0 3.4-2.9 3.9-5.9 3-7-.9-1.2-9.3-7-10.3-7.7zm-2.2-39.4h5v22.1h-5zm10.4 0h5v22.1h-5z"></path></svg>
        )
    }
}