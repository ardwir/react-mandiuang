import React, { useState, useEffect } from 'react';
import clsx from 'clsx';
import axios from 'axios';
import PropTypes from 'prop-types';
import moment from 'moment';
import PerfectScrollbar from 'react-perfect-scrollbar';
import { makeStyles } from '@material-ui/styles';
import mockData2 from '../../data-user'
import UsersTableToolbar from './components/UsersTableToolbar'
import BranchProfile from './components/BranchProfile'
import { API_BASE_URL, API_BASE_UR } from '../../../../constants'
import CurrencyFormat from 'react-currency-format';
import  { withRouter }  from 'react-router-dom';
import { SearchInput } from 'components';
import { StatusBullet } from 'components';

import {
  Button, 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions,
  Card,
  CardActions,
  CardContent,
  Avatar,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
  TablePagination
} from '@material-ui/core';

import { getInitials } from 'helpers';

const useStyles = makeStyles(theme => ({
  root: {},
  dialogTitle: {
    backgroundColor: '#00A479',
    color: '#FFFFFF',
    fontWeight: 'bold',
    boxShadow: '1px 3px 1px'
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
  },
  addBranchButton: {
    width: '15%',
    marginTop: theme.spacing(2),
    marginLeft: theme.spacing(2),
    marginRight: theme.spacing(2),
    align: 'right'
  },
}));

const statusColors = {
  Active: 'success',
  Pending: 'info',
  Failed: 'danger'
};
const statusColors2 = {
  Success: 'success',
  Pending: 'info',
  Failed: 'danger'
};

