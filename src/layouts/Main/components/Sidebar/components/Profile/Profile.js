import React, { useState, useEffect }from 'react';
import { Link as RouterLink } from 'react-router-dom';
import clsx from 'clsx';
import axios from 'axios';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/styles';
import { Avatar, Typography } from '@material-ui/core';
import { API_BASE_URL } from '../../../../../../constants'

const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    minHeight: 'fit-content'
  },
  avatar: {
    width: 60,
    height: 60
  },
  name: {
    marginTop: theme.spacing(1)
  }
}));

const Profile = props => {
  const { className, ...rest } = props;
  const [ userProfile, setUserProfile ] = useState({});
  const localData = JSON.parse(localStorage.getItem("data"));

  useEffect(() => {
    axios.get(API_BASE_URL + '/v1/user/admin', {
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
  
  const classes = useStyles();

  const user = {
    avatar: '/images/avatars/Picture1.png',
  };

  return (
    <div
      {...rest}
      className={clsx(classes.root, className)}
    >
      <Avatar
        alt="Person"
        className={classes.avatar}
        component={RouterLink}
        src={user.avatar}
        to="/settings"
      />
      <Typography
        className={classes.name}
        variant="h4"
      >
        {userProfile.name}
      </Typography>
      <Typography variant="body2">
        {userProfile.jobPosition}
      </Typography>
    </div>
  );
};

Profile.propTypes = {
  className: PropTypes.string
};

export default Profile;