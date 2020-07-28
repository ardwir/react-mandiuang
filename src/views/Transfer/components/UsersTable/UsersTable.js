import React, { useState, useEffect } from 'react';
import clsx from 'clsx';
import axios from 'axios';
import { API_BASE_URL, API_BASE_UR } from '../../../../constants'
import PropTypes from 'prop-types';
import PerfectScrollbar from 'react-perfect-scrollbar';
import { makeStyles } from '@material-ui/styles';
import BranchProfile from './components/BranchProfile';
import "react-datepicker/dist/react-datepicker.css";
import validate from 'validate.js';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import CurrencyTextField from '@unicef/material-ui-currency-textfield';
import CurrencyFormat from 'react-currency-format';
import { SearchInput } from 'components';
import  { withRouter }  from 'react-router-dom';
import { StatusBullet } from 'components';

import {
  AppBar, 
  Tabs, 
  Tab,
  Box,
  Button,
  Checkbox, 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions,
  Card,
  CardActions,
  CardContent,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  Typography,
  TablePagination, 
  FormControl,
  InputLabel, 
  Select, 
  MenuItem,
  FormHelperText
} from '@material-ui/core';

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box p={3}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired,
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

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
  tabs: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.paper,
  },
  row: {
    height: '42px',
    display: 'flex',
    alignItems: 'center',
    marginTop: theme.spacing(1)
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
  content: {
    padding: 0
  },
  inner: {
    minWidth: 1050
  },
  nameContainer: {
    display: 'flex',
    alignItems: 'center'
  },
  avatar: {
    marginRight: theme.spacing(2)
  },
  actions: {
    justifyContent: 'flex-end'
  },
  confirmButton: {
    marginRight: theme.spacing(1), 
    backgroundColor: 'white', 
    color: '#00ae8d'
  },
  confirmDeactivateButton: {
    marginRight: theme.spacing(1), 
    backgroundColor: 'white', 
    color: 'red',
    fontSize: '80%'
  },
  flexGrow: {
    flexGrow: 1
  },
  searchInput: {
    marginTop: theme.spacing(2),
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
  },
  searchButton: {
    marginTop: theme.spacing(2),
    marginRight: theme.spacing(1), 
  },
  statusContainer: {
    display: 'flex',
    alignItems: 'center'
  },
  status: {
    marginRight: theme.spacing(1)
  }
}));

const schema = {
  branchAccountId: {
    presence: { allowEmpty: false, message: 'is required' },
  },
  branchAccountNo: {
    presence: { allowEmpty: false, message: 'is required' },
    length: {
      maximum: 10,
      minimum: 10
    }
  },
  purpose: {
    presence: { allowEmpty: false, message: 'is required' },
    length: {
      minimum: 4,
      maximum: 40
    }
  },
  remarks: {
    presence: { allowEmpty: false, message: 'is required' },
    length: {
      minimum: 6,
      maximum: 140
    }
  },
  transferAmount: {
    presence: { allowEmpty: false, message: 'is required' },
  },
  verificationCode: {
    presence: { allowEmpty: false, message: 'is required' },
    length: {
      maximum: 6,
      minimum: 6
    }
  }
};

const schema2 = {
  remarks: {
    presence: { allowEmpty: false, message: 'is required' },
    length: {
      minimum: 6,
      maximum: 140
    }
  },
  purpose: {
    presence: { allowEmpty: false, message: 'is required' },
    length: {
      minimum: 4,
      maximum: 40
    }
  },
  transferAmount: {
    presence: { allowEmpty: false, message: 'is required' },
  },
  postponedDate: {
    presence: { allowEmpty: false, message: 'is required' },
  },
  verificationCode: {
    presence: { allowEmpty: false, message: 'is required' },
    length: {
      maximum: 6,
      minimum: 6
    }
  }
};

const schema3 = {
  purpose: {
    presence: { allowEmpty: false, message: 'is required' },
    length: {
      minimum: 4,
      maximum: 40
    }
  },
  remarks: {
    presence: { allowEmpty: false, message: 'is required' },
    length: {
      minimum: 6,
      maximum: 140
    }
  },
  transferAmount: {
    presence: { allowEmpty: false, message: 'is required' },
  },
  transferDate: {
    presence: { allowEmpty: false, message: 'is required' },
  },
  transferfrequency: {
    presence: { allowEmpty: false, message: 'is required' },
  },
  transferRepetition: {
    presence: { allowEmpty: false, message: 'is required' },
  },
  verificationCode: {
    presence: { allowEmpty: false, message: 'is required' },
    length: {
      maximum: 6,
      minimum: 6
    }
  }
};

const statusColors = {
  Active: 'success',
  Pending: 'info',
  Failed: 'danger'
};