const UsersReportTable = props => {
  
  const [users2] = useState(mockData2);
  const { className, users, history, ...rest } = props;

  const classes = useStyles();

  const [successMessage, setSuccessMessage] = useState([]);
  const [failMessage, setFailMessage] = useState({});
  const [openUnauthorized, setOpenUnauthorized] = React.useState(false);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [rowsPerPage2, setRowsPerPage2] = useState(10);
  const [page, setPage] = useState(0);
  const [page2, setPage2] = useState(0);
  const [openRow2, setOpenRow2] = React.useState(false);
  const [branchId, setBranchId] = useState(0);
  const [userBranchTrxs, setUserBranchTrxs] = useState([]);
  const [branchs, setBranchs] = useState([]);
  const [dataLength2, setDataLength2] = useState({});
  const [dataLength, setDataLength] = useState({});
  const localData = JSON.parse(localStorage.getItem("data"));
  
  // =================================================== List All Branch Search =================================================
  const [formState5, setFormState5] = useState({
    isValid: false,
    values: {accountName:''},
    touched: {},
    errors: {}
  });

  const handleChange5 = event => {
    event.persist();

    setFormState5(formState5 => ({
      ...formState5,
      values: {
        ...formState5.values,
        [event.target.name]:
          event.target.type === 'checkbox'
            ? event.target.checked
            : event.target.value
      },
      touched: {
        ...formState5.touched,
        [event.target.name]: true
      }
    }));

  };
  
  const handleSearch = () => {
    axios.get(API_BASE_URL + '/mainbranch-service/v1/branch/allBranchProfile?page=' + page + '&rowsPerPage=' + rowsPerPage + '&accountName=' + (formState5.values.accountName).replace(" ", "%20"), {
      headers: {
        'Authorization': `Bearer ${localData}` 
      }
  })
      .then(res => {
          console.log(res) 
          setBranchs(res.data.branchAccountList);
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
  // =================================================== List All Branch User Search =================================================
  const [formState6, setFormState6] = useState({
    isValid: false,
    values: {accountName:''},
    touched: {},
    errors: {}
  });

  const handleChange6 = event => {
    event.persist();

    setFormState6(formState6 => ({
      ...formState6,
      values: {
        ...formState6.values,
        [event.target.name]:
          event.target.type === 'checkbox'
            ? event.target.checked
            : event.target.value
      },
      touched: {
        ...formState6.touched,
        [event.target.name]: true
      }
    }));

  };
  
  const handleSearch2 = () => {
    console.log(formState6.values.accountName)
    axios.get(API_BASE_URL + '/trx-service/v1/transactionBranch/listBranchTrx/' + branchId + '?page=' + page2 + '&rowsPerPage=' + rowsPerPage2 + '&accountName=' + (formState6.values.accountName).replace(" ", "%20"), {
      headers: {
        'Authorization': `Bearer ${localData}` 
      }
  })
    .then(res => {
        console.log(res) 
        console.log(branchId);
        setUserBranchTrxs(res.data.listAllBranchTrx);
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
  // =================================================== List All Branch =================================================
  useEffect(() => {
    axios.get(API_BASE_URL + '/mainbranch-service/v1/branch/allBranchProfile?page=' + page + '&rowsPerPage=' + rowsPerPage + '&accountName=' + (formState5.values.accountName).replace(" ", "%20"), {
        headers: {
          'Authorization': `Bearer ${localData}` 
        }
    })
        .then(res => {
            console.log(res) 
            setBranchs(res.data.branchAccountList);
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
  }, [])

  useEffect(() => {
    axios.get(API_BASE_URL + '/trx-service/v1/transactionBranch/listBranchTrx/' + branchId + '?page=' + page2 + '&rowsPerPage=' + rowsPerPage2 + '&accountName=' + (formState6.values.accountName).replace(" ", "%20"),{
      headers: {
        'Authorization': `Bearer ${localData}` 
      }
  })
    .then(res => {
        console.log(res) 
        console.log(branchId);
        console.log(API_BASE_URL + '/trx-service/v1/transactionBranch/listBranchTrx/' + branchId + '?page=' + page2 + '&rowsPerPage=' + rowsPerPage2 + '&accountName=' + (formState6.values.accountName).replace(" ", "%20"))
        console.log(res.data.listAllBranchTrx)
        setUserBranchTrxs(res.data.listAllBranchTrx);
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
  }, [branchId, page2, rowsPerPage2])

  const handleContinueToSignIn = event => {
    history.push('/sign-in');
  }

  const handlePageChange = (event, page) => {
    setPage(page);
  };

  const handleRowsPerPageChange = event => {
    setRowsPerPage(event.target.value);
  };

  // =================================================== Branch Detail =================================================
  const handleRowClick2 = (branchId) => {
    setBranchId(branchId);
    axios.get(API_BASE_URL + '/trx-service/v1/transactionBranch/listBranchTrx/' + branchId + '?page=' + page2 + '&rowsPerPage=' + rowsPerPage2 + '&accountName=' + (formState6.values.accountName).replace(" ", "%20"), {
      headers: {
        'Authorization': `Bearer ${localData}` 
      }
  })
    .then(res => {
        console.log(res) 
        console.log(branchId);
        setUserBranchTrxs(res.data.listAllBranchTrx);
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
    setOpenRow2(true);
  };

  const handleRowClose2 = () => {
    setOpenRow2(false);
  };

  const handlePageChange2 = (event, page2) => {
    setPage2(page2);
  };

  const handleRowsPerPageChange2 = event => {
    setRowsPerPage2(event.target.value);
  };


// =========================================== Export ===================================================//
const FileSaver = require('file-saver');

const handleGenerateReport = (branchId) => {
  axios.get(API_BASE_URL + '/trx-service/v1/transactionBranch/downloadTrx/' + branchId, {
    responseType: 'arraybuffer',
    headers: {
      'Authorization': `Bearer ${localData}` 
    },
    responseType: 'blob'

})
    .then(res => {
        console.log(res.data)
        const blob = new Blob([res.data], {
          type: 'application/pdf',
        });
        FileSaver.saveAs(blob, "Branch_Trx_Report")
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
          // setFailMessage("Connection Error");
          localStorage.clear();
          // setOpenUnauthorized(true);       
        })
        .catch(err => {
          console.log(err + localData);
        })
      }
      else if (err.response.status === 401){
        // setFailMessage("Unauthorized Access");
        localStorage.clear();
        // setOpenUnauthorized(true);
      }
      else {
        console.log(err + localData)
      }
    })
}

  // =================================================== Rerserved =================================================

// =================================================== Render Side =================================================
  return (
    <Card
      {...rest}
      className={clsx(classes.root, className)}
    >
    {/* // =================================================== List All Branch ================================================= */}
      <CardContent className={classes.content}>
        <PerfectScrollbar>
          <div
            className={classes.row}
          >
              <SearchInput
                style={{float: 'left'}}
                className={classes.searchInput}
                placeholder="Search Branch Name"
                name="accountName"
                value={formState5.values.accountName}
                onChange={handleChange5}
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
          <div className={classes.inner}>
            <Table>
              <TableHead>
                <TableRow>
                  {/* <TableCell>Branch ID</TableCell> */}
                  <TableCell>Account Number</TableCell>
                  <TableCell>Branch Name</TableCell>
                  <TableCell>Balance</TableCell>
                  <TableCell>Location</TableCell>
                  <TableCell>Status</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {branchs.slice(0, rowsPerPage).map(branch => (
                  <TableRow
                    className={classes.tableRow}
                    hover
                    key={branch.branchAccountId}
                    onClick={()=>handleRowClick2(branch.branchAccountId)}
                  >
                    {/* <TableCell>{branch.branchAccountId}</TableCell> */}
                    <TableCell>{branch.accountNo}</TableCell>
                    <TableCell>{branch.branchName}</TableCell>
                    <TableCell>{<CurrencyFormat value={branch.branchBalance} displayType={'text'} thousandSeparator={true} prefix={'Rp.'} />}</TableCell>    
                    <TableCell>
                      {branch.location}
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

      {/* // =================================================== Branch Detail ================================================= */}
      <Dialog onClose={handleRowClose2} aria-labelledby="customized-dialog-title" open={openRow2} maxWidth = 'lg' fullWidth>
        <DialogTitle className={classes.dialogTitle} id="customized-dialog-title" onClose={handleRowClose2}>
          <span style={{color: 'white'}}>Branch Transaction Report</span>
        </DialogTitle>
        <DialogContent dividers>
          <CardContent className={classes.content}>
            <PerfectScrollbar>
          <div className={classes.inner}>
            <BranchProfile branchId={branchId}/>
          </div>
          {/* <div className={classes.inner}>
            <UsersTableToolbar/>
          </div> */}
          <div
            className={classes.row}
          >
              <SearchInput
                style={{float: 'left'}}
                className={classes.searchInput}
                placeholder="Search Username"
                name="accountName"
                value={formState6.values.accountName}
                onChange={handleChange6}
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
                className={classes.addBranchButton}
                color="primary"
                variant="contained"
                onClick={()=>handleGenerateReport(branchId)}
              >
              Generate Report
              </Button>        
          </div>
          <br />
          <div className={classes.inner}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Transaction ID</TableCell>
                  <TableCell>Username</TableCell>
                  <TableCell>Destination Number</TableCell>
                  <TableCell>Destination Name</TableCell>
                  <TableCell>Transaction Date</TableCell>
                  <TableCell>Transaction Amount</TableCell>
                  <TableCell>Transaction Type</TableCell>
                  <TableCell>Transaction Status</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {userBranchTrxs.slice(0, rowsPerPage2).map(userBranchTrx => (
                  <TableRow
                    className={classes.tableRow}
                    hover
                    // key={userBranchTrx.branchToOtherTrxId}
                    // onClick={()=>handleRowClick2(userBranchTrx.trxBranchId)}
                  >
                    <TableCell>{userBranchTrx.branchToOtherTrxId}</TableCell>
                    <TableCell>{userBranchTrx.trxByUser}</TableCell>
                    <TableCell>{userBranchTrx.receiverAccountNo}</TableCell>
                    <TableCell>{userBranchTrx.receiverAccountName}</TableCell>
                    <TableCell>
                      {moment(userBranchTrx.trxDate).format('DD/MM/YYYY, HH:mm')}
                    </TableCell>
                    <TableCell>{<CurrencyFormat value={userBranchTrx.trxAmount} displayType={'text'} thousandSeparator={true} prefix={'Rp.'} />}</TableCell>
                    <TableCell>{userBranchTrx.trxType}</TableCell>
                    <TableCell>
                      <div className={classes.statusContainer}>
                        <StatusBullet
                          className={classes.status}
                          color={statusColors2[userBranchTrx.status]}
                          size="sm"
                        />
                        {userBranchTrx.status}
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
          <Button autoFocus onClick={handleRowClose2} color="primary">
            Close
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

UsersReportTable.propTypes = {
  className: PropTypes.string,
  users: PropTypes.array.isRequired,
  history: PropTypes.object
};

export default withRouter(UsersReportTable);