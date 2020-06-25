import React, { } from 'react';
import { makeStyles } from '@material-ui/styles';
import { BudgetRequestToolbar, BudgetRequestTable } from './components';
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

const BudgetRequest = () => {
  const classes = useStyles();

  return (
    <div className={classes.root}>
        <Typography
            gutterBottom
            variant="h2"
        >
        Budget Request Approval
        </Typography>
        <br />
        <BudgetRequestToolbar />
      <div className={classes.content}>
        <BudgetRequestTable />
      </div>
    </div>
  );
};

export default BudgetRequest;
