import React from 'react'
import TextField from 'material-ui/TextField';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import RaisedButton from 'material-ui/RaisedButton';
import DataTable from "react-data-table-component";
import MoreIcon from '../icon/MoreIcon';
import AddUserIcon from '../icon/AddUserIcon';
import CloseIcon from '../icon/CloseIcon';
import "../css/Contact.css";
import ZaloOpenAPI from '../../utils/ZaloOpenAPI';

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


class Contact extends React.Component {


    constructor(props) {
        super(props);

        this.state = {
            numDisplay: ''
        }
        this.mounted = false;
        this.columns = [
            {
                name: "Name",
                sortable: true,
                minWidth: "200px",
                selector: d => d.name,
                cell: d => <span>
                    <img className='img-contact' src={d.avatar}/>
                    {d.display_name}</span>
            },
            {
                name: "ID",
                minWidth: "200px",
                sortable: true,
                selector: d => d.user_id,
            },
            {
                name: "Phone",
                sortable: false,
                minWidth: "150px",
                cell: d => <span>
                    {d.shared_info && d.shared_info.phone}
                </span>

            },
            {
                name: "Note",
                sortable: true,
                cell: d => <span>
                </span>
            },
            {
                name: "",
                sortable: false,
                maxWidth: "150px",
                minWidth: "150px",
                cell: d => {
                    return (
                        <div>
                            <button className='btn btn-primary btn-fa'
                                disabled={this.props.session.isCalling}
                                onClick={() => this.props.action.changePhone(d.user_id, false)}><i className="fa fa-keyboard"></i></button>
                            <button className='btn btn-primary btn-fa'
                                disabled={this.props.session.isCalling}
                                onClick={() => this.props.action.changePhone(d.user_id, true)} ><i className="fa fa-phone-alt"></i></button>
                            <button className='btn btn-primary btn-fa'
                                onClick={() => this.props.action.requestConsent(d.user_id, d.display_name)} ><i className="fa fa-credit-card"></i></button>
                        </div>
                    )
                }

            }
        ];
    }

    componentDidMount() {
        this.mounted = true;
    }

    componentWillUnmount() {
        this.mounted = false;
    }



    onChange = e => this.setState({ [e.target.name]: e.target.value });

    compareName(clid, user, search) {
        if (clid.indexOf(search) != -1)
            return true;
        return this.convertVN(user).indexOf(this.convertVN(search));
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
        return str.toLowerCase();
    }

    render() {

        return (

            <div className="container" id="contact">
                <div className="row d-flex justify-content-center">
                    <div className="card col-sm-12" style={{ padding: 0 }}>
                        <div className="card-header up" style={{ padding: '3px' }}>
                            <div className=" form-group col-sm-12 phoneNum" >
                                <TextField
                                    name="numDisplay"
                                    className="numDisplay"
                                    fullWidth
                                    underlineShow={false}
                                    placeholder="Name / Phone ..."
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
                                    <MoreIcon className='icon-more-svg' ></MoreIcon>
                                </div>
                            </div>
                        </div>
                        <div className="card-body d-flex justify-content-center" style={{ padding: 0, marginLeft: this.props.stateLayout.showMenu ? '200px' : 'inherit' }}>

                            <div id='contact-body'>
                                <DataTable
                                    columns={this.columns}
                                    data={this.props.stateLayout.contacts.filter(e =>
                                        !this.state.numDisplay || this.compareName(e.user_id, e.display_name, this.state.numDisplay) !== -1
                                    )}
                                    noHeader
                                    pagination
                                    highlightOnHover
                                    // customStyles={customStyles}
                                    noDataComponent={(<div style={{
                                        width: '100%',
                                        height: '100px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center'
                                    }} >Không có danh bạ</div>)}
                                />
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        )
    }
}

export default Contact
