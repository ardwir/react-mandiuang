import React, { useState, useEffect } from 'react';
import clsx from 'clsx';
import moment from 'moment';
import axios from 'axios';
import PropTypes from 'prop-types';
import { API_BASE_URL, API_BASE_UR } from '../../../../constants'
import { makeStyles } from '@material-ui/styles';
import  { withRouter }  from 'react-router-dom';
import {
  Button,
  Card,
  CardContent,
  Divider,
  Dialog,
  DialogActions,
  DialogTitle,
  DialogContent,
  Grid,
  TextField,
  Avatar,
  Typography,
} from '@material-ui/core';
import Skeleton from '@material-ui/lab/Skeleton';

const useStyles = makeStyles(theme => ({
  root: {},
  details: {
    display: 'flex'
  },
  avatar: {
    marginLeft: 'auto',
    height: 110,
    width: 100,
    flexShrink: 0,
    flexGrow: 0
  },
  dialogTitleFail: {
    backgroundColor: '#F14D4D',
    color: '#FFFFFF',
    fontWeight: 'bold',
    boxShadow: '1px 3px 1px'
  },
  confirmDeactivateButton: {
    marginRight: theme.spacing(1), 
    backgroundColor: 'white', 
    color: 'red',
    fontSize: '80%'
  }
}));

const AccountDetails = props => {
  
  const { className, history, ...rest } = props;
  const [ userProfile, setUserProfile ] = useState({});
  const [ mainProfile, setMainProfile ] = useState({});
  const [successMessage, setSuccessMessage] = useState([]);
  const [failMessage, setFailMessage] = useState({});
  const [openUnauthorized, setOpenUnauthorized] = React.useState(false);
  const localData = JSON.parse(localStorage.getItem("data"));
  const user = {
    timezone: 'GMT+7',
    avatar: '/images/avatars/Picture1.png'
  };
  
  useEffect(() => {
    axios.get(API_BASE_URL + '/login-service/v1/user/admin', {
        headers: {
          'Authorization': `Bearer ${localData}` 
        }
    })
        .then(res => {
            console.log(res) 
            setUserProfile(res.data);
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
  }, [userProfile.id])
  
  const handleContinueToSignIn = event => {
    history.push('/sign-in');
  }

  useEffect(() => {
    axios.get(API_BASE_URL + '/mainbranch-service/v1/main/mainProfile', {
        headers: {
          'Authorization': `Bearer ${localData}` 
        }
    })
        .then(res => {
            console.log(res) 
            setMainProfile(res.data);
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
            console.log(err)
          }
        })
  }, [mainProfile.id])
    
  const classes = useStyles();

  return (
    <Card
      {...rest}
      className={clsx(classes.root, className)}
    >
      <form
        autoComplete="off"
        noValidate
      >
        <CardContent>
        <div className={classes.details}>
          <div>
            <Typography
              gutterBottom
              variant="h2"
            >
              {mainProfile.mainAccountName || <Skeleton width={150} animation='wave'/>}
            </Typography>
            <Typography
              gutterBottom
              color='textSecondray'
              variant='h4'
            >
              {mainProfile.mainAccountNo || <Skeleton width={150} animation='wave'/>}
            </Typography>
            <Typography
              className={classes.locationText}
              color='textSecondary'
              variant='body1'
            >
              {mainProfile.cityName || <Skeleton width={150} animation='wave'/>}, {mainProfile.address || <Skeleton width={150} animation='wave'/>}
            </Typography>
            <Typography
              className={classes.dateText}
              color='textSecondary'
              variant='body1'
            >
              {moment().format('hh:mm A')} ({user.timezone})
            </Typography>
          </div>
          <Avatar
            className={classes.avatar}
            src={user.avatar || <Skeleton width={150} animation='wave'/>}
          />
        </div>
        <Divider />
        <br />
          <Grid
            container
            spacing={2}
          >
            <Grid
              item
              md={6}
              xs={12}
            > 
              <TextField
                fullWidth
                disabled = "true"
                label="Username"
                margin="dense"
                name="username"
                defaultValue="."
                value={userProfile.username}
                // value="TestAccount"
                variant="outlined"
              />
            </Grid>
            <Grid
              item
              md={6}
              xs={12}
            >
              <TextField
                fullWidth
                disabled = "true"
                label="Name"
                margin="dense"
                name="name"
                defaultValue="."
                value={userProfile.name}
                // value="Test Test"
                variant="outlined"
              />
            </Grid>
            <Grid
              item
              md={6}
              xs={12}
            >
              <TextField
                fullWidth
                disabled = "true"
                label="Email Address"
                margin="dense"
                name="email"
                defaultValue="."
                value={userProfile.email}
                // value="test@mandiuang.com"
                variant="outlined"
              />
            </Grid>
            <Grid
              item
              md={6}
              xs={12}
            >
              <TextField
                fullWidth
                disabled = "true"
                label="Phone Number"
                margin="dense"
                name="phone"
                type="text"
                defaultValue="."
                value={userProfile.phoneNumber}
                // value="0812345678901"
                variant="outlined"
              />
            </Grid>
            <Grid
              item
              md={6}
              xs={12}
            >
              <TextField
                fullWidth
                disabled = "true"
                label="Main Account ID"
                margin="dense"
                name="mainAccountId"
                type="text"
                defaultValue="."
                value={userProfile.mainIdWork}
                // value="1"
                variant="outlined"
              />
            </Grid>
            <Grid
              item
              md={6}
              xs={12}
            >
              <TextField
                fullWidth
                disabled = "true"
                label="Job Position"
                margin="dense"
                name="jobPosition"
                type="text"
                defaultValue="."
                value={userProfile.jobPosition}
                // value="General Manager"
                variant="outlined"
              />
            </Grid>
          </Grid>
        </CardContent>
      </form>
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

AccountDetails.propTypes = {
  className: PropTypes.string,
  history: PropTypes.object
};

export default withRouter(AccountDetails);