const UsersTable = props => {
  
  const { className, users, history, ...rest } = props;

  const classes = useStyles();
  
  const [successMessage, setSuccessMessage] = useState([]);
  const [failMessage, setFailMessage] = useState({});
  const [openUnauthorized, setOpenUnauthorized] = React.useState(false);
  const [transferAmt, setTransferAmt] = useState({});
  const [transferRemarks, setTransferRemarks] = useState({});
  const [branchId, setBranchId] = useState({});
  const [branchAcctNo, setBranchAcctNo] = useState({}); 
  const [postDate, setPostDate] = useState({}); 
  const [trxDate, setTrxDate] = useState({}); 
  const [trxFreq, setTrxFreq] = useState({}); 
  const [trxRepetition, setTrxRepetition] = useState({}); 
  const [branchs, setBranchs] = useState([]);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [page, setPage] = useState(0);
  const [openRow2, setOpenRow2] = React.useState(false);
  const [open, setOpen] = React.useState(false);
  const [open2, setOpen2] = React.useState(false);
  const [open3, setOpen3] = React.useState(false);
  const [openFail, setOpenFail] = React.useState(false);
  const [openFail2, setOpenFail2] = React.useState(false);
  const [openFail3, setOpenFail3] = React.useState(false);
  const [openFailReload, setOpenFailReload] = React.useState(false);
  const [openSuccess, setOpenSuccess] = React.useState(false);
  const [value, setValue] = React.useState(0);
  const [dataLength, setDatalength] = React.useState();
  const [dataLength2, setDatalength2] = React.useState();
  const scheduleInformation = `Transfer On ${trxDate} Date For Every ${trxFreq} Months, For ${trxRepetition} Times`;
  const localData = JSON.parse(localStorage.getItem("data"));
  
  const [formState4, setFormState4] = useState({
    isValid: false,
    values: {accountName:''},
    touched: {},
    errors: {}
  });

  const handleChange4 = event => {
    event.persist();

    setFormState4(formState4 => ({
      ...formState4,
      values: {
        ...formState4.values,
        [event.target.name]:
          event.target.type === 'checkbox'
            ? event.target.checked
            : event.target.value
      },
      touched: {
        ...formState4.touched,
        [event.target.name]: true
      }
    }));

  };
  // ====================================== For Branch Account List  ======================================
  useEffect(() => {
    axios.get(API_BASE_URL + '/mainbranch-service/v1/branch/allBranchProfile?page=' + page + '&rowsPerPage=' + rowsPerPage + '&accountName=' + (formState4.values.accountName).replace(" ", "%20"), {
        headers: {
          'Authorization': `Bearer ${localData}` 
        }
    })
        .then(res => {
            console.log(res) 
            setBranchs(res.data.branchAccountList);
            setDatalength(res.data.dataCount)
        })
        .catch(err => {
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
            console.log(err + localData)
          }
        })
  }, [page, rowsPerPage]);

  const handleContinueToSignIn = event => {
    history.push('/sign-in');
  }
  const handlePageChange = (event, page) => {
    setPage(page);
  };

  const handleRowsPerPageChange = event => {
    setRowsPerPage(event.target.value);
  };

// =================================================== Big Transfer Dialog =================================================
// open dialog transfer
const handleRowClick2 = (branchAccountId, branchAcctNo) => {
  setBranchId(branchAccountId);
  setBranchAcctNo(branchAcctNo);
  setOpenRow2(true);
};
// close dialog transfer
const handleRowClose2 = () => {
  setOpenRow2(false);
};
// ====================================== Main To Branch Immidieate Trx ======================================
const [formState, setFormState] = useState({
  isValid: false,
  values: {trxDestName:''},
  touched: {},
  errors: {}
});

const hasError = field =>
    formState.touched[field] && formState.errors[field] ? true : false;

const handleChange = (event, newValue) => {
  setValue(newValue);
};

// useEffect(()=>{
//   console.log(formState)
// },[formState])

useEffect(() => {
  const errors = validate(formState.values, schema);

  setFormState(formState => ({
    ...formState,
    isValid: errors ? false : true,
    errors: errors || {}
  }));
}, [formState.values]);

const handleChangeTransfer = event => {
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

const handleTrxMainToBranch = event => {
  event.preventDefault();
  var data = JSON.stringify(
    {
      "transfer_to_acct": `${formState.values.branchAccountNo}`,
      "branch_account_id": `${formState.values.branchAccountId}`,
      "transfer_type": "Immediately",
      "trx_amount": `${formState.values.transferAmount}`,
      "remarks": `${formState.values.remarks}`,
      "purpose": `${formState.values.purpose}`,
      "verification_code": `${formState.values.verificationCode}`
    }
  ) 
  
  axios({
    method: 'POST', 
    url: API_BASE_URL + '/trx-service/v1/transactionMain/trxMainToBranch', 
    data: data, 
    headers: {
      'Authorization': `Bearer ${localData}`,
      'Content-Type': 'application/json'
    }
  }).then(res =>{
    let statusCode = res.status
    if (statusCode === 202){
      console.log(data)
      setSuccessMessage(res.data.message)
      setOpen(false);
      setOpenSuccess(true)
    }
  }).catch(err => {
    console.warn(err)
    console.log(data)
    // console.log(err.response.status)
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
        setOpen(false);
        setOpenUnauthorized(true);       
      })
      .catch(err => {
        console.log(err + localData);
      })
    }
    else if (err.response.status === 401){
      setFailMessage("Unauthorized Access");
      localStorage.clear();
      setOpen(false);
      setOpenUnauthorized(true);
    }
    else if (err.response.status == 406) {
      setFailMessage(err.response.data.message)
      setOpen(false);
      setOpenFailReload(true)
      // alert(err.response.data.message)
      // window.location.reload()
    }
    else {
      // alert(err.response.data.message)
      setFailMessage(err.response.data.message)
      setOpen(false);
      setOpenFail(true)
    }
    
  })
};

