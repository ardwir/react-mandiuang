import React, { useState, useEffect } from 'react';
import clsx from 'clsx';
import axios from 'axios';
import { API_BASE_URL, API_BASE_UR } from '../../../../constants'
import PropTypes from 'prop-types';
import moment from 'moment';
import PerfectScrollbar from 'react-perfect-scrollbar';
import { makeStyles } from '@material-ui/styles';
import CurrencyFormat from 'react-currency-format';
import CurrencyTextField from '@unicef/material-ui-currency-textfield';
import Skeleton from '@material-ui/lab/Skeleton';
import FilterList from '@material-ui/icons/FilterList';
import  { withRouter }  from 'react-router-dom';
import { SearchInput } from 'components';
import {
  Button,
  Card,
  CardHeader,
  CardActions,
  CardContent,
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
import { StatusBullet } from 'components';

import mockData from './data';
import TransferDetail from './components/TransferDetail'

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
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1)
  },
  textField: {
    marginTop: theme.spacing(2)
  },
  dialogTitle:{
    backgroundColor: '#00A479'
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
    minWidth: 500
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
  dialogTitleFail: {
    backgroundColor: '#F14D4D',
    color: '#FFFFFF',
    fontWeight: 'bold',
    boxShadow: '1px 3px 1px'
  },
  filterList: {
    width: '5%',
    marginTop: theme.spacing(2),
    marginLeft: theme.spacing(2),
    marginRight: theme.spacing(2),
    align: 'right'
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
  }
}));

const statusColors = {
  Success: 'success',
  Pending: 'info',
  Failed: 'danger'
};

