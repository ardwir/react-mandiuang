import React, { useState, useEffect } from 'react';
import clsx from 'clsx';
import axios from 'axios';
import { API_BASE_URL, API_BASE_UR } from '../../../../constants'
import moment from 'moment';
import PerfectScrollbar from 'react-perfect-scrollbar';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/styles';
import BranchProfile from './components';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import validate from 'validate.js';
import CurrencyTextField from '@unicef/material-ui-currency-textfield';
import CurrencyFormat from 'react-currency-format';
import  { withRouter }  from 'react-router-dom';
import { SearchInput } from 'components';
import FilterList from '@material-ui/icons/FilterList';
import {
  Button,
  Card,
  CardActions,
  CardHeader,
  CardContent,
  Checkbox,
  Dialog,
  DialogActions,
  DialogTitle,
  DialogContent,
  Divider,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  Tooltip,
  TableSortLabel,
  TablePagination,
  Typography
} from '@material-ui/core';

// import mockData from './data';
import Skeleton from '@material-ui/lab/Skeleton';
import { StatusBullet } from 'components';

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
  deactivateButton: {
    marginRight: theme.spacing(1), 
    backgroundColor: 'white', 
    color: 'red'
  },
  approveButton: {
    marginRight: theme.spacing(1), 
    backgroundColor: 'white', 
    color: 'primary'
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
  statusContainer: {
    display: 'flex',
    alignItems: 'center'
  },
  status: {
    marginRight: theme.spacing(1)
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
  filterList: {
    width: '5%',
    marginTop: theme.spacing(2),
    marginLeft: theme.spacing(2),
    marginRight: theme.spacing(2),
    align: 'right'
  },
  history: {
    width: '15%',
    marginTop: theme.spacing(2),
    marginLeft: theme.spacing(2),
    marginRight: theme.spacing(2),
    align: 'right'
  },
}));

const schema = {
  amountApproved: {
    presence: { allowEmpty: false, message: 'is required' },
  },
  remarks: {
    presence: { allowEmpty: false, message: 'is required' },
    length: {
      minimum: 4
    }
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
      minimum: 4
    }
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
  Approved: 'success',
  Pending: 'info',
  Rejected: 'danger'
};


