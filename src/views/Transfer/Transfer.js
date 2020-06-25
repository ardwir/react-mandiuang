import React, { useState } from 'react';
import { makeStyles } from '@material-ui/styles';
import { UsersTable, UsersToolbar } from './components';
import mockData from './data';
import {
    Typography,
  } from '@material-ui/core';

const useStyles = makeStyles(theme => ({
  root: {
    padding: theme.spacing(3)
  },
  content: {
    marginTop: theme.spacing(2)
  }
}));

const Transfer = () => {
  const classes = useStyles();

  const [users] = useState(mockData);

  return (
    <div className={classes.root}>
        <Typography
            gutterBottom
            variant="h2"
        >
        Transfer Budget To Branch
        </Typography>
        <br />
        <UsersToolbar />
      <div className={classes.content}>
        <UsersTable users={users} />
      </div>
    </div>
  );
};

export default Transfer;