const UsersTable = props => {
  const { className, users, history, ...rest } = props;

  const classes = useStyles();
  
  const [mainTrxLists, setMainTrxLists] = useState([]);
  const [transcationProfile, setTranscationProfile] = useState({});
  const [trxId, setTrxId] = useState();
  const [branchId, setBranchId] = useState();
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [page, setPage] = useState(0);
  const [openRow, setOpenRow] = React.useState(false);
  const [open, setOpen] = React.useState(false);
  const [successMessage, setSuccessMessage] = useState([]);
  const [failMessage, setFailMessage] = useState({});
  const [openUnauthorized, setOpenUnauthorized] = React.useState(false);
  const [dataLength, setDataLength] = useState({});
  const [searchName, setSearchName] = useState({});
  const [openFilter, setOpenFilter] = React.useState(false);
  const localData = JSON.parse(localStorage.getItem("data"));

  const [formState, setFormState] = useState({
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
  useEffect(() => {
    if (formState.values.dateEnd != '' && formState.values.dateStart != ''){
      formState.values.dateEnd = moment(formState.values.dateEnd).format('MM/DD/yyyy');
      formState.values.dateStart = moment(formState.values.dateStart).format('MM/DD/yyyy');
    }
    axios.get(API_BASE_URL + '/trx-service/v1/transactionMain/listAllMainTrx?page='  + page + '&rowsPerPage=' + rowsPerPage
                + '&accountName=' + formState.values.trxDestName + '&trxAmount=' + formState.values.trxAmountF + '&dateStart=' + formState.values.dateStart +
                  '&dateEnd=' + formState.values.dateEnd + '&amountSign=' + formState.values.amountSign + '&status=' + formState.values.transferStatus, {
        headers: {
          'Authorization': `Bearer ${localData}` 
        }
    })
        .then(res => {
            console.log(res) 
            setMainTrxLists(res.data.mainToBranchTrxList);
            setDataLength(res.data.dataCount)
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
  
  const handleSearch = () => {
    // setSearchName((formState.values.trxDestName).replace(" ", "%20"))   
    if (formState.values.dateEnd != '' && formState.values.dateStart != ''){
      formState.values.dateEnd = moment(formState.values.dateEnd).format('MM/DD/yyyy');
      formState.values.dateStart = moment(formState.values.dateStart).format('MM/DD/yyyy');
    }
    axios({
      method: 'GET', 
      url: API_BASE_URL + '/trx-service/v1/transactionMain/listAllMainTrx?page='  + page + '&rowsPerPage=' + rowsPerPage
            + '&accountName=' + (formState.values.trxDestName).replace(" ", "%20") + '&trxAmount=' + formState.values.trxAmountF + '&dateStart=' + formState.values.dateStart +
              '&dateEnd=' + formState.values.dateEnd + '&amountSign=' + formState.values.amountSign + '&status=' + formState.values.transferStatus, 
      // url: API_BASE_URL + '/trx-service/v1/scheduleMain/listAllMainSchedule?page=' + page + '&rowsPerPage=' + rowsPerPage , 
      headers: {
        'Authorization': `Bearer ${localData}`,
        'Content-Type': 'application/json'
      }
    }).then(res =>{
      let statusCode = res.status
      if (statusCode === 200){
        setMainTrxLists(res.data.mainToBranchTrxList)
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

  const handleRowClick = (mainAcctTrxId) => {
    axios.get(API_BASE_URL + `/trx-service/v1/transactionMain/searchMainTrx/${mainAcctTrxId}` , {
      headers: {
        'Authorization': `Bearer ${localData}` 
      }
    })
      .then(res => {
          console.log(res) 
          setTranscationProfile(res.data);
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
    setOpenRow(true);
  };

  const handleRowClose = () =>{
    setOpenRow(false);
  };

  const handlePageChange = (event, page) => {
    setPage(page);
  };

  const handleRowsPerPageChange = event => {
    setRowsPerPage(event.target.value);
    setPage(0);
    console.log(page, rowsPerPage)
  };

  const handleOpenFilter = () => {
    setOpenFilter(true);
  }

  const handleCloseFilter = () => {
    setOpenFilter(false);
  }

  const handleApplyFilter = () => {   
    if (formState.values.dateEnd != '' && formState.values.dateStart != ''){
      formState.values.dateEnd = moment(formState.values.dateEnd).format('MM/DD/yyyy');
      formState.values.dateStart = moment(formState.values.dateStart).format('MM/DD/yyyy');
    }
    axios({
      method: 'GET', 
      url: API_BASE_URL + '/trx-service/v1/transactionMain/listAllMainTrx?page='  + page + '&rowsPerPage=' + rowsPerPage
            + '&accountName=' + formState.values.trxDestName + '&trxAmount=' + formState.values.trxAmountF + '&dateStart=' + formState.values.dateStart +
              '&dateEnd=' + formState.values.dateEnd + '&amountSign=' + formState.values.amountSign + '&status=' + formState.values.transferStatus, 
      // url: API_BASE_URL + '/trx-service/v1/scheduleMain/listAllMainSchedule?page=' + page + '&rowsPerPage=' + rowsPerPage , 
      headers: {
        'Authorization': `Bearer ${localData}`,
        'Content-Type': 'application/json'
      }
    }).then(res =>{
      console.log(page, rowsPerPage)
      let statusCode = res.status
      if (statusCode === 200){
        setMainTrxLists(res.data.mainToBranchTrxList)
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
    formState.values.dateStart = '';
    formState.values.dateEnd = '';
    formState.values.amountSign= '';
    formState.values.transferStatus= '';
    
    axios({
      method: 'GET', 
      url: API_BASE_URL + '/trx-service/v1/transactionMain/listAllMainTrx?page=' + page + '&rowsPerPage=' + rowsPerPage + '&dateStart=' + formState.values.dateStart +
            '&dateEnd=' + formState.values.dateEnd, 
      headers: {
        'Authorization': `Bearer ${localData}`,
        'Content-Type': 'application/json'
      }
    }).then(res =>{
      console.log(page, rowsPerPage)
      let statusCode = res.status
      if (statusCode === 200){
        setMainTrxLists(res.data.mainToBranchTrxList)
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
                placeholder="Search Destination Account Name"
                name="trxDestName"
                value={formState.values.trxDestName}
                onChange={handleChange}
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
              onClick={handleOpenFilter}
            >
              <FilterList />
            </Button>
          </div>
          <br />
        <PerfectScrollbar>
          <div className={classes.content}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Ref Number</TableCell>
                  {/* <TableCell>Origin</TableCell> */}
                  <TableCell>Destination Number</TableCell>
                  <TableCell>Destination Name</TableCell>
                  <TableCell>Transfer Type</TableCell>
                  <TableCell>Amount</TableCell>
                  <TableCell sortDirection="desc">
                    <Tooltip
                      enterDelay={300}
                      title="Sort"
                    >
                      <TableSortLabel
                        active
                        direction="desc"
                      >
                        Transfer Date
                      </TableSortLabel>
                    </Tooltip>
                  </TableCell>
                  <TableCell>Status</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
              {mainTrxLists.slice(0, rowsPerPage).map(mainTrxList => (
                  <TableRow
                    hover
                    key={mainTrxList.mainToBranchTrxId}
                    onClick={()=>handleRowClick(mainTrxList.mainToBranchTrxId)}
                  >
                    <TableCell>{moment(mainTrxList.trxDate).format('MM')}/{mainTrxList.branchAccountNo}/{mainTrxList.mainToBranchTrxId ||<Skeleton width={150} animation='wave'/>}</TableCell>
                    {/* <TableCell>Chandra Wijaya</TableCell> */}
                    <TableCell>{mainTrxList.branchAccountNo ||<Skeleton width={150} animation='wave'/>}</TableCell>
                    <TableCell>{mainTrxList.branchAccountName ||<Skeleton width={150} animation='wave'/>}</TableCell>
                    <TableCell>{mainTrxList.transferType || <Skeleton width={150} animation='wave'/>}</TableCell>
                    <TableCell>{<CurrencyFormat value={mainTrxList.trxAmount} displayType={'text'} thousandSeparator={true} prefix={'Rp.'} /> || <Skeleton width={150} animation='wave'/>}</TableCell>
                    {/* <TableCell>{mainTrxList.trxAmount}</TableCell> */}
                    <TableCell>
                      {moment(mainTrxList.trxDate || <Skeleton width={150} animation='wave'/>).format('DD/MM/YYYY, HH:mm')}
                    </TableCell>
                    <TableCell>
                      <div className={classes.statusContainer}>
                        <StatusBullet
                          className={classes.status}
                          color={statusColors[mainTrxList.status]}
                          size="sm"
                        />
                        {mainTrxList.status}
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

      <Dialog onClose={handleRowClose} aria-labelledby="costumized-dialog-title" open={openRow} maxWitdh='lg' fullWidth>
        <DialogTitle
          className ={classes.dialogTitle}
          id="costumized-dialog-title"
          onClose={handleRowClose}
        >
          <span style={{color: 'white'}}>Transfer Detail</span>
        </DialogTitle>
        <DialogContent dividers>
          <CardContent className={classes.content}>
            <PerfectScrollbar>
              {/* <div className={classes.inner}>
                <TransferDetail branchId={branchId} />
              </div> */}
              <TextField
                disabled
                className={classes.textField}
                fullWidth
                label="Transfer ID"
                name="transferId"
                type="text"
                variant="outlined"
                value={transcationProfile.mainToBranchTrxId || ''}
              />
              <TextField
                disabled
                className={classes.textField}
                fullWidth
                label="Transfered By"
                name="transferBy"
                type="text"
                variant="outlined"
                value={transcationProfile.trxByUser || ''}
              />
              <TextField
                disabled
                className={classes.textField}
                fullWidth
                label="transfer Origin"
                name="nameOrigin"
                type="text"
                variant="outlined"
                value={transcationProfile.mainAccountName || ''} 
              />
              <TextField
                disabled
                className={classes.textField}
                fullWidth
                label="Transfer Destination Name"
                name="destinationName"
                type="text"
                variant="outlined"
                value={transcationProfile.branchAccountName || ''}
              />
              <TextField
                disabled
                className={classes.textField}
                fullWidth
                label="transfer Destination Number"
                name="destinationNo"
                type="text"
                variant="outlined"
                value={transcationProfile.transferToAcct || ''} 
              />
              {/* <TextField
                disabled
                className={classes.textField}
                fullWidth
                label="Amount"
                name="amount"
                type="text"
                variant="outlined"
                value={transcationProfile.trxAmount || ''}
              /> */}
              <CurrencyTextField
                disabled
                className={classes.textField}
                fullWidth
                variant="outlined"
                textAlign="left"
                label="Amount"
                name="amount"
                value={transcationProfile.trxAmount}
                currencySymbol="Rp."
                outputFormat="number"
              />
              <TextField
                disabled
                className={classes.textField}
                fullWidth
                label="TransferType"
                name="type"
                type="text"
                variant="outlined"
                value={transcationProfile.transferType || ''}
              />
              <TextField
                disabled
                className={classes.textField}
                fullWidth
                label="Date"
                name="date"
                type="text"
                variant="outlined"
                value={moment(transcationProfile.trxDate).format('DD/MM/YYYY, HH:mm') || ''}
              />
              <TextField
                disabled
                className={classes.textField}
                fullWidth
                label="Remark"
                name="remark"
                type="text"
                variant="outlined"
                value={transcationProfile.remarks || ''}
              />
              <TextField
                disabled
                className={classes.textField}
                fullWidth
                label="Status"
                name="status"
                type="text"
                variant="outlined"
                value={transcationProfile.status || ''}
              />
            </PerfectScrollbar>
          </CardContent>
        </DialogContent>
        <DialogActions>
          <Button 
            className={classes.approveButton}
            autoFocus onClick={handleRowClose} color="primary"
          >
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
            {/* <TextField
              className={classes.textField}
              fullWidth
              label="Transaction By"
              name="trxByUserF"
              value={formState.values.trxByUserF || ''}
              onChange={handleChange}
              type="text"
              variant="outlined"
            /> */}
            {/* <TextField
              className={classes.textField}
              fullWidth
              label="Transaction Amount"
              name="trxAmountF"
              value={formState.values.trxAmountF || ''}
              onChange={handleChange}
              type="number"
              variant="outlined"
            /> */}
            <CurrencyTextField
              className={classes.textField}
              label="Transaction Amount"
              value={formState.values.trxAmountF || ''}
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
                    ['trxAmountF']:value
                  }
                })
              }}
            />
            <TextField
              className={classes.textField}
              fullWidth
              name="dateStart"
              value={formState.values.dateStart || ''}
              onChange={handleChange}
              type="date"
              variant="outlined"
            />
            <FormHelperText>Select Start Date  </FormHelperText>
            <TextField
              className={classes.textField}
              fullWidth
              name="dateEnd"
              value={formState.values.dateEnd || ''}
              onChange={handleChange}
              type="date"
              variant="outlined"
            />
            <FormHelperText>Select End Date  </FormHelperText>
            <FormControl className={classes.textField} style={{paddingRight:"25px"}}>
              <InputLabel>Amount Option</InputLabel>
              <Select
                name="amountSign"
                value={formState.values.amountSign}
                onChange={handleChange}
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
                name="transferStatus"
                value={formState.values.transferStatus}
                onChange={handleChange}
              >
                <MenuItem value="">
                  <em>None</em>
                </MenuItem>
                <MenuItem value={"Success"}>Success</MenuItem>
                <MenuItem value={"Failed"}>Failed</MenuItem>
              </Select>
              <FormHelperText>Transfer Status Options.</FormHelperText>
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
  )

};

UsersTable.propTypes = {
  className: PropTypes.string,
  users: PropTypes.array.isRequired,
  history: PropTypes.object
};

export default withRouter(UsersTable);
