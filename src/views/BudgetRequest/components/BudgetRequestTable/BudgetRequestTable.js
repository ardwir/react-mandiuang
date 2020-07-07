import React, { useState, useEffect } from 'react';
import clsx from 'clsx';
import axios from 'axios';
import { API_BASE_URL } from '../../../../constants'
import moment from 'moment';
import PerfectScrollbar from 'react-perfect-scrollbar';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/styles';
import BranchProfile from './components';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import validate from 'validate.js';
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
import Skeleton from 'react-loading-skeleton';
import mockData from './data';
import { StatusBullet } from 'components';

const useStyles = makeStyles(theme => ({
  root: {},
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
}));

const schema = {
  reqId: {
    presence: { allowEmpty: false, message: 'is required' },
  },
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
      maximum: 8,
      minimum: 8
    }
  }
};

const schema2 = {
  reqId: {
    presence: { allowEmpty: false, message: 'is required' },
  },
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
  remarks: {
    presence: { allowEmpty: false, message: 'is required' },
    length: {
      minimum: 4
    }
  },
  verificationCode: {
    presence: { allowEmpty: false, message: 'is required' },
    length: {
      maximum: 8,
      minimum: 8
    }
  }
};

const statusColors = {
  Done: 'success',
  Pending: 'info',
  Rejected: 'danger'
};


