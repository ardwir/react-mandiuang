import React, { useState, useEffect } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import clsx from 'clsx';
import axios from 'axios';
import moment from 'moment';
import  { withRouter }  from 'react-router-dom';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/styles';
import { AppBar, Toolbar, Badge, Hidden, IconButton} from '@material-ui/core';
import MenuIcon from '@material-ui/icons/Menu';
import PerfectScrollbar from 'react-perfect-scrollbar';
import NotificationsIcon from '@material-ui/icons/NotificationsOutlined';
import MailIcon from '@material-ui/icons/EmailOutlined';
import InputIcon from '@material-ui/icons/Input';
import { API_BASE_URL } from '../../../../constants';
// import Popover from '@material-ui/core/Popover';
import { StatusBullet } from 'components';

import {
  Button,
  CardContent,
  CardActions, 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions,
  Typography,
  FormControl,
  InputLabel,
  Select,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TablePagination,
} from '@material-ui/core';

const useStyles = makeStyles(theme => ({
  root: {
    boxShadow: 'none'
  },
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
  flexGrow: {
    flexGrow: 1
  },
  signOutButton: {
    marginLeft: theme.spacing(1),
    color: '#FFFFFF'
  },
  cancelButton: { 
    backgroundColor: 'white', 
    color: 'red',
    fontSize: '60%'
  },
  statusContainer: {
    display: 'flex',
    alignItems: 'center'
  },
  status: {
    marginRight: theme.spacing(1)
  },
}));

const statusColors = {
  Success: 'success',
  Pending: 'info',
  Failed: 'danger'
};