// =================================================== Immidiate TRX Confirmation =================================================
const handleBack = () => {
  setOpenRow2(true); // ReOpen Big Transfer Dialog
  setOpen(false);
};

const handleClickOpen = () => {
  setTransferAmt(`${formState.values.transferAmount}`);
  setTransferRemarks(`${formState.values.remarks}`)
  setOpenRow2(false); // Close Big Transfer Dialog
  setOpen(true); 
}

const handleClickClose = () => {
  setOpenRow2(true); // ReOpen Big Transfer Dialog
  setOpen(false);
}

// ====================================== Main To Branch PostDate Trx ======================================
const hasError2 = field =>
    formState2.touched[field] && formState2.errors[field] ? true : false;

const [formState2, setFormState2] = useState({
  isValid: false,
  values: {},
  touched: {},
  errors: {}
});

useEffect(() => {
  const errors = validate(formState2.values, schema2);

  setFormState2(formState2 => ({
    ...formState2,
    isValid: errors ? false : true,
    errors: errors || {}
  }));
}, [formState2.values]);

const handleChangeTransfer2 = event => {
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

const handleTrxMainToBranchPostponed = event => {
  event.preventDefault();
  var data = JSON.stringify(
    {
      "transfer_to_acct": `${formState.values.branchAccountNo}`,
      "branch_account_id": `${formState.values.branchAccountId}`,
      "transfer_type": "Postponed",
      "trx_amount": `${formState2.values.transferAmount}`,
      "remarks": `${formState2.values.remarks}`,
      "purpose": `${formState2.values.purpose}`,
      "postponed_transfer": `${formState2.values.postponedDate.toString()}`,
      "verification_code": `${formState2.values.verificationCode}`
    }
  ) 
  
  axios({
    method: 'POST', 
    url: API_BASE_URL + '/trx-service/v1/scheduleMain/postponedTrxToBranch', 
    data: data, 
    headers: {
      'Authorization': `Bearer ${localData}`,
      'Content-Type': 'application/json'
    }
  }).then(res =>{
    let statusCode = res.status
    if (statusCode === 202){
      console.log(data)
      setSuccessMessage(res.data.message)
      setOpen2(false);
      setOpenSuccess(true)
      // alert(res.data.message)
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
      setOpen2(false);
      setOpenFail2(true)
    }
  })
};
// =================================================== PostDate TRX Confirmation =================================================
const handleBack2 = () => {
  setOpenRow2(true); // ReOpen Big Transfer Dialog 
  setOpen2(false);
};

const handleClickOpen2 = () => {
  setTransferAmt(`${formState2.values.transferAmount}`);
  setTransferRemarks(`${formState2.values.remarks}`);
  setPostDate(`${formState2.values.postponedDate}`);
  setOpenRow2(false) // Close Big Transfer Dialog
  setOpen2(true); 
}

const handleClickClose2 = () => {
  setOpenRow2(true) // ReOpen Big Transfer Dialog
  setOpen2(false);
  // setOpenRow2(false);
}

// ====================================== Main To Branch Scheduled Trx ======================================
const [formState3, setFormState3] = useState({
  isValid: false,
  values: {},
  touched: {},
  errors: {}
});

const hasError3 = field =>
    formState3.touched[field] && formState3.errors[field] ? true : false;

useEffect(() => {
  const errors = validate(formState3.values, schema3);

  setFormState3(formState3 => ({
    ...formState3,
    isValid: errors ? false : true,
    errors: errors || {}
  }));
}, [formState3.values]);

const handleChangeTransfer3 = event => {
  event.persist();

  setFormState3(formState3 => ({
    ...formState3,
    values: {
      ...formState3.values,
      [event.target.name]:
        event.target.type === 'checkbox'
          ? event.target.checked
          : event.target.value
    },
    touched: {
      ...formState3.touched,
      [event.target.name]: true
    }
  }));
};

const handleTrxMainToBranchScheduled = event => {
  event.preventDefault();
  var data = JSON.stringify(
    {
      "transfer_to_acct": `${formState.values.branchAccountNo}`,
      "branch_account_id": `${formState.values.branchAccountId}`,
      "transfer_type": "Scheduled",
      "trx_amount": `${formState3.values.transferAmount}`,
      "remarks": `${formState3.values.remarks}`,
      "purpose": `${formState3.values.purpose}`,
      "schedule_transfer": `${formState3.values.transferDate}`,
      "frequency": `${formState3.values.transferFrequency}`,
      "repetition": `${formState3.values.transferRepetition}`,
      "verification_code": `${formState3.values.verificationCode}`
    }
  ) 
  
  axios({
    method: 'POST', 
    url: API_BASE_URL + '/trx-service/v1/scheduleMain/scheduleTrxToBranch', 
    data: data, 
    headers: {
      'Authorization': `Bearer ${localData}`,
      'Content-Type': 'application/json'
    }
  }).then(res =>{
    let statusCode = res.status
    if (statusCode === 202){
      console.log(data)
      setSuccessMessage(res.data.message)
      setOpen3(false)
      setOpenSuccess(true)
      // alert(res.data.message)
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
      setOpen3(false);
      setOpenFail3(true);
    }
  })
};
// =================================================== Scheduled TRX Confirmation =================================================
const handleBack3 = () => {
  setOpenRow2(true); // ReOpen Big Transfer Dialog
  setOpen3(false);
};

const handleClickOpen3 = () => {
  setTransferAmt(`${formState3.values.transferAmount}`);
  setTransferRemarks(`${formState3.values.remarks}`);
  setTrxDate(`${formState3.values.transferDate}`);
  setTrxFreq(`${formState3.values.transferFrequency}`);
  setTrxRepetition(`${formState3.values.transferRepetition}`);
  setOpenRow2(false) // close Big Transfer Dialog
  setOpen3(true); 
}

const handleClickClose3 = () => {
  setOpenRow2(true); // ReOpen Big Transfer Dialog
  setOpen3(false);
}

// =================================================== Search Functon =================================================
const handleSearch = () => {
  axios.get(API_BASE_URL + '/mainbranch-service/v1/branch/allBranchProfile?page=' + page + '&rowsPerPage=' + rowsPerPage + '&accountName=' + (formState4.values.accountName).replace(" ", "%20"), {
    headers: {
      'Authorization': `Bearer ${localData}` 
    }
})
    .then(res => {
        console.log(res) 
        setBranchs(res.data.branchAccountList);
        setDatalength(res.data.dataCount)
    })
    .catch(err => {
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
        console.log(err + localData)
      }
    })
}
// =================================================== API Response =================================================
const handleCloseSuccess = () => {
  setOpenSuccess(false);
  window.location.reload()
}

