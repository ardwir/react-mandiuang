import React, { useState, useEffect } from 'react';
import clsx from 'clsx';
import moment from 'moment';
import axios from 'axios';
import PropTypes from 'prop-types';
import { API_BASE_URL } from '../../../../constants'
import { makeStyles } from '@material-ui/styles';
import {
  Card,
  CardContent,
  Divider,
  Grid,
  TextField,
  Avatar,
  Typography,
} from '@material-ui/core';

const useStyles = makeStyles(() => ({
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
  }
}));

const AccountDetails = props => {
  
  const { className, ...rest } = props;
  const [ userProfile, setUserProfile ] = useState({});
  const [ mainProfile, setMainProfile ] = useState({});
  const localData = JSON.parse(localStorage.getItem("data"));
  const user = {
    timezone: 'GMT+7',
    avatar: '/images/avatars/Picture1.png'
  };
  
  useEffect(() => {
    axios.get(API_BASE_URL + '/login-service/v1/user/admin', {
        headers: {
          'Authorization': `Bearer ${localData.accessToken}` 
        }
    })
        .then(res => {
            console.log(res) 
            setUserProfile(res.data);
        })
        .catch(err => {
            console.log(err + localData.accessToken)
        })
  }, [userProfile.id])
 
  useEffect(() => {
    axios.get(API_BASE_URL + '/mainbranch-service/v1/main/mainProfile', {
        headers: {
          'Authorization': `Bearer ${localData.accessToken}` 
        }
    })
        .then(res => {
            console.log(res) 
            setMainProfile(res.data);
        })
        .catch(err => {
            console.log(err)
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
              {mainProfile.mainAccountName}
            </Typography>
            <Typography
              gutterBottom
              color='textSecondray'
              variant='h4'
            >
              {mainProfile.mainAccountNo}
            </Typography>
            <Typography
              className={classes.locationText}
              color='textSecondary'
              variant='body1'
            >
              {mainProfile.cityName}, {mainProfile.address}
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
            src={user.avatar}
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
    </Card>
  );
};

AccountDetails.propTypes = {
  className: PropTypes.string
};

export default AccountDetails;
