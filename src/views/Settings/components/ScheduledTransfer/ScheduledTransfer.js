import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import axios from 'axios';
import moment from 'moment';
import { API_BASE_URL } from '../../../../constants'
import { makeStyles } from '@material-ui/styles';
import FilterList from '@material-ui/icons/FilterList';
import PerfectScrollbar from 'react-perfect-scrollbar';
import CurrencyFormat from 'react-currency-format';
import validate from 'validate.js';
import CurrencyTextField from '@unicef/material-ui-currency-textfield';
import { SearchInput } from 'components';
import  { withRouter }  from 'react-router-dom';
import {
  Card,
  CardHeader,
  CardContent,
  CardActions,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
  Button,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TablePagination,
  TextField,
  Typography
} from '@material-ui/core';
import { ScheduleTransfer } from '..';

const useStyles = makeStyles(theme => ({
  root: {},
  dialogTitle: {
    backgroundColor: '#00A479',
    color: '#FFFFFF',
    fontWeight: 'bold',
    boxShadow: '1px 3px 1px'
  },
  dialogTitleFail: {
    backgroundColor: '#F14D4D',
    color: '#FFFFFF',
    fontWeight: 'bold',
    boxShadow: '1px 3px 1px'
  },
  cancelButton: { 
    backgroundColor: 'red', 
    color: 'white',
    fontSize: '80%'
  },
  confirmCancelButton: { 
    backgroundColor: 'white', 
    color: 'red',
    fontSize: '80%'
  },
  row: {
    height: '42px',
    display: 'flex',
    alignItems: 'center',
    marginTop: theme.spacing(0)
  },
  textField: {
    marginTop: theme.spacing(2)
  },
  agreement: {
    marginTop: theme.spacing(1),
    display: 'flex',
    alignItems: 'center'
  },
  agreementCheckbox: {
    marginLeft: '-14px'
  },
  confirmDeactivateButton: {
    marginRight: theme.spacing(1), 
    backgroundColor: 'white', 
    color: 'red',
    fontSize: '80%'
  },
  dialogTitleFail: {
    backgroundColor: '#F14D4D',
    color: '#FFFFFF',
    fontWeight: 'bold',
    boxShadow: '1px 3px 1px'
  },
  filterList: {
    width: '5%',
    marginTop: theme.spacing(1),
    marginLeft: theme.spacing(2),
    marginRight: theme.spacing(2),
    align: 'right'
  },
  flexGrow: {
    flexGrow: 1
  },
  searchInput: {
    marginTop: theme.spacing(2),
    marginLeft: theme.spacing(0),
    marginRight: theme.spacing(1),
  },
  searchButton: {
    marginTop: theme.spacing(2),
    marginRight: theme.spacing(1), 
  }
}));

const schema = {
  cancelationReason: {
    presence: { allowEmpty: false, message: 'minimum 6 characters' },
    length: {
      minimum: 6,
      maximum: 20
    }
  },
  verificationCode: {
    presence: { allowEmpty: false, message: 'is required' },
    length: {
      minimum: 6,
      maximum: 6
    }
  },
  scheduleId: {
    presence: { allowEmpty: false, message: 'is required' },
  }

};

