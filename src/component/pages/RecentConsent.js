import React from 'react'
import moment from 'moment';
import "../css/RecentConsent.css";
import Stopwatch from '../layout/Stopwatch';
import DataTable from "react-data-table-component";
import TextField from 'material-ui/TextField';
import OutgoingIcon from '../icon/OutgoingIcon';
import IncomingIcon from '../icon/IncomingIcon';
import MoreIcon from '../icon/MoreIcon';

const customStyles = {

    rows: {
        style: {
            backgroundColor: 'rgb(5,9,15)',
            color: '#fff',
            borderBottom: 'solid 1px #fff'
        },
        selectedHighlightStyle: {
            backgroundColor: 'rgb(5,9,15)',
            color: '#fff'
        },
        highlightOnHoverStyle: {
            backgroundColor: 'rgb(5,9,15)',
            color: '#fff'
        }
    },
    headCells: {
        style: {
            backgroundColor: 'rgb(5,9,15)',
            color: '#fff'
        },
    },
    pagination: {
        style: {
            backgroundColor: 'rgb(5,9,15)',
            color: '#fff'
        },
        pageButtonsStyle: {
            backgroundColor: 'rgb(5,9,15)',
            color: '#fff',
            fill: '#fff'
        }
    },
    noData: {
        style: {
            backgroundColor: 'rgb(5,9,15)',
            color: '#fff'
        }
    }
};


class RecentConsent extends React.Component {


    constructor(props) {
        super(props);

        this.state = {
            update: false,
            numDisplay: '',
            logs: []
        }
        this.mounted = false;
        this.columns = [
            {
                name: "Id/Tên/SĐT",
                sortable: true,
                minWidth: "200px",
                cell: d =>

                    <span>
                        {this.getName(d.user_id, d.name)}
                    </span>
            },
            {
                name: "Id/SĐT",
                sortable: true,
                minWidth: "200px",
                cell: d =>
                    <span>
                        {d.user_id}
                    </span>
            },
            {
                name: "Trạng thái",
                selector: d => d.status,
                minWidth: "100px",
                sortable: true,
                cell: d => <span>{d.msg}</span>

            },
            {
                name: "Thời gian",
                minWidth: "150px",
                selector: d => d.start,
                sortable: true,
                cell: d => <span style={{ textTransform: 'uppercase' }}>{moment(d.start).format('YY/MM/DD HH:mm:ss')}</span>
            },
            {
                name: "",
                sortable: false,
                maxWidth: "150px",
                minWidth: "150px",
                cell: d => {
                    return (
                        <div>
                            {
                                (d.msg === 'User approved the request') &&
                                <div>
                                    <button className='btn btn-primary btn-fa' onClick={() => this.props.action.changePhone(d.user_id, false)} ><i className="fa fa-keyboard"></i></button>
                                    <button className='btn btn-primary btn-fa' onClick={() => this.props.action.changePhone(d.user_id, true)} ><i className="fa fa-phone-alt"></i></button>
                                </div>
                            }
                            {
                                (d.msg != "Waitting for user approval" && d.msg != "User approved the request") &&
                                <div>
                                    <button className='btn btn-primary btn-fa'
                                        onClick={() => this.props.action.requestConsent(d.user_id, d.display_name)} ><i className="fa fa-credit-card"></i></button>
                                </div>

                            }
                        </div>
                    )
                }

            }

        ];
    }

    comparePhone(e, phone) {
        var phoneno = /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/;
        if (!phone || !e || !e.shared_info || !e.shared_info.phone) return false;
        if (!phone.match(phoneno)) return false;
        phone = phone + "";


        if (phone.startsWith("0")) {
            phone = "84" + phone.substr(1);
        }
        return e.shared_info.phone + "" == phone;

    }


    getName(user_id) {
        var user = this.props.stateLayout.contacts.find(e => e.user_id === user_id || this.comparePhone(e, user_id));
        if (user)
            return user.display_name;
        return user_id;
    }

    componentDidMount() {
        this.mounted = true;
    }

    componentDidUpdate() {
    }

    componentWillUnmount() {
        this.mounted = false;
    }

    getTime(start, stop) {
        if (!start || !stop)
            return "00:00:00";
        var now = stop - start;
        return moment.duration(now).asHours().toFixed() + ":" + moment(now).format("mm:ss");
    }


    onChange = e => this.setState({ [e.target.name]: e.target.value });

    formatPhone(phone) {

        var num;

        if (phone.indexOf('@')) {
            num = phone.split('@')[0];
        } else {
            num = phone;
        }

        num = num.toString().replace(/[^0-9]/g, '');

        if (num.length === 10) {
            return '(' + num.substr(0, 3) + ') ' + num.substr(3, 3) + '-' + num.substr(6, 4);
        } else if (num.length === 11) {
            return '(' + num.substr(1, 3) + ') ' + num.substr(4, 3) + '-' + num.substr(7, 4);
        } else {
            return num;
        }
    }
    compareName(e, search) {
        if (e.user_id.indexOf(search) !== -1)
            return true;
        return this.convertVN(e.name).indexOf(this.convertVN(search));
    }

    convertVN(str) {
        if (!str) return "";
        str = str.toLowerCase();
        str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, "a");
        str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, "e");
        str = str.replace(/ì|í|ị|ỉ|ĩ/g, "i");
        str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, "o");
        str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, "u");
        str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, "y");
        str = str.replace(/đ/g, "d");
        // Some system encode vietnamese combining accent as individual utf-8 characters
        str = str.replace(/\u0300|\u0301|\u0303|\u0309|\u0323/g, ""); // Huyền sắc hỏi ngã nặng 
        str = str.replace(/\u02C6|\u0306|\u031B/g, ""); // Â, Ê, Ă, Ơ, Ư
        return str;
    }
    render() {

        const consents = this.props.stateLayout.consents.map(e => { return { ...e, name: this.getName(e.user_id) } });

        return (
            <div className="container" id="recent-consent">
                <div className="row d-flex justify-content-center">
                    <div className="card col-sm-12" style={{ padding: 0 }}>
                        <div className="card-header up" style={{ padding: '3px' }}>
                            <div className=" form-group col-sm-12 phoneNum" >
                                <TextField
                                    name="numDisplay"
                                    className="numDisplay"
                                    fullWidth
                                    underlineShow={false}
                                    placeholder="Tên hoặc SĐT"
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
                                    value={this.state.numDisplay}
                                    onChange={this.onChange}
                                />
                                <div className='icon-more' onClick={() => this.props.action.showPopup()}>
                                    <MoreIcon className='icon-more-svg' />
                                </div>
                            </div>
                        </div>
                        <div className="card-body d-flex justify-content-center" style={{ padding: 0, marginLeft: this.props.stateLayout.showMenu ? '200px' : 'inherit' }}>

                            <div id='recent-consent-body'>
                                <DataTable
                                    columns={this.columns}
                                    data={consents.filter(e =>
                                        !this.state.numDisplay || this.compareName(e, this.state.numDisplay) !== -1
                                    )}
                                    noHeader
                                    defaultSortField="start"
                                    defaultSortAsc={false}
                                    pagination
                                    highlightOnHover
                                    // customStyles={customStyles}
                                    noDataComponent={(<div style={{
                                        width: '100%',
                                        height: '100px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center'
                                    }} >Không có lịch sử xin quyền gọi gần đây</div>)}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default RecentConsent