const handleCloseFail = () => {
  setOpen(true);
  setOpenFail(false);
}

const handleCloseFail2 = () => {
  setOpen2(true);
  setOpenFail2(false);
}
const handleCloseFail3 = () => {
  setOpen3(true);
  setOpenFail3(false);
}

const handleCloseFailReload = () => {
  setOpenFailReload(false);
  window.location.reload()
}
// ====================================== Render Side ======================================
  return (
    <Card
      {...rest}
      className={clsx(classes.root, className)}
    >
      <CardContent className={classes.content}>
        <div
            className={classes.row}
          >
              <SearchInput
                style={{float: 'left'}}
                className={classes.searchInput}
                placeholder="Search Branch Name"
                name="accountName"
                value={formState4.values.accountName}
                onChange={handleChange4}
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
          </div>
          <br />
        <PerfectScrollbar>
          <div className={classes.inner}>
            <Table>
              <TableHead>
                <TableRow>
                  {/* <TableCell>Branch ID</TableCell> */}
                  <TableCell>Account Number</TableCell>
                  <TableCell>Balance</TableCell>
                  <TableCell>Branch Name</TableCell>
                  <TableCell>Status</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {branchs.slice(0, rowsPerPage).map(branch => (
                  <TableRow
                    className={classes.tableRow}
                    hover
                    key={branch.branchAccountId}
                    onClick={()=>handleRowClick2(branch.branchAccountId, branch.accountNo)}
                  >
                    {/* <TableCell
                      hover
                    >
                      {branch.branchAccountId}
                    </TableCell> */}
                    <TableCell
                      hover
                    >
                      {branch.accountNo}
                    </TableCell>
                    <TableCell
                      hover
                    >
                      {<CurrencyFormat value={branch.branchBalance} displayType={'text'} thousandSeparator={true} prefix={'Rp.'} />}
                    </TableCell>
                    <TableCell
                      hover
                    >
                      {branch.branchName}
                    </TableCell>
                    <TableCell>
                      <div className={classes.statusContainer}>
                        <StatusBullet
                          className={classes.status}
                          color={statusColors["Active"]}
                          size="sm"
                        />
                        Active
                      </div>
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

  {/* ====================================== Big Trx Dialog ====================================== */}

      <Dialog onClose={handleRowClose2} aria-labelledby="customized-dialog-title" open={openRow2} maxWidth = 'lg' fullWidth>
        <DialogTitle className={classes.dialogTitle} id="customized-dialog-title" onClose={handleRowClose2}>
          <span style={{color: 'white'}}>Transfer To Branch</span>
        </DialogTitle>
        <DialogContent dividers>
          <CardContent className={classes.content}>
            <PerfectScrollbar>
          <div className={classes.inner}>
            <BranchProfile branchId={branchId} />
          </div>
          <AppBar position="static">
            <Tabs value={value} onChange={handleChange} aria-label="simple tabs example">
              <Tab label="Immediately" {...a11yProps(0)} />
              <Tab label="Post Date" {...a11yProps(1)} />
              <Tab label="Scheduled" {...a11yProps(2)} />
            </Tabs>
          </AppBar>

          {/* ====================================== Immediate Trx Dialog ====================================== */}
          <TabPanel value={value} index={0}>
            <TextField
              disabled
              className={classes.textField}
              fullWidth
              label="Branch ID"
              name="branchAccountId"
              error={hasError('branchAccountId')}
              helperText={
                        hasError('branchAccountId') ? formState.errors.branchAccountId[0] : null
              }
              value={formState.values.branchAccountId = `${branchId}` || `${branchId}`}
              onChange={handleChangeTransfer}
              type="text"
              variant="outlined"
            />
            <TextField
              disabled
              className={classes.textField}
              fullWidth
              label="Branch Account Number"
              name="branchAccountNo"
              error={hasError('branchAccountNo')}
              helperText={
                        hasError('branchAccountNo') ? formState.errors.branchAccountNo[0] : null
              }
              value={formState.values.branchAccountNo = `${branchAcctNo}` || `${branchAcctNo}`}
              onChange={handleChangeTransfer}
              type="text"
              variant="outlined"
            />
            {/* <TextField
              className={classes.textField}
              fullWidth
              label="Transfer Amount"
              name="transferAmount"
              error={hasError('transferAmount')}
              helperText={
                        hasError('transferAmount') ? formState.errors.transferAmount[0] : null
              }
              value={formState.values.transferAmount || ''}
              onChange={handleChangeTransfer}
              type="number"
              variant="outlined"
            /> */}
            <CurrencyTextField
              className={classes.textField}
              label="Transfer Amount"
              value={formState.values.transferAmount}
              currencySymbol="Rp"
              // minimumValue="0"
              outputFormat="string"
              decimalCharacter="."
              digitGroupSeparator=","
              fullWidth
              variant="outlined"
              textAlign="left"
              onChange={(event,value)=>{
                setFormState({
                  ...formState, values: {
                    ...formState.values,
                    ['transferAmount']:value
                  }
                })
              }}
            />
            <TextField
              className={classes.textField}
              fullWidth
              label="Purpose"
              name="purpose"
              error={hasError('purpose')}
              helperText={
                        hasError('purpose') ? formState.errors.purpose[0] : null
              }
              value={formState.values.purpose || ''}
              onChange={handleChangeTransfer}
              type="text"
              variant="outlined"
            />
            <TextField
              className={classes.textField}
              fullWidth
              label="Remarks"
              name="remarks"
              error={hasError('remarks')}
              helperText={
                        hasError('remarks') ? formState.errors.remarks[0] : null
              }
              value={formState.values.remarks || ''}
              onChange={handleChangeTransfer}
              type="text"
              variant="outlined"
            />
            <DialogActions>
              <Button
                className={classes.confirmButton} 
                autoFocus 
                onClick={handleClickOpen} 
                color="primary" 
                style={{paddingRight:"15px"}}
                disabled={!formState.values.transferAmount || formState.values.transferAmount < 10000 ||
                  !formState.values.remarks || (formState.values.remarks).length < 6 || !formState.values.purpose || (formState.values.purpose).length < 4}
              >
                Transfer
              </Button>
            </DialogActions>
          </TabPanel>

    {/* ====================================== Postponed Trx Dialog ====================================== */}
          <TabPanel value={value} index={1}>
            <TextField
              disabled
              className={classes.textField}
              fullWidth
              label="Branch ID"
              name="branchId"
              type="text"
              variant="outlined"
              value={`${branchId}`}
            />
            <TextField
              disabled
              className={classes.textField}
              fullWidth
              label="Branch Account Number"
              name="branchAccountNumber"
              type="text"
              variant="outlined"
              value={`${branchAcctNo}`}
            />
            {/* <TextField
              className={classes.textField}
              fullWidth
              label="Transfer Amount"
              name="transferAmount"
              error={hasError2('transferAmount')}
              helperText={
                    hasError2('transferAmount') ? formState2.errors.transferAmount[0] : null
              }
              value={formState2.values.transferAmount || ''}
              onChange={handleChangeTransfer2}
              type="text"
              variant="outlined"
            /> */}
            {/* <CurrencyTextField
                className={classes.textField}
                fullWidth
                variant="outlined"
                textAlign="left"
                label="Transfer Amount"
                name="transferAmount"
                error={hasError2('transferAmount')}
                helperText={
                      hasError2('transferAmount') ? formState2.errors.transferAmount[0] : null
                }
                value={formState2.values.transferAmount || ''}
                currencySymbol="Rp."
                outputFormat="number"
                onChange={handleChangeTransfer2}
            /> */}
            <CurrencyTextField
              className={classes.textField}
              label="Transfer Amount"
              value={formState2.values.transferAmount}
              currencySymbol="Rp"
              minimumValue="0"
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
                    ['transferAmount']:value
                  }
                })
              }}
            />
            <TextField
              className={classes.textField}
              fullWidth
              name="postponedDate"
              error={hasError2('postponedDate')}
              helperText={
                    hasError2('postponedDate') ? formState2.errors.postponedDate[0] : null
              }
              value={formState2.values.postponedDate || ''}
              onChange={handleChangeTransfer2}
              type="date"
              variant="outlined"
            />
            <TextField
              className={classes.textField}
              fullWidth
              label="Purpose"
              name="purpose"
              error={hasError2('purpose')}
              helperText={
                    hasError2('purpose') ? formState2.errors.purpose[0] : null
              }
              value={formState2.values.purpose || ''}
              onChange={handleChangeTransfer2}
              type="text"
              variant="outlined"
            />
            <TextField
              className={classes.textField}
              fullWidth
              label="Remarks"
              name="remarks"
              error={hasError2('remarks')}
              helperText={
                    hasError2('remarks') ? formState2.errors.remarks[0] : null
              }
              value={formState2.values.remarks || ''}
              onChange={handleChangeTransfer2}
              type="text"
              variant="outlined"
            />
            <DialogActions>
              <Button 
                autoFocus 
                onClick={handleClickOpen2} 
                color="primary" 
                style={{paddingRight:"15px"}}
                disabled={!formState2.values.transferAmount || formState2.values.transferAmount < 10000 ||
                  !formState2.values.remarks || (formState2.values.remarks).length < 6 || !formState2.values.purpose || (formState2.values.purpose).length < 4 || 
                  !formState2.values.postponedDate}
              >
                Transfer
              </Button>
            </DialogActions>
          </TabPanel>

  {/* ====================================== Scheduled Trx Dialog ====================================== */}
          <TabPanel value={value} index={2}>
            <TextField
              disabled
              className={classes.textField}
              fullWidth
              label="Branch ID"
              name="branchId"
              type="text"
              variant="outlined"
              value={`${branchId}`}
            />
            <TextField
              disabled
              className={classes.textField}
              fullWidth
              label="Branch Account Number"
              name="branchAccountNumber"
              type="text"
              variant="outlined"
              value={`${branchAcctNo}`}
            />
            <CurrencyTextField
              className={classes.textField}
              label="Transfer Amount"
              value={formState3.values.transferAmount}
              currencySymbol="Rp"
              // minimumValue="0"
              outputFormat="string"
              decimalCharacter="."
              digitGroupSeparator=","
              fullWidth
              variant="outlined"
              textAlign="left"
              onChange={(event,value)=>{
                setFormState3({
                  ...formState3, values: {
                    ...formState3.values,
                    ['transferAmount']:value
                  }
                })
              }}
            />
            <FormControl className={classes.textField} style={{paddingRight:"25px"}}>
              <InputLabel id="demo-simple-select-helper-label">Date Transfer</InputLabel>
              <Select
                labelId="demo-simple-select-helper-label"
                id="demo-simple-select-helper"
                name="transferDate"
                error={hasError3('transferDate')}
                helperText={
                    hasError3('transferDate') ? formState3.errors.transferDate[0] : null
                }
                value={formState3.values.transferDate}
                onChange={handleChangeTransfer3}
              >
                <MenuItem value="">
                  <em>None</em>
                </MenuItem>
                <MenuItem value={1}>1</MenuItem>
                <MenuItem value={2}>2</MenuItem>
                <MenuItem value={3}>3</MenuItem>
                <MenuItem value={4}>4</MenuItem>
                <MenuItem value={5}>5</MenuItem>
                <MenuItem value={6}>6</MenuItem>
                <MenuItem value={7}>7</MenuItem>
                <MenuItem value={8}>8</MenuItem>
                <MenuItem value={9}>9</MenuItem>
                <MenuItem value={10}>10</MenuItem>
                <MenuItem value={11}>11</MenuItem>
                <MenuItem value={12}>12</MenuItem>
                <MenuItem value={13}>13</MenuItem>
                <MenuItem value={14}>14</MenuItem>
                <MenuItem value={15}>15</MenuItem>
                <MenuItem value={16}>16</MenuItem>
                <MenuItem value={17}>17</MenuItem>
                <MenuItem value={18}>18</MenuItem>
                <MenuItem value={19}>19</MenuItem>
                <MenuItem value={20}>20</MenuItem>
                <MenuItem value={21}>21</MenuItem>
                <MenuItem value={22}>22</MenuItem>
                <MenuItem value={23}>23</MenuItem>
                <MenuItem value={24}>24</MenuItem>
                <MenuItem value={25}>25</MenuItem>
                <MenuItem value={26}>26</MenuItem>
                <MenuItem value={27}>27</MenuItem>
                <MenuItem value={28}>28</MenuItem>
                <MenuItem value={29}>29</MenuItem>
                <MenuItem value={30}>30</MenuItem>
              </Select>
              <FormHelperText>Transfer On Every x Date</FormHelperText>
            </FormControl>

            <FormControl className={classes.textField} style={{paddingRight:"25px"}}>
              <InputLabel id="demo-simple-select-helper-label">Transfer Frequency</InputLabel>
              <Select
                labelId="demo-simple-select-helper-label"
                id="demo-simple-select-helper"
                name="transferFrequency"
                error={hasError3('transferFrequency')}
                helperText={
                    hasError3('transferFrequency') ? formState3.errors.transferFrequency[0] : null
                }
                value={formState3.values.transferFrequency}
                onChange={handleChangeTransfer3}
              >
                <MenuItem value="">
                  <em>None</em>
                </MenuItem>
                <MenuItem value={1}>One Month</MenuItem>
                <MenuItem value={2}>Two Months</MenuItem>
                <MenuItem value={3}>Three Months</MenuItem>
                <MenuItem value={4}>Four Months</MenuItem>
                <MenuItem value={6}>Six Months</MenuItem>
                <MenuItem value={12}>Twelve Months</MenuItem>
              </Select>
              <FormHelperText>Transfer For Every x Month</FormHelperText>
            </FormControl>

            <FormControl className={classes.textField} style={{paddingRight:"25px"}}>
              {/* <InputLabel id="demo-simple-select-helper-label">Transfer Frequency</InputLabel> */}
              <TextField
                className={classes.textField}
                fullWidth
                label="Repetition"
                name="transferRepetition"
                error={hasError3('transferRepetition')}
                helperText={
                    hasError3('transferRepetition') ? formState3.errors.transferRepetition[0] : null
                }
                value={formState3.values.transferRepetition}
                onChange={handleChangeTransfer3}
                type="number"
                variant="outlined"
              />
            </FormControl>
            <TextField
              className={classes.textField}
              fullWidth
              label="Purpose"
              name="purpose"
              error={hasError3('purpose')}
              helperText={
                    hasError3('purpose') ? formState3.errors.purpose[0] : null
              }
              value={formState3.values.purpose || ''}
              onChange={handleChangeTransfer3}
              type="text"
              variant="outlined"
            />
            <TextField
              className={classes.textField}
              fullWidth
              label="Remarks"
              name="remarks"
              error={hasError3('remarks')}
              helperText={
                    hasError3('remarks') ? formState3.errors.remarks[0] : null
              }
              value={formState3.values.remarks || ''}
              onChange={handleChangeTransfer3}
              type="text"
              variant="outlined"
            />
              <DialogActions>
                <Button 
                  autoFocus 
                  onClick={handleClickOpen3} 
                  color="primary" 
                  style={{paddingRight:"15px"}}
                  disabled={!formState3.values.transferAmount || formState3.values.transferAmount < 10000 ||
                  !formState3.values.remarks || (formState3.values.remarks).length < 6 || !formState3.values.purpose || (formState3.values.purpose).length < 4 || 
                  !formState3.values.transferDate || !formState3.values.transferFrequency || !formState3.values.transferRepetition}
                >
                Transfer
                </Button>
              </DialogActions>
            </TabPanel>
          </PerfectScrollbar>
        </CardContent>
      </DialogContent>
    </Dialog>

   {/* ====================================== Immediate Trx Confirmation Dialog ====================================== */}
    <Dialog onClose={handleClickClose} aria-labelledby="customized-dialog-title" open={open} maxWidth = 'lg'>
        <DialogTitle className={classes.dialogTitle} id="customized-dialog-title" onClose={handleClickClose}>
        <IconButton onClick={handleBack}>
          <ArrowBackIcon />
        </IconButton>
          <span style={{color: 'white'}}>Transfer Confirmation</span>
        </DialogTitle>
        <DialogContent dividers>
          <CardContent className={classes.content}>
            <PerfectScrollbar>
            <TextField
              disabled
              className={classes.textField}
              fullWidth
              label="Branch ID"
              name="branchAccountId"
              value={branchId}
              onChange={handleChangeTransfer}
              type="text"
              variant="outlined"
            />
            <TextField
              disabled
              className={classes.textField}
              fullWidth
              label="Branch Account Number"
              name="branchAccountNo"
              value={branchAcctNo}
              type="text"
              variant="outlined"
            />
            <CurrencyTextField
              disabled
              className={classes.textField}
              fullWidth
              variant="outlined"
              textAlign="left"
              label="Transfer Amount"
              name="transferAmount"
              value={transferAmt}
              currencySymbol="Rp."
              outputFormat="number"
            />
            <TextField
              disabled
              className={classes.textField}
              fullWidth
              label="Remarks"
              name="remarks"
              value={transferRemarks}
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
              onChange={handleChangeTransfer}
              type="password"
              variant="outlined"
            />
            </PerfectScrollbar>
          </CardContent>
        </DialogContent>
        <DialogActions>
          <Button
          disabled={!formState.isValid}
          className={classes.confirmButton}
          autoFocus onClick={handleTrxMainToBranch}
          >
            Confirm Transfer
          </Button>
        </DialogActions>
      </Dialog>

  {/* ====================================== Postponed Trx Confirmation Dialog ====================================== */}
    <Dialog onClose={handleClickClose2} aria-labelledby="customized-dialog-title" open={open2} maxWidth = 'lg'>
        <DialogTitle className={classes.dialogTitle} id="customized-dialog-title" onClose={handleClickClose2}>
        <IconButton onClick={handleBack2}>
          <ArrowBackIcon />
        </IconButton>
          <span style={{color: 'white'}}>Transfer Confirmation</span>
        </DialogTitle>
        <DialogContent dividers>
          <CardContent className={classes.content}>
            <PerfectScrollbar>
            <TextField
              disabled
              className={classes.textField}
              fullWidth
              label="Branch ID"
              name="branchAccountId"
              value={branchId}
              onChange={handleChangeTransfer}
              type="text"
              variant="outlined"
            />
            <TextField
              disabled
              className={classes.textField}
              fullWidth
              label="Branch Account Number"
              name="branchAccountNo"
              value={branchAcctNo}
              type="text"
              variant="outlined"
            />
            {/* <TextField
              disabled
              className={classes.textField}
              fullWidth
              label="Transfer Amount"
              name="transferAmount"
              value={transferAmt}
              type="number"
              variant="outlined"
            /> */}
            <CurrencyTextField
              disabled
              className={classes.textField}
              fullWidth
              variant="outlined"
              textAlign="left"
              label="Transfer Amount"
              name="transferAmount"
              value={transferAmt}
              currencySymbol="Rp."
              outputFormat="number"
            />
            <TextField
              disabled
              className={classes.textField}
              fullWidth
              label="Transfer Date"
              name="postponedDate"
              value={postDate}
              type="date"
              variant="outlined"
            />
            <TextField
              disabled
              className={classes.textField}
              fullWidth
              label="Remarks"
              name="remarks"
              value={transferRemarks}
              type="text"
              variant="outlined"
            />
            <TextField
              className={classes.textField}
              fullWidth
              label="Verification Code"
              name="verificationCode"
              error={hasError2('verificationCode')}
              helperText={
                    hasError2('verificationCode') ? formState2.errors.verificationCode[0] : null
              }
              value={formState2.values.verificationCode || ''}
              onChange={handleChangeTransfer2}
              type="password"
              variant="outlined"
            />
            </PerfectScrollbar>
          </CardContent>
        </DialogContent>
        <DialogActions>
          <Button
          disabled={!formState2.isValid}
          className={classes.confirmButton}
          autoFocus onClick={handleTrxMainToBranchPostponed}
          >
            Confirm Transfer
          </Button>
        </DialogActions>
      </Dialog>

      {/* ====================================== Scheduled Trx Confirmation Dialog ====================================== */}
    <Dialog onClose={handleClickClose3} aria-labelledby="customized-dialog-title" open={open3} maxWidth = 'lg'>
        <DialogTitle className={classes.dialogTitle} id="customized-dialog-title" onClose={handleClickClose3}>
        <IconButton onClick={handleBack3}>
          <ArrowBackIcon />
        </IconButton>
          <span style={{color: 'white'}}>Transfer Confirmation</span>
        </DialogTitle>
        <DialogContent dividers>
          <CardContent className={classes.content}>
            <PerfectScrollbar>
            <TextField
              disabled
              className={classes.textField}
              fullWidth
              label="Branch ID"
              name="branchAccountId"
              value={branchId}
              onChange={handleChangeTransfer}
              type="text"
              variant="outlined"
            />
            <TextField
              disabled
              className={classes.textField}
              fullWidth
              label="Branch Account Number"
              name="branchAccountNo"
              value={branchAcctNo}
              type="text"
              variant="outlined"
            />
            {/* <TextField
              disabled
              className={classes.textField}
              fullWidth
              label="Transfer Amount"
              name="transferAmount"
              value={transferAmt}
              type="number"
              variant="outlined"
            /> */}
            <CurrencyTextField
              disabled
              className={classes.textField}
              fullWidth
              variant="outlined"
              textAlign="left"
              label="Transfer Amount"
              name="transferAmount"
              value={transferAmt}
              currencySymbol="Rp."
              outputFormat="number"
            />
            <TextField
              disabled
              className={classes.textField}
              fullWidth
              label="Schedule Information"
              name="remarks"
              value={scheduleInformation}
              type="text"
              variant="outlined"
            />
            <TextField
              disabled
              className={classes.textField}
              fullWidth
              label="Remarks"
              name="remarks"
              value={transferRemarks}
              type="text"
              variant="outlined"
            />
            <TextField
              className={classes.textField}
              fullWidth
              label="Verification Code"
              name="verificationCode"
              error={hasError3('verificationCode')}
              helperText={
                    hasError3('verificationCode') ? formState3.errors.verificationCode[0] : null
              }
              value={formState3.values.verificationCode || ''}
              onChange={handleChangeTransfer3}
              type="password"
              variant="outlined"
            />
            </PerfectScrollbar>
          </CardContent>
        </DialogContent>
        <DialogActions>
          <Button
          disabled={!formState3.values.verificationCode || (formState3.values.verificationCode).length < 6}
          className={classes.confirmButton}
          autoFocus onClick={handleTrxMainToBranchScheduled}
          >
            Confirm Transfer
          </Button>
        </DialogActions>
      </Dialog>

  {/* ====================================== Transfer Success Dialog Dialog ====================================== */}
      <Dialog onClose={handleCloseSuccess} aria-labelledby="customized-dialog-title" open={openSuccess}>
        <DialogTitle className={classes.dialogTitle} id="customized-dialog-title" onClose={handleCloseSuccess}>
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
            >
              <br />
              {successMessage}
            </Typography>
        </DialogContent>
        {/* <DialogActions>
          <Button className={classes.confrimButton} autoFocus onClick={handleCloseSuccess} color="primary">
            Back To Tranfer Page
          </Button>
        </DialogActions> */}
      </Dialog>

  {/* ====================================== Transfer Immediate Failed Dialog ====================================== */}
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
      </Dialog>

      {/* ====================================== Transfer Postponed Failed Dialog ====================================== */}
      <Dialog onClose={handleCloseFail2} aria-labelledby="customized-dialog-title" open={openFail2}>
        <DialogTitle className={classes.dialogTitleFail} id="customized-dialog-title" onClose={handleCloseFail2}>
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
      </Dialog>
      
      {/* ====================================== Transfer Postponed Failed Dialog ====================================== */}
      <Dialog onClose={handleCloseFail3} aria-labelledby="customized-dialog-title" open={openFail3}>
        <DialogTitle className={classes.dialogTitleFail} id="customized-dialog-title" onClose={handleCloseFail3}>
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
      </Dialog>

  {/* ====================================== Tranfer Failed Dialog With Reload ====================================== */}
  <Dialog onClose={handleCloseFailReload} aria-labelledby="customized-dialog-title" open={openFailReload}>
        <DialogTitle className={classes.dialogTitleFail} id="customized-dialog-title" onClose={handleCloseFailReload}>
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
              variant="h3"
              align="center"
            >
              <br />
              {failMessage}
            </Typography>
        </DialogContent>
        {/* <DialogActions>
          <Button className={classes.confirmButton} autoFocus onClick={handleCloseFailReload} color="primary">
            Back To Transfer Page
          </Button>
        </DialogActions> */}
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

UsersTable.propTypes = {
  className: PropTypes.string,
  users: PropTypes.array.isRequired,
  history: PropTypes.object
};

export default withRouter(UsersTable);