const BudgetRequestTable = props => {
  const { className, history, ...rest } = props;

  const classes = useStyles();

  // const [requests] = useState(mockData);

  const [successMessage, setSuccessMessage] = useState([]);
  const [failMessage, setFailMessage] = useState({});
  const [passingReqId, setPassingReqId] = useState({});
  const [passingBranchAcctIdSubmit, setPassingBranchAcctIdSubmit] = useState({});
  const [passingBranchAcctNoSubmit, setPassingBranchAcctNoSubmit] = useState({});
  const [passingRequestAmt, setPassingRequestAmt] = useState({});
  const [passingPurpose, setPassingPurpose] = useState({});
  const [passingRemarks, setPassingRemarks] = useState({});
  const [passingSubmitBy, setPassingSubmitBy] = useState({});
  const [passingStatus, setPassingStatus] = useState({});
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [page, setPage] = useState(0);
  const [rowsPerPage2, setRowsPerPage2] = useState(10);
  const [page2, setPage2] = useState(0);
  const [openRow, setOpenRow] = React.useState(false);
  const [openRow2, setOpenRow2] = React.useState(false);
  const [open, setOpen] = React.useState(false);
  const [openFail, setOpenFail] = React.useState(false);
  const [openFail2, setOpenFail2] = React.useState(false);
  // const [openFailReload, setOpenFailReload] = React.useState(false);
  const [openSuccess, setOpenSuccess] = React.useState(false);
  const [openHistory, setOpenHistory] = React.useState(false);
  const [openFilter, setOpenFilter] = React.useState(false);
  const [requests, setRequests] = useState([]);
  const [allRequests, setAllRequests] = useState([]);
  const [dataLength, setDataLength] = useState({});
  const [dataLength2, setDataLength2] = useState({});
  const [openUnauthorized, setOpenUnauthorized] = React.useState(false);
  const localData = JSON.parse(localStorage.getItem("data"));


// =================================================== Budget Request History =================================================
  const [formState3, setFormState3] = useState({
    isValid: false,
    values: {
      accountName:'',
      trxAmountF:'',
      amountSign:'',
      status:'',
      dateStart: '',
      dateEnd:'',
      requestStatus:''
    },
    touched: {},
    errors: {}
  });

  const handleChange3 = event => {
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
  const handleOpenHistory = () => {
    console.log("Clicked")
      axios.get(API_BASE_URL + '/approverequest-service/v1/requestBranch/allRequestBudgetAll?page=' + page2 + '&rowsPerPage=' + rowsPerPage2
                  + '&accountName=' + formState3.values.accountName + '&amount=' + formState3.values.trxAmountF + '&dateStart=' + formState3.values.dateStart +
                      '&dateEnd=' + formState3.values.dateEnd + '&amountSign=' + formState3.values.amountSign + '&status=' + formState3.values.status
      , {
          headers: {
            'Authorization': `Bearer ${localData}` 
          }
      })
          .then(res => {
              console.log(res) 
              setAllRequests(res.data.branchReqBudget);
              setDataLength2(res.data.dataCount);
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
    setOpenHistory(true);
  }

  useEffect(() => {
    axios.get(API_BASE_URL + '/approverequest-service/v1/requestBranch/allRequestBudgetAll?page=' + page2 + '&rowsPerPage=' + rowsPerPage2
                  + '&accountName=' + formState3.values.accountName + '&amount=' + formState3.values.trxAmountF + '&dateStart=' + formState3.values.dateStart +
                      '&dateEnd=' + formState3.values.dateEnd + '&amountSign=' + formState3.values.amountSign + '&status=' + formState3.values.status
    , {
        headers: {
          'Authorization': `Bearer ${localData}` 
        }
    })
        .then(res => {
            console.log(res) 
            setAllRequests(res.data.branchReqBudget);
            setDataLength2(res.data.dataCount);
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
  }, [page2, rowsPerPage2])

  const handleRowClick2 = (reqId, branchAcctIdSubmit, branchAcctNoSubmit, requestAmt,
    purpose, remarks, submitBy, status) => {
    setPassingReqId(reqId);
    console.log(passingReqId); 
    setPassingBranchAcctIdSubmit(branchAcctIdSubmit);
    console.log(passingBranchAcctIdSubmit); 
    setPassingBranchAcctNoSubmit(branchAcctNoSubmit);
    console.log(passingBranchAcctNoSubmit); 
    setPassingRequestAmt(requestAmt);
    console.log(passingRequestAmt); 
    setPassingPurpose(purpose);
    console.log(passingPurpose); 
    setPassingRemarks(remarks);
    console.log(passingRemarks) 
    setPassingSubmitBy(submitBy);
    console.log(passingSubmitBy);
    setPassingStatus(status);
    console.log(passingStatus);
    setOpenRow2(true);
  };

  const handleRowClose2 = () => {
    setOpenRow2(false);
  };

  const handleCloseHistory = () => {

    setOpenHistory(false);
  }

  const handlePageChange2 = (event, page2) => {
    setPage2(page2);
  };

  const handleRowsPerPageChange2 = event => {
    setRowsPerPage2(event.target.value);
    setPage2(0);
  };

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
  
  const handleSearch = () => {
    
    axios.get(API_BASE_URL + '/approverequest-service/v1/requestBranch/allRequestBudget?page=' + page + '&rowsPerPage=' + rowsPerPage
                  + '&accountName=' + (formState4.values.accountName).replace(" ", "%20"), {
          headers: {
            'Authorization': `Bearer ${localData}` 
          }
      })
          .then(res => {
              console.log(res) 
              setRequests(res.data.branchReqBudget);
              setDataLength(res.data.dataCount);
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

  const handleSearch2 = () => {
    if (formState3.values.dateEnd != '' && formState3.values.dateStart != ''){
      formState3.values.dateEnd = moment(formState3.values.dateEnd).format('MM/DD/yyyy');
      formState3.values.dateStart = moment(formState3.values.dateStart).format('MM/DD/yyyy');
    }
    axios.get(API_BASE_URL + '/approverequest-service/v1/requestBranch/allRequestBudgetAll?page=' + page2 + '&rowsPerPage=' + rowsPerPage2
                  + '&accountName=' + (formState3.values.accountName).replace(" ", "%20") + '&amount=' + formState3.values.trxAmountF + '&dateStart=' + formState3.values.dateStart +
                      '&dateEnd=' + formState3.values.dateEnd + '&amountSign=' + formState3.values.amountSign + '&status=' + formState3.values.status
      , {
          headers: {
            'Authorization': `Bearer ${localData}` 
          }
      })
          .then(res => {
              console.log(res) 
              setAllRequests(res.data.branchReqBudget);
              setDataLength2(res.data.dataCount);
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

  const handleOpenFilter = () => {
    setOpenFilter(true);
  }

  const handleCloseFilter = () => {
    setOpenFilter(false);
  }

  const handleApplyFilter = () => {
    if (formState3.values.dateEnd != '' && formState3.values.dateStart != ''){
      formState3.values.dateEnd = moment(formState3.values.dateEnd).format('MM/DD/yyyy');
      formState3.values.dateStart = moment(formState3.values.dateStart).format('MM/DD/yyyy');
    }
    axios.get(API_BASE_URL + '/approverequest-service/v1/requestBranch/allRequestBudgetAll?page=' + page2 + '&rowsPerPage=' + rowsPerPage2
                  + '&accountName=' + formState3.values.accountName + '&amount=' + formState3.values.trxAmountF + '&dateStart=' + formState3.values.dateStart +
                      '&dateEnd=' + formState3.values.dateEnd + '&amountSign=' + formState3.values.amountSign + '&status=' + formState3.values.status
      , {
          headers: {
            'Authorization': `Bearer ${localData}` 
          }
      })
          .then(res => {
              console.log(res) 
              setAllRequests(res.data.branchReqBudget);
              setDataLength2(res.data.dataCount);
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
          setOpenFilter(false);
  }

  const handleResetFilter = () => {
    setPage2(0);
    setRowsPerPage2(10);
    formState3.values.trxAmountF = '';
    formState3.values.accountName = '';
    formState3.values.dateStart = '';
    formState3.values.dateEnd = '';
    formState3.values.amountSign= '';
    formState3.values.status= '';

    axios.get(API_BASE_URL + '/approverequest-service/v1/requestBranch/allRequestBudgetAll?page=' + page2 + '&rowsPerPage=' + rowsPerPage2
                  + '&accountName=' + formState3.values.accountName + '&amount=' + formState3.values.trxAmountF + '&dateStart=' + formState3.values.dateStart +
                      '&dateEnd=' + formState3.values.dateEnd + '&amountSign=' + formState3.values.amountSign + '&status=' + formState3.values.status
      , {
          headers: {
            'Authorization': `Bearer ${localData}` 
          }
      })
          .then(res => {
              console.log(res) 
              setAllRequests(res.data.branchReqBudget);
              setDataLength2(res.data.dataCount);
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
    setOpenFilter(false);
  }
  // ====================================== For Request List  ======================================
  useEffect(() => {
    axios.get(API_BASE_URL + '/approverequest-service/v1/requestBranch/allRequestBudget?page=' + page + '&rowsPerPage=' + rowsPerPage + '&accountName=' + formState4.values.accountName, {
        headers: {
          'Authorization': `Bearer ${localData}` 
        }
    })
        .then(res => {
            console.log(res) 
            setRequests(res.data.branchReqBudget);
            setDataLength(res.data.dataCount);
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
  }, [page, rowsPerPage])
    
  const handleContinueToSignIn = event => {
    history.push('/sign-in');
  }

  const handlePageChange = (event, page) => {
    setPage(page);
  };
  
  const handleRowsPerPageChange = event => {
    setRowsPerPage(event.target.value);
    setPage(0);
  };
  
  // ====================================== Approve Budget Dialog  ======================================
  const handleRowClick = (reqId, branchAcctIdSubmit, branchAcctNoSubmit, requestAmt,
    purpose, remarks, submitBy) => {
    setPassingReqId(reqId);
    console.log(passingReqId); 
    setPassingBranchAcctIdSubmit(branchAcctIdSubmit);
    console.log(passingBranchAcctIdSubmit); 
    setPassingBranchAcctNoSubmit(branchAcctNoSubmit);
    console.log(passingBranchAcctNoSubmit); 
    setPassingRequestAmt(requestAmt);
    console.log(passingRequestAmt); 
    setPassingPurpose(purpose);
    console.log(passingPurpose); 
    setPassingRemarks(remarks);
    console.log(passingRemarks) 
    setPassingSubmitBy(submitBy);
    console.log(passingSubmitBy);
    setOpenRow(true);
  };

  const handleRowClose = () => {
    setOpenRow(false);
  };

  const hasError = field =>
    formState.touched[field] && formState.errors[field] ? true : false;

  const [formState, setFormState] = useState({
    isValid: false,
    values: {},
    touched: {},
    errors: {}
  });

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
  
  const handleApproveBudget = event => {
    event.preventDefault();
    var data = JSON.stringify(
      {
        "req_id": `${formState.values.reqId}`,
        "branch_account_id": `${formState.values.branchAccountId}`,
        "branch_account_no": `${formState.values.branchAccountNo}`,
        "approved_amount": `${formState.values.amountApproved}`,
        "remarks": `${formState.values.remarks}`,
        "verification_code": `${formState.values.verificationCode}`
      }
    ) 
    
    axios({
      method: 'POST', 
      url: API_BASE_URL + '/approverequest-service/v1/actionMain/approveBudget', 
      data: data, 
      headers: {
        'Authorization': `Bearer ${localData}`,
        'Content-Type': 'application/json'
      }
    }).then(res =>{
      let statusCode = res.status
      if (statusCode === 202){
        console.log(data)
        // alert(res.data.message)
        setSuccessMessage(res.data.message)
        setOpenRow(false);
        setOpen(false);
        setOpenSuccess(true)
        // window.location.reload()
      }
    }).catch(err => {
      console.log(data);
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
        setOpenRow(false);
        setOpen(false);
        setOpenFail(true)
      }
      // alert(err.response.data.message)
    })
  };
  // ====================================== Reject Budget  ======================================
  const handleBack = () => {
    setOpenRow(true);
    setOpen(false);
  };

  const handleClickOpen = () => {
    setOpenRow(false)
    setOpen(true); 
  }

  const handleClickClose = () => {
    setOpen(false);
    setOpenRow(false);
  }

  const [formState2, setFormState2] = useState({
    isValid: false,
    values: {},
    touched: {},
    errors: {}
  });

  const hasError2 = field =>
    formState2.touched[field] && formState2.errors[field] ? true : false;

  useEffect(() => {
    const errors = validate(formState2.values, schema2);
  
    setFormState(formState2 => ({
      ...formState2,
      isValid: errors ? false : true,
      errors: errors || {}
    }));
  }, [formState2.values]);
  
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

  const handleRejectBudget = event => {
    event.preventDefault();
    var data = JSON.stringify(
      {
        "req_id": `${formState2.values.reqId}`,
        "branch_account_id": `${formState2.values.branchAccountId}`,
        "branch_account_no": `${formState2.values.branchAccountNo}`,
        "remarks": `${formState2.values.remarks}`,
        "verification_code": `${formState2.values.verificationCode}`
      }
    ) 
    
    axios({
      method: 'POST', 
      url: API_BASE_URL + '/approverequest-service/v1/actionMain/rejectBudget', 
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
        setOpenRow(false);
        setOpenSuccess(true)
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
        setFailMessage(err.response.data.message)
        setOpen(false);
        setOpenRow(false);
        setOpenFail2(true);
      }
    })
  };

// =================================================== API Response =================================================
  const handleCloseSuccess = () => {
    setOpenSuccess(false);
    window.location.reload()
  }

  const handleCloseFail = () => {
    setOpenRow(true);
    setOpenFail(false);
  }

  const handleCloseFail2 = () => {
    setOpenRow(false);
    setOpen(true);
    setOpenFail2(false);
  }

  // const handleCloseFailReload = () => {
  //   setOpenFailReload(false);
  //   window.location.reload()
  // }
  // ====================================== Reserved  ======================================
  
  return (
    <Card
      {...rest}
      className={clsx(classes.root, className)}
    >
      {/* <CardHeader
        title="Budget Request"
      /> */}
      <Divider />
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
            <Button
              style={{float: 'right'}}
              className={classes.history}
              color="primary"
              variant="contained"
              onClick={handleOpenHistory}
            >
              Request History
            </Button>        
          </div>
          <br />
        <PerfectScrollbar>
          <div className={classes.inner}>
            <Table>
              <TableHead>
                <TableRow>
                  {/* <TableCell>Request ID</TableCell> */}
                  <TableCell>Branch Name</TableCell>
                  <TableCell>Request Amount</TableCell>
                  <TableCell sortDirection="desc">
                    <Tooltip
                      enterDelay={300}
                      title="Sort"
                    >
                      <TableSortLabel
                        active
                        direction="desc"
                      >
                        Request Date
                      </TableSortLabel>
                    </Tooltip>
                  </TableCell>
                  <TableCell>Status</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
              {requests.slice(0, rowsPerPage).map(request => (
                  <TableRow
                    hover
                    key={request.reqId}
                    onClick={()=>handleRowClick(request.reqId, request.branchAcctIdSubmit, request.branchAcctNoSubmit, request.requestAmt,
                    request.purpose, request.remarks, request.submitBy)}
                  >
                    {/* <TableCell>{request.reqId || <Skeleton width={150} animation='wave'/>}</TableCell> */}
                    <TableCell>{request.branchAcctName || <Skeleton width={150} animation='wave'/>}</TableCell>
                    <TableCell>{<CurrencyFormat value={request.requestAmt} displayType={'text'} thousandSeparator={true} prefix={'Rp.'} /> || <Skeleton width={150} animation='wave'/>}</TableCell>
                    <TableCell>
                      {moment(request.submitDate).format('DD/MM/YYYY, HH:mm') || <Skeleton width={150} animation='wave'/>}
                    </TableCell>
                    <TableCell>
                      <div className={classes.statusContainer}>
                        <StatusBullet
                          className={classes.status}
                          color={statusColors[request.status]}
                          size="sm"
                        />
                        {request.status || <Skeleton width={150} animation='wave'/>} 
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
      <Divider />
{/* ========================================= Budget Approval/Rejection Dialog ============================================================*/}
      <Dialog onClose={handleRowClose} aria-labelledby="customized-dialog-title" open={openRow} maxWidth = 'lg' fullWidth>
        <DialogTitle className={classes.dialogTitle} id="customized-dialog-title" onClose={handleRowClose}>
          <span style={{color: 'white'}}>Budget Approval</span>
        </DialogTitle>
        <DialogContent dividers>
          <CardContent className={classes.content}>
            <PerfectScrollbar>
              <div className={classes.inner}>
                <BranchProfile branchId={passingBranchAcctIdSubmit}/>
              </div>
              <TextField
                disabled
                className={classes.textField}
                fullWidth
                label="Request ID"
                name="reqId"
                value={formState.values.reqId = `${passingReqId}` || `${passingReqId}`}
                onChange={handleChange}
                type="text"
                variant="outlined"
              />
              <TextField
                disabled
                className={classes.textField}
                fullWidth
                label="Branch ID"
                name="branchAccountId"
                value={formState.values.branchAccountId = `${passingBranchAcctIdSubmit}` || `${passingBranchAcctIdSubmit}`}
                onChange={handleChange}
                type="text"
                variant="outlined"
              />
              <TextField
                disabled
                className={classes.textField}
                fullWidth
                label="Branch Account Number"
                name="branchAccountNo"
                value={formState.values.branchAccountNo = `${passingBranchAcctNoSubmit}` || `${passingBranchAcctNoSubmit}`}
                onChange={handleChange}
                type="text"
                variant="outlined"
              />
              <CurrencyTextField
                disabled
                className={classes.textField}
                fullWidth
                variant="outlined"
                textAlign="left"
                label="Requested Amount"
                name="requestedAmount"
                value={formState.values.requestAmount = `${passingRequestAmt}` || `${passingRequestAmt}`}
                currencySymbol="Rp."
                outputFormat="number"
              />
              <TextField
                disabled
                className={classes.textField}
                fullWidth
                label="Request Purpose"
                name="requestReason"
                value={`${passingPurpose}`}
                onChange={handleChange}
                type="text"
                variant="outlined"
              />
              <TextField
                disabled
                className={classes.textField}
                fullWidth
                label="Request Reason"
                name="requestReason"
                value={`${passingRemarks}`}
                onChange={handleChange}
                type="text"
                variant="outlined"
              />
              <TextField
                disabled
                className={classes.textField}
                fullWidth
                label="Requested By"
                name="submitBy"
                value={formState.values.submitBy = `${passingSubmitBy}` || `${passingSubmitBy}`}
                onChange={handleChange}
                type="text"
                variant="outlined"
              />
              <CurrencyTextField
              className={classes.textField}
              label="Amount Approved"
              value={formState.values.amountApproved}
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
                    ['amountApproved']:value
                  }
                })
              }}
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
            </PerfectScrollbar>
          </CardContent>
        </DialogContent>
        <DialogActions>
          <Button
            disabled={!formState.values.amountApproved || formState.values.amountApproved < 10000 || formState.values.amountApproved > passingRequestAmt 
                || !formState.values.remarks || (formState.values.remarks).length < 6|| !formState.values.verificationCode || (formState.values.verificationCode).length < 6} 
            className={classes.approveButton}
            autoFocus onClick={handleApproveBudget} color="primary"
          >
            Approve Request
          </Button>
          
          <Button
          className={classes.deactivateButton}
          autoFocus onClick={handleClickOpen}
          >
            Reject Request
          </Button>
        </DialogActions>
      </Dialog>
{/* ========================================= All Request Budget Info Dialog ============================================================*/}
      <Dialog onClose={handleRowClose2} aria-labelledby="customized-dialog-title" open={openRow2}>
        <DialogTitle className={classes.dialogTitle} id="customized-dialog-title" onClose={handleRowClose2}>
          <span style={{color: 'white'}}>Request Information</span>
        </DialogTitle>
        <DialogContent dividers>
          <CardContent className={classes.content}>
            <PerfectScrollbar>
              <div className={classes.inner}>
                <BranchProfile branchId={passingBranchAcctIdSubmit}/>
              </div>
              <TextField
                disabled
                className={classes.textField}
                fullWidth
                label="Request ID"
                name="reqId"
                value={`${passingReqId}`}
                onChange={handleChange}
                type="text"
                variant="outlined"
              />
              <TextField
                disabled
                className={classes.textField}
                fullWidth
                label="Branch ID"
                name="branchAccountId"
                value={`${passingBranchAcctIdSubmit}`}
                onChange={handleChange}
                type="text"
                variant="outlined"
              />
              <TextField
                disabled
                className={classes.textField}
                fullWidth
                label="Branch Account Number"
                name="branchAccountNo"
                value={`${passingBranchAcctNoSubmit}`}
                onChange={handleChange}
                type="text"
                variant="outlined"
              />
              <CurrencyTextField
                disabled
                className={classes.textField}
                fullWidth
                variant="outlined"
                textAlign="left"
                label="Requested Amount"
                name="requestedAmount"
                value={`${passingRequestAmt}`}
                currencySymbol="Rp."
                outputFormat="number"
              />
              <TextField
                disabled
                className={classes.textField}
                fullWidth
                label="Request Purpose"
                name="requestReason"
                value={`${passingPurpose}`}
                onChange={handleChange}
                type="text"
                variant="outlined"
              />
              <TextField
                disabled
                className={classes.textField}
                fullWidth
                label="Request Reason"
                name="requestReason"
                value={`${passingRemarks}`}
                onChange={handleChange}
                type="text"
                variant="outlined"
              />
              <TextField
                disabled
                className={classes.textField}
                fullWidth
                label="Requested By"
                name="submitBy"
                value={`${passingSubmitBy}`}
                onChange={handleChange}
                type="text"
                variant="outlined"
              />
              <TextField
                disabled
                className={classes.textField}
                fullWidth
                label="Request Status"
                name="requestStatus"
                value={`${passingStatus}`}
                onChange={handleChange}
                type="text"
                variant="outlined"
              />
            </PerfectScrollbar>
          </CardContent>
        </DialogContent>
      </Dialog>

      <Dialog onClose={handleClickClose} aria-labelledby="customized-dialog-title" open={open} maxWidth = 'lg' fullWidth>
        <DialogTitle className={classes.dialogTitle} id="customized-dialog-title" onClose={handleClickClose}>
        <IconButton onClick={handleBack}>
          <ArrowBackIcon />
        </IconButton>
          <span style={{color: 'white'}}>Reject Confirmation</span>
        </DialogTitle>
        <DialogContent dividers>
          <CardContent className={classes.content}>
            <PerfectScrollbar>
              <div className={classes.inner}>
                <BranchProfile branchId={passingBranchAcctIdSubmit}/>
              </div>
              <TextField
                disabled
                className={classes.textField}
                fullWidth
                label="Request ID"
                name="reqId"
                value={formState2.values.reqId = `${passingReqId}` || `${passingReqId}`}
                onChange={handleChange2}
                type="text"
                variant="outlined"
              />
              <TextField
                disabled
                className={classes.textField}
                fullWidth
                label="Branch ID"
                name="branchAccountId"
                value={formState2.values.branchAccountId = `${passingBranchAcctIdSubmit}` || `${passingBranchAcctIdSubmit}`}
                onChange={handleChange2}
                type="text"
                variant="outlined"
              />
              <TextField
                disabled
                className={classes.textField}
                fullWidth
                label="Branch Account Number"
                name="branchAccountNo"
                value={formState2.values.branchAccountNo = `${passingBranchAcctNoSubmit}` || `${passingBranchAcctNoSubmit}`}
                onChange={handleChange2}
                type="text"
                variant="outlined"
              />
              {/* <TextField
                disabled
                className={classes.textField}
                fullWidth
                label="Requested Amount"
                name="requestedAmount"
                value={formState2.values.requestAmount = `${passingRequestAmt}` || `${passingRequestAmt}`}
                onChange={handleChange2}
                type="text"
                variant="outlined"
              /> */}
              <CurrencyTextField
                disabled
                className={classes.textField}
                fullWidth
                variant="outlined"
                textAlign="left"
                label="Requested Amount"
                name="requestedAmount"
                value={formState2.values.requestAmount = `${passingRequestAmt}` || `${passingRequestAmt}`}
                currencySymbol="Rp."
                outputFormat="number"
              />
              <TextField
                disabled
                className={classes.textField}
                fullWidth
                label="Requested Reason"
                name="requestReason"
                value={`${passingPurpose}`}
                onChange={handleChange2}
                type="text"
                variant="outlined"
              />
              <TextField
                disabled
                className={classes.textField}
                fullWidth
                label="Requested Reason"
                name="requestReason"
                value={`${passingRemarks}`}
                onChange={handleChange2}
                type="text"
                variant="outlined"
              />
              <TextField
                disabled
                className={classes.textField}
                fullWidth
                label="Requested By"
                name="submitBy"
                value={formState2.values.submitBy = `${passingSubmitBy}` || `${passingSubmitBy}`}
                onChange={handleChange2}
                type="text"
                variant="outlined"
              />
              <TextField
                className={classes.textField}
                fullWidth             
                label="Reason"
                name="remarks"
                error={hasError2('remarks')}
                helperText={
                    hasError2('remarks') ? formState2.errors.remarks[0] : null
                }
                value={formState2.values.remarks || ''}
                onChange={handleChange2}
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
                onChange={handleChange2}
                type="password"
                variant="outlined"
              />
            </PerfectScrollbar>
          </CardContent>
        </DialogContent>
        <DialogActions>
          <Button
          className={classes.deactivateButton}
          autoFocus onClick={handleRejectBudget}
          disabled={!formState2.values.verificationCode || (formState2.values.verificationCode).length < 6 || !formState2.values.remarks || (formState2.values.remarks).length < 6 }
          >
            Confirm Rejection
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

  {/* ====================================== Transfer Failed Approve Dialog ====================================== */}
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
  {/* ====================================== Transfer Failed Reject Dialog ====================================== */}
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

{/* // ====================================== All Request Budget History  ====================================== */}
<Dialog onClose={handleCloseHistory} aria-labelledby="customized-dialog-title" open={openHistory} maxWidth = 'lg' fullWidth>
        <DialogTitle className={classes.dialogTitle} id="customized-dialog-title" onClose={handleCloseHistory}>
          <span style={{color: 'white'}}>Budget Request History</span>
        </DialogTitle>
        <DialogContent dividers>
          <CardContent className={classes.content}>
          <div
            className={classes.row}
          >
              <SearchInput
                style={{float: 'left'}}
                className={classes.searchInput}
                placeholder="Search Branch Name"
                name="accountName" 
                value={formState3.values.accountName}
                onChange={handleChange3}
              />
              <Button
                style={{float: 'left'}}
                className={classes.searchButton}
                color="primary"
                variant="contained"
                onClick={handleSearch2}
              >
                Search
              </Button>
            <span className={classes.flexGrow} />
            <Button
              style={{float: 'right'}}
              className={classes.filterList}
              color="primary"
              variant="contained"
              onClick={handleOpenFilter}
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
                  {/* <TableCell>Request ID</TableCell> */}
                  <TableCell>Branch Name</TableCell>
                  <TableCell>Request Amount</TableCell>
                  <TableCell sortDirection="desc">
                    <Tooltip
                      enterDelay={300}
                      title="Sort"
                    >
                      <TableSortLabel
                        active
                        direction="desc"
                      >
                        Request Date
                      </TableSortLabel>
                    </Tooltip>
                  </TableCell>
                  <TableCell>Status</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
              {allRequests.slice(0, rowsPerPage2).map(request => (
                  <TableRow
                    hover
                    key={request.reqId}
                    onClick={()=>handleRowClick2(request.reqId, request.branchAcctIdSubmit, request.branchAcctNoSubmit, request.requestAmt,
                    request.purpose, request.remarks, request.submitBy, request.status)}
                  >
                    {/* <TableCell>{request.reqId || <Skeleton width={150} animation='wave'/>}</TableCell> */}
                    <TableCell>{request.branchAcctName || <Skeleton width={150} animation='wave'/>}</TableCell>
                    <TableCell>{<CurrencyFormat value={request.requestAmt} displayType={'text'} thousandSeparator={true} prefix={'Rp.'} /> || <Skeleton width={150} animation='wave'/>}</TableCell>
                    <TableCell>
                      {moment(request.submitDate).format('DD/MM/YYYY, HH:mm') || <Skeleton width={150} animation='wave'/>}
                    </TableCell>
                    <TableCell>
                      <div className={classes.statusContainer}>
                        <StatusBullet
                          className={classes.status}
                          color={statusColors[request.status]}
                          size="sm"
                        />
                        {request.status || <Skeleton width={150} animation='wave'/>} 
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
          count={dataLength2}
          onChangePage={handlePageChange2}
          onChangeRowsPerPage={handleRowsPerPageChange2}
          page={page2}
          rowsPerPage={rowsPerPage2}
          rowsPerPageOptions={[5, 10, 25]}
        />
      </CardActions>
    </DialogContent>
        <DialogActions>
          <Button autoFocus onClick={handleCloseHistory} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
  {/* ====================================== Filter Dialog ====================================== */}
    <Dialog onClose={handleCloseFilter} aria-labelledby="customized-dialog-title" open={openFilter}>
        <DialogTitle className = {classes.dialogTitle} id="customized-dialog-title" onClose={handleCloseFilter}>
          <span style={{color: 'white'}}>Filter Selection</span>
        </DialogTitle>
          <DialogContent dividers>
            <TextField
              className={classes.textField}
              fullWidth
              label="Transaction Amount"
              name="trxAmountF"
              value={formState3.values.trxAmountF || ''}
              onChange={handleChange3}
              type="number"
              variant="outlined"
            />
            <TextField
              className={classes.textField}
              fullWidth
              name="dateStart"
              value={formState3.values.dateStart || ''}
              onChange={handleChange3}
              type="date"
              variant="outlined"
            />
            <FormHelperText>Select Start Date  </FormHelperText>
            <TextField
              className={classes.textField}
              fullWidth
              name="dateEnd"
              value={formState3.values.dateEnd || ''}
              onChange={handleChange3}
              type="date"
              variant="outlined"
            />
            <FormHelperText>Select End Date  </FormHelperText>
            <FormControl className={classes.textField} style={{paddingRight:"25px"}}>
              <InputLabel>Amount Option</InputLabel>
              <Select
                name="amountSign"
                value={formState3.values.amountSign}
                onChange={handleChange3}
              >
                <MenuItem value="">
                  <em>None</em>
                </MenuItem>
                <MenuItem value={"greater"}>Greater Than</MenuItem>
                <MenuItem value={"lesser"}>Lesser Than</MenuItem>
              </Select>
              <FormHelperText>Amount Filter Options.  </FormHelperText>
            </FormControl>
            <FormControl className={classes.textField} style={{paddingRight:"25px"}}>
              <InputLabel>Tranfer Status</InputLabel>
              <Select
                name="status"
                value={formState3.values.status}
                onChange={handleChange3}
              >
                <MenuItem value="">
                  <em>None</em>
                </MenuItem>
                <MenuItem value={"Pending"}>Pending</MenuItem>
                <MenuItem value={"Approved"}>Approved</MenuItem>
                <MenuItem value={"Rejected"}>Rejected</MenuItem>
              </Select>
              <FormHelperText>Request Status Options.</FormHelperText>
            </FormControl>
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

BudgetRequestTable.propTypes = {
  className: PropTypes.string,
  history: PropTypes.object
};

export default withRouter(BudgetRequestTable);