const Topbar = props => {
  const { className, onSidebarOpen, history, ...rest } = props;

  const classes = useStyles();

  const [notifications] = useState([]);
  const [successMessage, setSuccessMessage] = useState({});
  const [failMessage, setFailMessage] = useState({});
  const [open, setOpen] = useState(false);
  const [openInbox, setOpenInbox] = useState(false);
  const [openUnauthorized, setOpenUnauthorized] = React.useState(false);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [page, setPage] = useState(0);
  const [dataLength, setDataLength] = useState(0);
  const [inboxLists, setInboxLists] = useState([]);
  const [refresher, setRefresher] = useState(0);
  const [refresher2, setRefresher2] = useState(0);
  const [inboxId, setInboxId] = useState();
  const [antiNyangkut, setAntiNyangkut] = useState(0);
  const [endSession, setEndSession] = React.useState(false);
  // const [timerCounter, setTimerCounter] = React.useState(60);
  const localData = JSON.parse(localStorage.getItem("data"));


  const handleSignOut = event => {
    axios.get(API_BASE_URL + '/login-service/v1/auth/logout', {
      headers: {
        'Authorization': `Bearer ${localData}` 
      }
    })
    .then(res => {
      console.log(res);
      console.log(res.data.message);
      setSuccessMessage(res.data.message);
      setOpen(true)
      if (res.data.message){
        localStorage.clear();
      }       
    })
    .catch(err => {
      console.log(err + localData);
      console.log(err.response.data.message);
    })  
  }

  const handleSignOutTimeOut = event => {
    axios.get(API_BASE_URL + '/login-service/v1/auth/logout', {
      headers: {
        'Authorization': `Bearer ${localData}` 
      }
    })
    .then(res => {
      console.log(res);
      console.log(res.data.message);
      // setSuccessMessage(res.data.message);
      setEndSession(true)
      if (res.data.message){
        localStorage.clear();
      }       
    })
    .catch(err => {
      console.log(err + localData);
      console.log(err.response.data.message);
    })  
  }
  
  const handleContinueToSignIn = event => {
    history.push('/sign-in');
  }

  // const [anchorEl, setAnchorEl] = React.useState(null);

  const handleOpenInbox = (event) => {
    axios({
      method: 'GET', 
      url: API_BASE_URL + '/mainbranch-service/v1/main/inboxList?page=' + page + '&rowsPerPage=' + rowsPerPage , 
      headers: {
        'Authorization': `Bearer ${localData}`,
        'Content-Type': 'application/json'
      }
    }).then(res =>{
      let statusCode = res.status
      if (statusCode === 200){
        setInboxLists(res.data.listInbox)
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
    })
    setOpenInbox(true);
  };

  useEffect(() => {
    axios({
      method: 'GET', 
      url: API_BASE_URL + '/mainbranch-service/v1/main/inboxList?page=' + page + '&rowsPerPage=' + rowsPerPage , 
      headers: {
        'Authorization': `Bearer ${localData}`,
        'Content-Type': 'application/json'
      }
    }).then(res =>{
      let statusCode = res.status
      if (statusCode === 200){
        setInboxLists(res.data.listInbox)
        setDataLength(res.data.dataCount)
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
    })
  }, [page, rowsPerPage, refresher])

  
  useEffect(()=>{
    const interval = setInterval(()=>{
      setRefresher(refresher => refresher + 1);
    }, 300000)
    return ()=> clearInterval(interval);  
  }, []);

  var counter = 0;
  useEffect(()=>{
    const interval = setInterval(()=>{
      setRefresher2(refresher2 => refresher2 + 1);
      counter = counter + 1;
      if (counter > 0){
        handleSignOutTimeOut();
        // localStorage.clear();
        // setEndSession(true);
      }  
    }, 3540000)   
    return ()=> clearInterval(interval);  
  }, []);

  // useEffect(()=>{
  //   handleSignOut();
  // },[refresher2]);
  
  const handleCloseInbox = () => {
    setOpenInbox(false);
  };

  const handleMarkAsRead = (idInbox) => {
    setInboxId(idInbox);
    console.log(inboxId);
    axios({
      method: 'GET', 
      url: API_BASE_URL + '/mainbranch-service/v1/main/deleteInbox/' + inboxId , 
      headers: {
        'Authorization': `Bearer ${localData}`,
        'Content-Type': 'application/json'
      }
    }).then(res =>{
      let statusCode = res.status
      if (statusCode === 200){
        setInboxLists(res.data.listInbox)
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
    })
  };

  const handlePageChange = (event, page) => {
    setPage(page);
  };

  const handleRowsPerPageChange = event => {
    setRowsPerPage(event.target.value);
    setPage(0);
    console.log(page, rowsPerPage)
  };

  // const opens = Boolean(anchorEl);
  // const id = opens ? 'simple-popover' : undefined;

  return (
    <AppBar
      {...rest}
      className={clsx(classes.root, className)}
    >
      <Toolbar>
        <Hidden lgUp>
          <IconButton
            color="inherit"
            onClick={onSidebarOpen}
          >
            <MenuIcon />
          </IconButton>
        </Hidden>
        <div>
          <RouterLink to="/dashboard">
            <img
              alt="Logo"
              // src="/images/logos/mandiuang-trans.png"
              src="/images/logos/logonew.png"
              width="50px"
            />
          </RouterLink>
        </div>
        <div className={classes.flexGrow} />
        <IconButton color="inherit">
          <Badge
            badgeContent={notifications.length}
            color="primary"
            variant="dot"
            onClick={handleOpenInbox}
            >
            <MailIcon />
          </Badge>
        </IconButton>
          <IconButton
              className={classes.signOutButton}
              color="inherit"
              onClick={handleSignOut}
              >
            <InputIcon />
          </IconButton>
      </Toolbar>
      
      <Dialog onClose={handleContinueToSignIn} aria-labelledby="customized-dialog-title" open={open}>
      <DialogTitle className={classes.dialogTitle} id="customized-dialog-title" onClose={handleContinueToSignIn}>
        <span style={{color: 'white'}}>See You Next Time!</span>
      </DialogTitle>
      <DialogContent align="center" dividers>
        <img
          alt="Logo"
          src="/images/logos/logoafteruats.png"
          style={{paddingLeft: '10%', paddingRight:'10%', width:'100%'}}
        />
        <br />
        <Typography
          color="textSecondary"
          variant="h4"
        >
          <br />
          {successMessage}
        </Typography>
        <Typography
          color="textSecondary"
          variant="body1"
        >
          You will be redirected to sign-in page!
        </Typography>
      </DialogContent>
      <DialogActions>
        <Button className={classes.updateButton} autoFocus onClick={handleContinueToSignIn} color="primary">
          Back To Sign-In Page
        </Button>
      </DialogActions>
    </Dialog>

      <Dialog onClose={handleContinueToSignIn} aria-labelledby="customized-dialog-title" open={open}>
      <DialogTitle className={classes.dialogTitle} id="customized-dialog-title" onClose={handleContinueToSignIn}>
        <span style={{color: 'white'}}>See You Next Time!</span>
      </DialogTitle>
      <DialogContent align="center" dividers>
        <img
          alt="Logo"
          src="/images/logos/logoafteruats.png"
          style={{paddingLeft: '10%', paddingRight:'10%', width:'100%'}}
        />
        <br />
        <Typography
          color="textSecondary"
          variant="h4"
        >
          <br />
          {successMessage}
        </Typography>
        <Typography
          color="textSecondary"
          variant="body1"
        >
          You will be redirected to sign-in page!
        </Typography>
      </DialogContent>
      <DialogActions>
        <Button className={classes.updateButton} autoFocus onClick={handleContinueToSignIn} color="primary">
          Back To Sign-In Page
        </Button>
      </DialogActions>
    </Dialog>

    <Dialog onClose={handleContinueToSignIn} aria-labelledby="customized-dialog-title" open={endSession}>
      <DialogTitle className={classes.dialogTitle} id="customized-dialog-title" onClose={handleContinueToSignIn}>
        <span style={{color: 'white'}}>Login Session Over!</span>
      </DialogTitle>
      <DialogContent align="center" dividers>
        <img
          alt="Logo"
          src="/images/logos/logoafteruats.png"
          style={{paddingLeft: '10%', paddingRight:'10%', width:'100%'}}
        />
        <br />
        <Typography
          color="textSecondary"
          variant="h4"
        >
          <br />
          Your Login Session Already Reached It's Limit
        </Typography>
        <Typography
          color="textSecondary"
          variant="body1"
        >
          You will be redirected to sign-in page!
        </Typography>
      </DialogContent>
      <DialogActions>
        <Button className={classes.updateButton} autoFocus onClick={handleContinueToSignIn} color="primary">
          Back To Sign-In Page
        </Button>
      </DialogActions>
    </Dialog>

    <Dialog onClose={handleCloseInbox} aria-labelledby="customized-dialog-title" open={openInbox} maxWidth = 'lg' fullWidth>
        <DialogTitle className={classes.dialogTitle} id="customized-dialog-title" onClose={handleCloseInbox}>
          <span style={{color: 'white'}}>Inbox</span>
        </DialogTitle>
        <DialogContent>
        <CardContent className={classes.content}>
              <PerfectScrollbar>
                <div className={classes.inner}>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Date</TableCell>
                        <TableCell>Title</TableCell>
                        <TableCell>Message</TableCell>
                        <TableCell>Status</TableCell>
                        <TableCell>Action</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {inboxLists.slice(0, rowsPerPage).map(inboxList => (
                        <TableRow
                          className={classes.tableRow}
                          hover
                          key={inboxList.inboxId}
                          // selected={selectedUsers.indexOf(inboxList.inboxId) !== -1}
                        >
                          <TableCell
                            hover
                          >
                            {moment(inboxList.inboxDate).format('DD/MM/YYYY, HH:mm')}
                          </TableCell>
                          <TableCell
                            hover
                          >
                            {inboxList.header}
                          </TableCell>
                          <TableCell
                            hover
                          >
                            {inboxList.messageDescription}
                          </TableCell>
                          {/* <TableCell
                            hover
                          >
                            {inboxList.statusDescription}
                          </TableCell> */}
                          <TableCell>
                            <div className={classes.statusContainer}>
                              <StatusBullet
                                className={classes.status}
                                color={statusColors[inboxList.statusDescription]}
                                size="sm"
                              />
                              {inboxList.statusDescription}
                            </div>
                          </TableCell>
                          <TableCell
                            hover
                          >
                            <Button
                              className={classes.cancelButton}
                              // variant="contained"
                              size="small"
                              onClick={()=>handleMarkAsRead(inboxList.inboxId)}
                            >
                              Mark As Read
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
          <Button autoFocus onClick={handleCloseInbox} color="primary">
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
    </AppBar>
  );
};

Topbar.propTypes = {
  className: PropTypes.string,
  onSidebarOpen: PropTypes.func,
  history: PropTypes.object
};

export default withRouter(Topbar);
