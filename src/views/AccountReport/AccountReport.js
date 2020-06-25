import React, { useState } from 'react';
import { makeStyles } from '@material-ui/styles';

import { UsersReportTable, UsersReportToolbar } from './components';
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

const AccountReport = () => {
  const classes = useStyles();

  const [users] = useState(mockData);

  return (
    <div className={classes.root}>
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
    </div>
  );
};

export default AccountReport;
