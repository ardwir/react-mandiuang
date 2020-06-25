import React from 'react';
import { makeStyles } from '@material-ui/styles';
import { Grid } from '@material-ui/core';

import { Password, AccountDetails } from './components';

const useStyles = makeStyles(theme => ({
  root: {
    padding: theme.spacing(4)
  }
}));

const Settings = () => {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <Grid
        container
        spacing={4}
      >
        <Grid
          item
          lg={3}
          md={3}
          xl={3}
          xs={12}
        >

        </Grid>
        <Grid
          item
          lg={6}
          md={6}
          xl={6}
          xs={12}
        >
        <AccountDetails />
        </Grid>
      
        <Grid
          item
          lg={3}
          md={3}
          xl={3}
        >

        </Grid>
        <Grid
          item
          lg={3}
          md={3}
          xl={3}
        >

        </Grid>
        <Grid
          item
          lg={6}
          md={6}
          xl={6}
          xs={12}
        >
        <Password />
        </Grid>
        <Grid
          item
          md={7}
          xs={12}
        >
          
        </Grid>
      </Grid>
    </div>
  );
};

export default Settings;
