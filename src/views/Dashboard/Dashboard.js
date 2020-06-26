import React from 'react';
import { makeStyles } from '@material-ui/styles';
import { Grid } from '@material-ui/core';

import {
  Budget,
  TotalUsers,
  TasksProgress,
  TotalProfit,
  LatestSales,
  UsersByDevice,
  LatestProducts,
  LatestOrders,
  Recommendation,
  Saldo,
  SaldoIn,
  SaldoOut,
  Statistic,
  LatestFlow,
  LatestTransaction
} from './components';

const useStyles = makeStyles(theme => ({
  root: {
    padding: theme.spacing(4)
  }
}));

const Dashboard = () => {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <Grid
        container
        spacing={4}
        alignItems="center"
      >
        <Grid
          item
          lg={4}
          sm={4}
          xs={4}
        >
          <Saldo />
        </Grid>
        <Grid
          item
          lg={4}
          sm={4}
          xs={4}
        >
          <SaldoIn />
        </Grid>
        <Grid
          item
          lg={4}
          sm={4}
          xs={4}
        >
          <SaldoOut />
        </Grid>
        <Grid
          item
          sm={6}
          xs={12}
        >
          <LatestFlow />
        </Grid>
        <Grid
          item
          sm={6}
          xs={12}
        >
          <Statistic />
        </Grid>
        <Grid
          item
          // lg={3}
          // md={12}
          // xl={12}
          sm={12}
          xs={12}
        >
          <LatestTransaction />
        </Grid>
        <Grid
          item
          // lg={3}
          // md={12}
          // xl={12}
          sm={12}
          xs={12}
        >
          <Recommendation />
        </Grid>
      </Grid>
    </div>
  );
};

export default Dashboard;
