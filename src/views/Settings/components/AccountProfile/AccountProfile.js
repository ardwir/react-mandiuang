import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import moment from 'moment';
import axios from 'axios';
import { makeStyles } from '@material-ui/styles';
import {
  Card,
  CardActions,
  CardContent,
  Avatar,
  Typography,
  Divider,
  Button,
  LinearProgress
} from '@material-ui/core';

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
  progress: {
    marginTop: theme.spacing(2)
  },
  uploadButton: {
    marginRight: theme.spacing(2)
  }
}));

const AccountProfile = props => {
  const { className, ...rest } = props;
  const [profiles, setProfiles] = ([])

  useEffect(() => {
    axios.get('http://192.168.0.24:8761/api/login-service/v1/user/admin', {
        headers: {
            'Authorization': 'Bearer eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiI0IiwiaWF0IjoxNTkyNzIzOTIxLCJleHAiOjE1OTMzMjg3MjF9.ph1ZZPN5uIuTeCyJl13K3s9pnUFpL5UiRitewKNa0AEmZCNVzRXw7sPIKchlJxnY8gC41CSewtLYKpNxe6ITqg'
        }
    })
        .then(res => {
            console.log(res)
            setProfiles(res.data)
        })
        .catch(err => {
            console.log(err)
        })
  })

  const classes = useStyles();

  const user = {
    name: 'Test Test',
    city: 'DKI Jakarta',
    country: 'Indonesia',
    timezone: 'GTM+7',
    avatar: '/images/avatars/Picture1.png'
  };

  return (
    <Card
      {...rest}
      className={clsx(classes.root, className)}
    >
      <CardContent>
        <div className={classes.details}>
          <div>
            <Typography
              gutterBottom
              variant="h2"
            >
              Pak Bos
            </Typography>
            <Typography
              className={classes.locationText}
              color="textSecondary"
              variant="body1"
            >
              {user.city}, {user.country}
            </Typography>
            <Typography
              className={classes.dateText}
              color="textSecondary"
              variant="body1"
            >
              {moment().format('hh:mm A')} ({user.timezone})
            </Typography>
          </div>
          <Avatar
            className={classes.avatar}
            src={user.avatar}
          />
        </div>
        <div className={classes.progress}>
          <Typography variant="body1">Profile Completeness: 100%</Typography>
          <LinearProgress
            value={100}
            variant="determinate"
          />
        </div>
      </CardContent>
      <Divider />
      <CardActions>
        <Button
          className={classes.uploadButton}
          color="primary"
          variant="text"
        >
          Upload picture
        </Button>
        <Button variant="text">Remove picture</Button>
      </CardActions>
    </Card>
  );
};

AccountProfile.propTypes = {
  className: PropTypes.string
};

export default AccountProfile;
