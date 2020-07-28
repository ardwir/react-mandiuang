import React, { useRef, useState } from 'react';
import { makeStyles } from '@material-ui/styles';
import { UsersReportTable, UsersReportToolbar } from './components';
import mockData from './data';
import IdleTimer from 'react-idle-timer';
import  { withRouter }  from 'react-router-dom';
import PropTypes from 'prop-types';
import axios from 'axios';
import { API_BASE_URL } from '../../constants'
import {
  Button, 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions,
  Typography
} from '@material-ui/core';

const useStyles = makeStyles(theme => ({
  root: {
    padding: theme.spacing(3)
  },
  content: {
    marginTop: theme.spacing(2)
  },
  dialogTitle: {
    backgroundColor: '#00A479',
    color: '#FFFFFF',
    fontWeight: 'bold',
    boxShadow: '1px 3px 1px'
  }
}));

const AccountReport = props => {
  const classes = useStyles();
  const { history, ...rest } = props;
  const idleTimerRef = useRef(null);

  const [successMessage, setSuccessMessage] = useState({});
  const [openLogout, setOpenLogout] = useState(false);
  const localData = JSON.parse(localStorage.getItem("data"));
  
  const handleSignOut = event => {
    // alert("it's here")
    axios.get(API_BASE_URL + '/login-service/v1/auth/logout', {
      headers: {
        'Authorization': `Bearer ${localData}` 
      }
    })
    .then(res => {
      console.log(res);
      console.log(res.data.message);
      setSuccessMessage(res.data.message);
      setOpenLogout(true)
      // alert(res.data.message)
      if (res.data.message){
        localStorage.clear();
      }       
    })
    .catch(err => {
      console.log(err + localData);
    })  
  }

  const handleContinueToSignIn = event => {
    history.push('/sign-in');
  }
  const [users] = useState(mockData);

  return (
    <div className={classes.root}>
    <IdleTimer ref={idleTimerRef} timeout={900 * 1000} onIdle={handleSignOut}></IdleTimer>
      <Typography
        gutterBottom
        variant="h2"
      >
        Branch Account Report
      </Typography>
      <br />
      <UsersReportToolbar />
      <div className={classes.content}>
        <UsersReportTable users={users} />
      </div>
      <Dialog onClose={handleContinueToSignIn} aria-labelledby="customized-dialog-title" open={openLogout}>
        <DialogTitle className={classes.dialogTitle} id="customized-dialog-title" onClose={handleContinueToSignIn}>
          <span style={{color: 'white'}}>Session Timeout!</span>
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
            You Have Been Idling Too Long,
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
    </div>
  );
};

AccountReport.propTypes = {
  history: PropTypes.object
};

export default withRouter(AccountReport);
