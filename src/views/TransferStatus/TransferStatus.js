import React, { useState } from 'react';
import { makeStyles } from '@material-ui/styles';

import { UsersToolbar, TransferTable } from './components';
import mockData from './data';
import { Typography } from '@material-ui/core';

const useStyles = makeStyles(theme => ({
  root: {
    padding: theme.spacing(3)
  },
  content: {
    marginTop: theme.spacing(2)
  }
}));

const TransferStatus = () => {
  const classes = useStyles();

  const [users] = useState(mockData);

  return (
    <div className={classes.root}>
      <Typography
        gutterBottom
        variant="h2"
      >
        Transfer Status
      </Typography>
      <br />
      <UsersToolbar />
      <div className={classes.content}>
        <TransferTable users={users} />
      </div>
    </div>
  );
};

export default TransferStatus;