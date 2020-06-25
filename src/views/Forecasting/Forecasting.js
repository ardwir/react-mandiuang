import React from 'react';
import { makeStyles } from '@material-ui/styles';
import { Grid } from '@material-ui/core';
import { Chart, ChartToolbar } from './components';

const useStyles = makeStyles(theme => ({
  root: {
    padding: theme.spacing(4)
  }
}));

const Forecasting = () => {
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
          sm={3}
          xs={12}
        >
          <ChartToolbar />
        </Grid>
        <Grid
          item
          sm={12}
          xs={12}
        >
          <Chart />
        </Grid>
      </Grid>
    </div>
  );
};

export default Forecasting;