const BudgetRequestTable = props => {
  const { className, ...rest } = props;

  const classes = useStyles();

  // const [requests] = useState(mockData);

  const [passingReqId, setPassingReqId] = useState({});
  const [passingBranchAcctIdSubmit, setPassingBranchAcctIdSubmit] = useState({});
  const [passingBranchAcctNoSubmit, setPassingBranchAcctNoSubmit] = useState({});
  const [passingRequestAmt, setPassingRequestAmt] = useState({});
  const [passingPurpose, setPassingPurpose] = useState({});
  const [passingRemarks, setPassingRemarks] = useState({});
  const [passingSubmitBy, setPassingSubmitBy] = useState({});
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [page, setPage] = useState(0);
  const [openRow, setOpenRow] = React.useState(false);
  const [open, setOpen] = React.useState(false);
  const [requests, setRequests] = useState([]);
  const localData = JSON.parse(localStorage.getItem("data"));
  // ====================================== For Request List  ======================================
  useEffect(() => {
    axios.get(API_BASE_URL + '/approverequest-service/v1/requestBranch/allRequestBudget', {
        headers: {
          'Authorization': `Bearer ${localData.accessToken}` 
        }
    })
        .then(res => {
            console.log(res) 
            setRequests(res.data);
        })
        .catch(err => {
            console.log(err + localData.accessToken)
        })
  }, [])

  const handlePageChange = (event, page) => {
    setPage(page);
  };
  
  const handleRowsPerPageChange = event => {
    setRowsPerPage(event.target.value);
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
        'Authorization': `Bearer ${localData.accessToken}`,
        'Content-Type': 'application/json'
      }
    }).then(res =>{
      let statusCode = res.status
      if (statusCode === 202){
        console.log(data)
        alert('Approve Budget Success')
        window.location.reload()
      }
    }).catch(err => {
      console.warn(err)
      console.log(data)
      alert('Approve Budget Failed')
    })
  };
  // ====================================== Reject Budget  ======================================
  const handleBack = () => {
    setOpen(false);
  };

  const handleClickOpen = () => {
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
        'Authorization': `Bearer ${localData.accessToken}`,
        'Content-Type': 'application/json'
      }
    }).then(res =>{
      let statusCode = res.status
      if (statusCode === 202){
        console.log(data)
        alert('Reject Budget Success')
        window.location.reload()
      }
    }).catch(err => {
      console.warn(err)
      console.log(data)
      alert('Approve Budget Failed')
    })
  };
  // ====================================== Reserved  ======================================
  
  
  return (
    <Card
      {...rest}
      className={clsx(classes.root, className)}
    >
      <CardHeader
        title="Budget Request"
      />
      <Divider />
      <CardContent className={classes.content}>
        <PerfectScrollbar>
          <div className={classes.inner}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Request ID</TableCell>
                  <TableCell>Branch ID</TableCell>
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
                    <TableCell>{request.reqId || <Skeleton width={150} animation='wave'/>}</TableCell>
                    <TableCell>{request.branchAcctIdSubmit || <Skeleton width={150} animation='wave'/>}</TableCell>
                    <TableCell>{request.requestAmt || <Skeleton width={150} animation='wave'/>}</TableCell>
                    <TableCell>
                      {moment(request.submitDate).format('DD/MM/YYYY') || <Skeleton width={150} animation='wave'/>}
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
                )) }
              </TableBody>
            </Table>
          </div>
        </PerfectScrollbar>
      </CardContent>
      <CardActions className={classes.actions}>
        <TablePagination
          component="div"
          count={requests.length}
          onChangePage={handlePageChange}
          onChangeRowsPerPage={handleRowsPerPageChange}
          page={page}
          rowsPerPage={rowsPerPage}
          rowsPerPageOptions={[5, 10, 25]}
        />
      </CardActions>
      <Divider />

      <Dialog onClose={handleRowClose} aria-labelledby="customized-dialog-title" open={openRow} maxWidth = 'lg' fullWidth>
        <DialogTitle id="customized-dialog-title" onClose={handleRowClose}>
          Budget Approval
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
              <TextField
                disabled
                className={classes.textField}
                fullWidth
                label="Requested Amount"
                name="requestedAmount"
                value={formState.values.requestAmount = `${passingRequestAmt}` || `${passingRequestAmt}`}
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
              <TextField
                className={classes.textField}
                fullWidth
                label="Amount Approved"
                name="amountApproved"
                value={formState.values.amountApproved || ''}
                onChange={handleChange}
                type="number"
                variant="outlined"
              />
              <TextField
                className={classes.textField}
                fullWidth
                label="Remarks"
                name="remarks"
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
                value={formState.values.verificationCode || ''}
                onChange={handleChange}
                type="password"
                variant="outlined"
              />
              <div className={classes.agreement}>
                <Checkbox
                  className={classes.agreementCheckbox}
                  color="primary"
                  name="agreement"
                  style={{paddingLeft:'15px'}}
                />
                <Typography
                  color="textSecondary"
                  variant="body1"
                >
                  Are You Sure Approve Budget Request From This Branch ?
                </Typography>
              </div>
            </PerfectScrollbar>
          </CardContent>
        </DialogContent>
        <DialogActions>
          <Button 
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

      <Dialog onClose={handleClickClose} aria-labelledby="customized-dialog-title" open={open} maxWidth = 'lg' fullWidth>
        <DialogTitle id="customized-dialog-title" onClose={handleClickClose}>
        <IconButton onClick={handleBack}>
          <ArrowBackIcon />
        </IconButton>
          Reject Confirmation
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
              <TextField
                disabled
                className={classes.textField}
                fullWidth
                label="Requested Amount"
                name="requestedAmount"
                value={formState2.values.requestAmount = `${passingRequestAmt}` || `${passingRequestAmt}`}
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
                value={formState2.values.verificationCode || ''}
                onChange={handleChange2}
                type="password"
                variant="outlined"
              />
              <div className={classes.agreement}>
                <Checkbox
                  className={classes.agreementCheckbox}
                  color="primary"
                  name="agreement"
                  style={{paddingLeft:'15px'}}
                />
                <Typography
                  color="textSecondary"
                  variant="body1"
                >
                  Are You Sure To Reject Request From This Branch ?
                </Typography>
              </div>
            </PerfectScrollbar>
          </CardContent>
        </DialogContent>
        <DialogActions>
          <Button
          className={classes.deactivateButton}
          autoFocus onClick={handleRejectBudget}
          >
            Confirm Rejection
          </Button>
        </DialogActions>
      </Dialog>
    </Card>
  );
};

BudgetRequestTable.propTypes = {
  className: PropTypes.string
};

export default BudgetRequestTable;