const ScheduledTransfer = props => {
  const { className, history, ...rest } = props;

  const classes = useStyles();

  const [scheduleId, setScheduleId] = useState({});
  const [TransferDate, setTransferDest] = useState({});
  const [branchId, setBranchId] = useState({});
  const [trxAmount, setTrxAmount] = useState({});
  const [trxByUser, setTrxByUser] = useState({});
  const [trxDate, setTrxDate] = useState({});
  const [remarks, setRemarks] = useState({});
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [trxByUserF, setTrxByUserF] = useState('');
  const [trxAmountF, setTrxAmountF] = useState('');
  const [trxDateF, setTrxDateF] = useState('');
  const [dateSign, setDateSign] = useState('');
  const [amountSign, setAmountSign] = useState('');
  const [successMessage, setSuccessMessage] = useState([]);
  const [failMessage, setFailMessage] = useState({});
  const [openUnauthorized, setOpenUnauthorized] = React.useState(false);
  const [openFail, setOpenFail] = React.useState(false);
  const [openSuccess, setOpenSuccess] = React.useState(false);
  const [openSuccessMessage, setOpenSuccessMessage] = React.useState(false);
  const [openList, setOpenList] = React.useState(false);
  const [openFilter, setOpenFilter] = React.useState(false);
  const [cancelDialog, setCancelDialog] = React.useState(false);
  const [ScheduleLists, setScheduleLists] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [dataLength, setDataLength] = useState({});
  const [searchName, setSearchName] = useState();
  const localData = JSON.parse(localStorage.getItem("data"));
  var dateEnded = new Date();

  const [formState, setFormState] = useState({
    isValid: false,
    values: {},
    touched: {},
    errors: {}
  });

  const [formState2, setFormState2] = useState({
    isValid: false,
    values: {
      trxDestName:'',
      trxAmountF:'',
      amountSign:'',
      status:'',
      dateStart: '',
      dateEnd:'',
      transferStatus:''
    },
    touched: {},
    errors: {}
  });

  const hasError = field =>
    formState.touched[field] && formState.errors[field] ? true : false;

  useEffect(() => {
    const errors = validate(formState.values, schema);

    setFormState(formState => ({
      ...formState,
      isValid: errors ? false : true,
      errors: errors || {}
    }));
  }, [formState.values]);
  
  const handleChange = event => {
    event.persist();

    setFormState(formState => ({
      ...formState,
      values: {
        ...formState.values,
        [event.target.name]:
          event.target.type === 'checkbox'
            ? event.target.checked
            : event.target.value
      },
      touched: {
        ...formState.touched,
        [event.target.name]: true
      }
    }));

  };

  const handleChange2 = event => {
    event.persist();

    setFormState2(formState2 => ({
      ...formState2,
      values: {
        ...formState2.values,
        [event.target.name]:
          event.target.type === 'checkbox'
            ? event.target.checked
            : event.target.value
      },
      touched: {
        ...formState2.touched,
        [event.target.name]: true
      }
    }));

  };
  
  // =================================================== Scheduled Transfer List =================================================
  useEffect(() => {
    if (formState2.values.dateEnd != '' && formState2.values.dateStart != ''){
      formState2.values.dateEnd = moment(formState2.values.dateEnd).format('MM/DD/yyyy');
      formState2.values.dateStart = moment(formState2.values.dateStart).format('MM/DD/yyyy');
    }
    axios({
      method: 'GET', 
      url: API_BASE_URL + '/trx-service/v1/scheduleMain/listAllMainSchedule?page=' + page + '&rowsPerPage=' + rowsPerPage
              + '&accountName=' + formState2.values.trxDestName + '&trxAmount=' + formState2.values.trxAmountF + '&dateStart=' + formState2.values.dateStart +
                  '&dateEnd=' + formState2.values.dateEnd + '&amountSign=' + formState2.values.amountSign ,
      // url: API_BASE_URL + '/trx-service/v1/scheduleMain/listAllMainSchedule?page=' + page + '&rowsPerPage=' + rowsPerPage , 
      headers: {
        'Authorization': `Bearer ${localData}`,
        'Content-Type': 'application/json'
      }
    }).then(res =>{
      console.log(page, rowsPerPage)
      let statusCode = res.status
      if (statusCode === 200){
        setScheduleLists(res.data.mainToBranchScheduleList)
        setDataLength(res.data.dataCount)
        // alert(res.data.message)
        // window.location.reload()
      }
    }).catch(err => {
      if (!err.response){
        axios.get(API_BASE_URL + '/login-service/v1/auth/logout', {
          headers: {
            'Authorization': `Bearer ${localData}` 
          }
        })
        .then(res => {
          console.log(res);
          console.log(res.data.message);
          setFailMessage("Connection Error");
          localStorage.clear();
          setOpenUnauthorized(true);       
        })
        .catch(err => {
          console.log(err + localData);
        })
      }
      else if (err.response.status === 401){
        setFailMessage("Unauthorized Access");
        localStorage.clear();
        setOpenUnauthorized(true);
      }
      else {
        console.warn(err)
      }
      // setFailMessage(err.response.data.message)
      // setOpenFail(true)
      // alert(err.response.data.message)
    })
  }, [page, rowsPerPage])

  const handleViewList = () => {
    axios({
      method: 'GET', 
      url: API_BASE_URL + '/trx-service/v1/scheduleMain/listAllMainSchedule?page=' + page + '&rowsPerPage=' + rowsPerPage
              + '&accountName=' + formState2.values.trxDestName + '&trxAmount=' + formState2.values.trxAmountF + '&dateStart=' + formState2.values.dateStart +
                  '&dateEnd=' + formState2.values.dateEnd + '&amountSign=' + formState2.values.amountSign , 
      headers: {
        'Authorization': `Bearer ${localData}`,
        'Content-Type': 'application/json'
      }
    }).then(res =>{
      console.log(formState2.dateStart)
      console.log(formState2.dateEnd)
      console.log(page, rowsPerPage)
      let statusCode = res.status
      if (statusCode === 200){
        setScheduleLists(res.data.mainToBranchScheduleList)
        setDataLength(res.data.dataCount)
        // alert(res.data.message)
        // window.location.reload()
      }
    }).catch(err => {
      if (!err.response){
        axios.get(API_BASE_URL + '/login-service/v1/auth/logout', {
          headers: {
            'Authorization': `Bearer ${localData}` 
          }
        })
        .then(res => {
          console.log(res);
          console.log(res.data.message);
          setFailMessage("Connection Error");
          localStorage.clear();
          setOpenUnauthorized(true);       
        })
        .catch(err => {
          console.log(err + localData);
        })
      }
      else if (err.response.status === 401){
        setFailMessage("Unauthorized Access");
        localStorage.clear();
        setOpenUnauthorized(true);
      }
      else {
        console.warn(err)
      }
      // setFailMessage(err.response.data.message)
      // setOpenFail(true)
      // alert(err.response.data.message)
    })
    setOpenList(true);
  }

  const handleSearch = () => {
    console.log(formState2.values.trxDestName)
    // setSearchName((formState2.values.trxDestName).replace(" ", "%20"))
    if (formState2.values.dateEnd != '' && formState2.values.dateStart != ''){
      formState2.values.dateEnd = moment(formState2.values.dateEnd).format('MM/DD/yyyy');
      formState2.values.dateStart = moment(formState2.values.dateStart).format('MM/DD/yyyy');
    }
    axios({
      method: 'GET', 
      url: API_BASE_URL + '/trx-service/v1/scheduleMain/listAllMainSchedule?page=' + page + '&rowsPerPage=' + rowsPerPage
              + '&accountName=' + (formState2.values.trxDestName).replace(" ", "%20") + '&trxAmount=' + formState2.values.trxAmountF + '&dateStart=' + formState2.values.dateStart +
                  '&dateEnd=' + formState2.values.dateEnd + '&amountSign=' + formState2.values.amountSign , 
      headers: {
        'Authorization': `Bearer ${localData}`,
        'Content-Type': 'application/json'
      }
    }).then(res =>{
      console.log(formState2.dateStart)
      console.log(formState2.dateEnd)
      console.log(page, rowsPerPage)
      let statusCode = res.status
      if (statusCode === 200){
        setScheduleLists(res.data.mainToBranchScheduleList)
        setDataLength(res.data.dataCount)
        // alert(res.data.message)
        // window.location.reload()
      }
    }).catch(err => {
      if (!err.response){
        axios.get(API_BASE_URL + '/login-service/v1/auth/logout', {
          headers: {
            'Authorization': `Bearer ${localData}` 
          }
        })
        .then(res => {
          console.log(res);
          console.log(res.data.message);
          setFailMessage("Connection Error");
          localStorage.clear();
          setOpenUnauthorized(true);       
        })
        .catch(err => {
          console.log(err + localData);
        })
      }
      else if (err.response.status === 401){
        setFailMessage("Unauthorized Access");
        localStorage.clear();
        setOpenUnauthorized(true);
      }
      else {
        console.warn(err)
      }
      // setFailMessage(err.response.data.message)
      // setOpenFail(true)
      // alert(err.response.data.message)
    })
  }

  const handleContinueToSignIn = event => {
    history.push('/sign-in');
  }

  const handleCloseList = () => {
    setOpenList(false);
    setOpenSuccess(false);
  }

  const handleOpenFilter = () => {
    setOpenFilter(true);
  }

  const handleCloseFilter = () => {
    setOpenFilter(false);
  }

  const handleApplyFilter = () => {
    if (formState2.values.dateEnd != '' && formState2.values.dateStart != ''){
      formState2.values.dateEnd = moment(formState2.values.dateEnd).format('MM/DD/yyyy');
      formState2.values.dateStart = moment(formState2.values.dateStart).format('MM/DD/yyyy');
    }
    axios({
      method: 'GET', 
      url: API_BASE_URL + '/trx-service/v1/scheduleMain/listAllMainSchedule?page=' + page + '&rowsPerPage=' + rowsPerPage
              + '&accountName=' + formState2.values.trxDestName + '&trxAmount=' + formState2.values.trxAmountF + '&dateStart=' + formState2.values.dateStart +
                  '&dateEnd=' + formState2.values.dateEnd + '&amountSign=' + formState2.values.amountSign ,
      headers: {
        'Authorization': `Bearer ${localData}`,
        'Content-Type': 'application/json'
      }
    }).then(res =>{
      console.log(page, rowsPerPage)
      let statusCode = res.status
      if (statusCode === 200){
        setScheduleLists(res.data.mainToBranchScheduleList)
        setDataLength(res.data.dataCount)
        // alert(res.data.message)
        // window.location.reload()
      }
    }).catch(err => {
      if (!err.response){
        axios.get(API_BASE_URL + '/login-service/v1/auth/logout', {
          headers: {
            'Authorization': `Bearer ${localData}` 
          }
        })
        .then(res => {
          console.log(res);
          console.log(res.data.message);
          setFailMessage("Connection Error");
          localStorage.clear();
          setOpenUnauthorized(true);       
        })
        .catch(err => {
          console.log(err + localData);
        })
      }
      else if (err.response.status === 401){
        setFailMessage("Unauthorized Access");
        localStorage.clear();
        setOpenUnauthorized(true);
      }
      else {
        console.warn(err)
      }
      // setFailMessage(err.response.data.message)
      // setOpenFail(true)
      // alert(err.response.data.message)
    })
    setOpenFilter(false);
  }

  const handleResetFilter = () => {
    setPage(0);
    setRowsPerPage(10);
    formState.values.trxAmountF = '';
    formState.values.trxDestName = '';
    formState.values.dateEnd = '';
    formState.values.dateStart = '';
    formState.values.amountSign= '';
    axios({
      method: 'GET', 
      url: API_BASE_URL + '/trx-service/v1/scheduleMain/listAllMainSchedule?page=' + page + '&rowsPerPage=' + rowsPerPage , 
      headers: {
        'Authorization': `Bearer ${localData}`,
        'Content-Type': 'application/json'
      }
    }).then(res =>{
      console.log(page, rowsPerPage)
      let statusCode = res.status
      if (statusCode === 200){
        setScheduleLists(res.data.mainToBranchScheduleList)
        setDataLength(res.data.dataCount)
        // alert(res.data.message)
        // window.location.reload()
      }
    }).catch(err => {
      if (!err.response){
        axios.get(API_BASE_URL + '/login-service/v1/auth/logout', {
          headers: {
            'Authorization': `Bearer ${localData}` 
          }
        })
        .then(res => {
          console.log(res);
          console.log(res.data.message);
          setFailMessage("Connection Error");
          localStorage.clear();
          setOpenUnauthorized(true);       
        })
        .catch(err => {
          console.log(err + localData);
        })
      }
      else if (err.response.status === 401){
        setFailMessage("Unauthorized Access");
        localStorage.clear();
        setOpenUnauthorized(true);
      }
      else {
        console.warn(err)
      }
      // setFailMessage(err.response.data.message)
      // setOpenFail(true)
      // alert(err.response.data.message)
    })
    setOpenFilter(false);
  }

  const handleCancelDialog = (scheduleId, transferDest, branchId,
                     trxAmount, trxByUser, trxDate, remarks) => {
    setScheduleId(scheduleId);
    setTransferDest(transferDest);
    setBranchId(branchId); 
    setTrxAmount(trxAmount);
    setTrxByUser(trxByUser);
    setTrxDate(trxDate);
    setRemarks(remarks);
    setCancelDialog(true);
  }
  const closeCancelDialog = () => {
    setCancelDialog(false);
  }
  const handleCancelTransfer = event => {
    event.preventDefault();
    var data = JSON.stringify(
      {
        "main_to_branch_schedule_id": `${formState.values.scheduleId}`,
        "cancelation_reason": `${formState.values.cancelationReason}`,
        "verification_code": `${formState.values.verificationCode}`
      }
    ) 
  
    axios({
      method: 'DELETE', 
      url: API_BASE_URL + '/trx-service/v1/scheduleMain/cancelMainSchedule', 
      data: data, 
      headers: {
        'Authorization': `Bearer ${localData}`,
        'Content-Type': 'application/json'
      }
    }).then(res =>{
      let statusCode = res.status
      if (statusCode === 200){
        console.log(data)
        setSuccessMessage(res.data.message)
        setOpenSuccessMessage(true)
        // alert('Deactivation Success')
        // window.location.reload()
      }
    }).catch(err => {
      console.log(data)
      if (!err.response){
        axios.get(API_BASE_URL + '/login-service/v1/auth/logout', {
          headers: {
            'Authorization': `Bearer ${localData}` 
          }
        })
        .then(res => {
          console.log(res);
          console.log(res.data.message);
          setFailMessage("Connection Error");
          localStorage.clear();
          setOpenUnauthorized(true);       
        })
        .catch(err => {
          console.log(err + localData);
        })
      }
      else if (err.response.status === 401){
        setFailMessage("Unauthorized Access");
        localStorage.clear();
        setOpenUnauthorized(true);
      }
      else {
        setFailMessage(err.response.data.message)
        setOpenFail(true)
      }
      // alert('Deactivation Failed')
    })
  }

  const handlePageChange = (event, page) => {
    setPage(page);
  };

  const handleRowsPerPageChange = event => {
    setRowsPerPage(event.target.value);
    setPage(0);
    console.log(page, rowsPerPage)
  }; 

  // =================================================== API Response =================================================
  const handleOpenSuccess = () => {
    setOpenSuccess(true);
  }
  const handleCloseSuccess = () => {
    setOpenSuccess(false);
  }

  const handleCloseSuccessMessage = () => {
    setOpenSuccessMessage(false);
    window.location.reload()
  }

  const handleCloseFail = () => {
    setOpenFail(false);
  }

// =================================================== Render Side =================================================
  return (
    <Card
      {...rest}
      className={clsx(classes.root, className)}
    >
      <form>
        <CardHeader
          subheader="Change Schedule Transfer Status"
          title="Scheduled Transfer"
        />
        <Divider />
        <Divider />
        <CardActions>
          <Button 
          autoFocus onClick={handleOpenSuccess} color="primary">
            View Settings
          </Button>
        </CardActions>
      </form>

    {/* ====================================== Transfer Success Dialog Dialog ====================================== */}
      <Dialog onClose={handleCloseSuccess} aria-labelledby="customized-dialog-title" open={openSuccess}>
        <DialogTitle className={classes.dialogTitle} id="customized-dialog-title" onClose={handleCloseSuccess}>
          <span style={{color: 'white'}}>Scheduled Transfer</span>
        </DialogTitle>
        <DialogContent align="center" dividers>
          <img
            alt="Logo"
            src="/images/logos/logoafteruats.png"
            style={{paddingLeft: '10%', paddingRight:'10%', paddingTop:'15px', width:'100%'}}
          />
          <br />
          <Typography
              color="textSecondary"
              variant="h4"
            >
              <br />
              Show All Of Current Pending Scheduled Transfer List ?
            </Typography>
        </DialogContent>
        <DialogActions>
          <Button autoFocus onClick={handleViewList} color="primary">
            Confirm
          </Button>
          <Button autoFocus onClick={handleCloseSuccess} color="black">
            Back
          </Button>
        </DialogActions>
      </Dialog>

  {/* ====================================== Cancelation Fail Dialog ====================================== */}
      <Dialog onClose={handleCloseFail} aria-labelledby="customized-dialog-title" open={openFail}>
        <DialogTitle className={classes.dialogTitleFail} id="customized-dialog-title" onClose={handleCloseFail}>
          <span style={{color: 'white'}}>Failed</span>
        </DialogTitle>
        <DialogContent align="center" dividers>
          <img
            alt="Logo"
            src="/images/logos/fail-icon-65.png"
            style={{paddingLeft: '10%', paddingRight:'10%', paddingTop:'15px', width:'50%'}}
          />
          <br />
          <Typography
              color="textSecondary"
              variant="h2"
              align="center"
            >
              <br />
              {failMessage}
            </Typography>
        </DialogContent>
        {/* <DialogActions>
          <Button className={classes.confirmButton} autoFocus onClick={handleCloseFail} color="primary">
            Back
          </Button>
        </DialogActions> */}
      </Dialog>

    {/* ====================================== Cancelation Success Dialog ====================================== */}
      <Dialog onClose={handleCloseSuccessMessage} aria-labelledby="customized-dialog-title" open={openSuccessMessage}>
        <DialogTitle className={classes.dialogTitle} id="customized-dialog-title" onClose={handleCloseSuccessMessage}>
          <span style={{color: 'white'}}>Success</span>
        </DialogTitle>
        <DialogContent align="center" dividers>
          <img
            alt="Logo"
            src="/images/logos/success-icon.png"
            style={{paddingLeft: '10%', paddingRight:'10%', paddingTop:'15px', width:'50%'}}
          />
          <br />
          <Typography
              color="textSecondary"
              variant="h2"
              align="center"
            >
              <br />
              {successMessage}
            </Typography>
        </DialogContent>
        {/* <DialogActions>
          <Button className={classes.confirmButton} autoFocus onClick={handleCloseFail} color="primary">
            Back
          </Button>
        </DialogActions> */}
      </Dialog>

{/* ====================================== Filter Dialog ====================================== */}
      <Dialog onClose={handleCloseFilter} aria-labelledby="customized-dialog-title" open={openFilter}>
        <DialogTitle className={classes.dialogTitle} id="customized-dialog-title" onClose={handleCloseFilter}>
          <span style={{color: 'white'}}>Filter Selection</span>
        </DialogTitle>
          <DialogContent dividers>
          {/* <TextField
              className={classes.textField}
              fullWidth
              label="Transaction Amount"
              name="trxAmountF"
              value={formState2.values.trxAmountF || ''}
              onChange={handleChange2}
              type="number"
              variant="outlined"
            /> */}
            <CurrencyTextField
              className={classes.textField}
              label="Transaction Amount"
              value={formState2.values.trxAmountF || ''}
              currencySymbol="Rp"
              // minimumValue="0"
              outputFormat="string"
              decimalCharacter="."
              digitGroupSeparator=","
              fullWidth
              variant="outlined"
              textAlign="left"
              onChange={(event,value)=>{
                setFormState2({
                  ...formState2, values: {
                    ...formState2.values,
                    ['trxAmountF']:value
                  }
                })
              }}
            />
            <TextField
              className={classes.textField}
              fullWidth
              name="dateStart"
              value={formState2.values.dateStart || ''}
              onChange={handleChange2}
              type="date"
              variant="outlined"
            />
            <FormHelperText>Select Start Date For Filter  </FormHelperText>
            <TextField
              className={classes.textField}
              fullWidth
              name="dateEnd"
              value={formState2.values.dateEnd || ''}
              onChange={handleChange2}
              type="date"
              variant="outlined"
            />
            <FormHelperText>Select End Date For Filter  </FormHelperText>
            <FormControl className={classes.textField} style={{paddingRight:"25px"}}>
              <InputLabel>Amount Option</InputLabel>
              <Select
                name="amountSign"
                value={formState2.values.amountSign}
                onChange={handleChange2}
              >
                <MenuItem value="">
                  <em>None</em>
                </MenuItem>
                <MenuItem value={"greater"}>Greater Than</MenuItem>
                <MenuItem value={"lesser"}>Lesser Than</MenuItem>
              </Select>
              <FormHelperText>Amount Filter Options.  </FormHelperText>
            </FormControl>
            {/* <FormControl className={classes.textField} style={{paddingRight:"25px"}}>
              <InputLabel>Tranfer Status</InputLabel>
              <Select
                name="transferStatus"
                value={formState2.values.transferStatus}
                onChange={handleChange2}
              >
                <MenuItem value="">
                  <em>None</em>
                </MenuItem>
                <MenuItem value={"success"}>Success</MenuItem>
                <MenuItem value={"failed"}>Failed</MenuItem>
              </Select>
              <FormHelperText>Transfer Status Options.</FormHelperText>
            </FormControl> */}
          </DialogContent>
        <DialogActions>
          <Button autoFocus onClick={handleApplyFilter} color="primary">
            Apply
          </Button>
          <Button autoFocus onClick={handleResetFilter} color="black">
            Reset
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog onClose={handleCloseList} aria-labelledby="customized-dialog-title" open={openList} maxWidth = 'lg' fullWidth>
        <DialogTitle className={classes.dialogTitle} id="customized-dialog-title" onClose={handleCloseList}>
          <span style={{color: 'white'}}>Scheduled Transfer Information</span>
        </DialogTitle>
        <DialogContent>
          <CardContent className={classes.content}>
          <div
            className={classes.row}
          >
            <SearchInput
                style={{float: 'left'}}
                className={classes.searchInput}
                placeholder="Search Destination Account"
                name="trxDestName"
                value={formState2.values.trxDestName}
                onChange={handleChange2}
              />
              <Button
                style={{float: 'left'}}
                className={classes.searchButton}
                color="primary"
                variant="contained"
                onClick={handleSearch}
              >
                Search
              </Button>
            <span className={classes.flexGrow} />
            <Button
              style={{float: 'right'}}
              className={classes.filterList}
              color="primary"
              variant="contained"
              onClick={handleOpenFilter} // sementara
            >
              <FilterList />
            </Button>
          </div>
          <br />
            <PerfectScrollbar>
          <div className={classes.inner}>
            <Table>
              <TableHead>
                <TableRow>
                  {/* <TableCell>ScheduleID</TableCell> */}
                  <TableCell>Destination Number</TableCell>
                  <TableCell>Destination Name</TableCell>
                  <TableCell>Amount</TableCell>
                  <TableCell>Submitted By</TableCell>
                  <TableCell>Request Date</TableCell>
                  <TableCell>Purpose</TableCell>
                  <TableCell>Remarks</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Action</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {ScheduleLists.slice(0, rowsPerPage).map(ScheduleList => (
                  <TableRow
                    className={classes.tableRow}
                    hover
                    key={ScheduleList.mainToBranchScheduleId}
                    selected={selectedUsers.indexOf(ScheduleList.mainToBranchScheduleId) !== -1}
                  >
                    {/* <TableCell
                      hover
                    >
                      {ScheduleList.mainToBranchScheduleId}
                    </TableCell> */}
                    <TableCell
                      hover
                    >
                      {ScheduleList.branchAccountNo}
                    </TableCell>
                    <TableCell
                      hover
                    >
                      {ScheduleList.branchAccountName}
                    </TableCell>
                    <TableCell
                      hover
                    >
                      {<CurrencyFormat value={ScheduleList.trxAmount} displayType={'text'} thousandSeparator={true} prefix={'Rp.'} />}
                    </TableCell>
                    <TableCell
                      hover
                    >
                      {ScheduleList.trxByUser}
                    </TableCell>
                    <TableCell
                      hover
                    >
                      {moment(ScheduleList.trxDate).format('DD/MM/YYYY')}
                    </TableCell>
                    <TableCell
                      hover
                    >
                      {ScheduleList.purpose}
                    </TableCell>
                    <TableCell
                      hover
                    >
                      {ScheduleList.remarks}
                    </TableCell>
                    <TableCell
                      hover
                    >
                      {ScheduleList.status}
                    </TableCell>
                    <TableCell
                      hover
                    >
                      <Button
                        className={classes.cancelButton}
                        variant="contained"
                        size="small"
                        onClick={()=>handleCancelDialog(ScheduleList.mainToBranchScheduleId, ScheduleList.transferToAcct, ScheduleList.branchAccountId, 
                                                ScheduleList.trxAmount, ScheduleList.trxByUser, ScheduleList.trxDate, ScheduleList.remarks)}
                      >
                        Omit
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </PerfectScrollbar>
      </CardContent>
      <CardActions className={classes.actions}>
        <TablePagination
          component="div"
          count={dataLength}
          onChangePage={handlePageChange}
          onChangeRowsPerPage={handleRowsPerPageChange}
          page={page}
          rowsPerPage={rowsPerPage}
          rowsPerPageOptions={[5, 10, 25]}
        />
      </CardActions>
    </DialogContent>
        <DialogActions>
          <Button autoFocus onClick={handleCloseList} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog onClose={closeCancelDialog} aria-labelledby="customized-dialog-title" open={cancelDialog}>
        <DialogTitle className={classes.dialogTitle} id="customized-dialog-title" onClose={closeCancelDialog}>
          <span style={{color: 'white'}}>Cancel Scheduled Transfer</span>
        </DialogTitle>
        <DialogContent dividers>
          <TextField
            disabled
            className={classes.textField}
            fullWidth
            label="Schedule ID"
            name="scheduleId"
            value={formState.values.scheduleId = `${scheduleId}` || `${scheduleId}`}
            type="text"
            variant="outlined"
          />
          <TextField
            disabled
            className={classes.textField}
            fullWidth
            label="Branch ID Destination"
            name="branchId"
            value={`${branchId}`}
            type="text"
            variant="outlined"
          />
          <TextField
            disabled
            className={classes.textField}
            fullWidth
            label="Transfer Amount"
            name="trxAmount"
            value={`${trxAmount}`}
            type="number"
            variant="outlined"
          />
          <TextField
            disabled
            className={classes.textField}
            fullWidth
            label="Issued By"
            name="trxByUser"
            value={`${trxByUser}`}
            type="text"
            variant="outlined"
          />
          <TextField
            disabled
            className={classes.textField}
            fullWidth
            label="Issued By"
            name="trxDate"
            value={`${moment(trxDate).format('DD/MM/YYYY')}`}
            type="text"
            variant="outlined"
          />
          <TextField
            disabled
            className={classes.textField}
            fullWidth
            label="Remarks"
            name="remarks"
            value={`${remarks}`}
            type="text"
            variant="outlined"
          />
          <TextField
            className={classes.textField}
            fullWidth             
            label="Cancelation Reason"
            name="cancelationReason"
            error={hasError('cancelationReason')}
            helperText={
                        hasError('cancelationReason') ? formState.errors.cancelationReason[0] : null
            }
            value={formState.values.cancelationReason || ''}
            onChange={handleChange}
            type="text"
            variant="outlined"
          />
          <TextField
            className={classes.textField}
            fullWidth
            label="Verification Code"
            name="verificationCode"
            error={hasError('verificationCode')}
            helperText={
                        hasError('verificationCode') ? formState.errors.verificationCode[0] : null
            }
            value={formState.values.verificationCode || ''}
            onChange={handleChange}
            type="password"
            variant="outlined"
          />
        </DialogContent>
        <DialogActions>
          <Button className={classes.confirmCancelButton} autoFocus onClick={handleCancelTransfer}
                  disabled={!formState.isValid}
          >
            Confirm Omit
          </Button>
        </DialogActions>
      </Dialog>
{/* // ====================================== API Error Handling  ====================================== */}
      <Dialog onClose={handleContinueToSignIn} aria-labelledby="customized-dialog-title" open={openUnauthorized}>
        <DialogTitle className={classes.dialogTitleFail} id="customized-dialog-title" onClose={handleContinueToSignIn}>
          <span style={{color: 'white'}}>Connection Problems!</span>
        </DialogTitle>
        <DialogContent align="center" dividers>
          <img
            alt="Logo"
            src="/images/logos/fail-icon-65.png"
            style={{paddingLeft: '10%', paddingRight:'10%', width:'50%'}}
          />
          <br />
          <Typography
            color="textSecondary"
            variant="h4"
          >
            <br />
            {successMessage} {failMessage}
          </Typography>
          <Typography
            color="textSecondary"
            variant="body1"
          >
            You will be redirected to sign-in page!
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button className={classes.confirmDeactivateButton} autoFocus onClick={handleContinueToSignIn} color="primary">
            Back To Sign-In Page
          </Button>
        </DialogActions>
      </Dialog>
    </Card>
  );
};

ScheduledTransfer.propTypes = {
  className: PropTypes.string,
  history: PropTypes.object
};

export default withRouter(ScheduledTransfer);
