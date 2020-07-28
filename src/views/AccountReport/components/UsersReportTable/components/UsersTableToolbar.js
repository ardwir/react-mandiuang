import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import axios from 'axios';
import { API_BASE_URL } from '../../../../../constants';
import { makeStyles } from '@material-ui/styles';
import { Button, Checkbox, Dialog, DialogTitle, DialogContent, DialogActions, TextField, Typography } from '@material-ui/core';

import { SearchInput } from 'components';

const useStyles = makeStyles(theme => ({
  root: {},
  row: {
    height: '42px',
    display: 'flex',
    alignItems: 'center',
    marginTop: theme.spacing(1)
  },
  spacer: {
    flexGrow: 1
  },
  deactivateButton: {
    marginRight: theme.spacing(1), 
    backgroundColor: 'red', 
    color: 'white'
  },
  addBranchButton: {
    marginRight: theme.spacing(1)
  },
  searchInput: {
    marginRight: theme.spacing(1)
  },
  textField: {
    marginTop: theme.spacing(2)
  },
  agreement: {
    marginTop: theme.spacing(1),
    display: 'flex',
    alignItems: 'center'
  },
  agreementCheckbox: {
    marginLeft: '-14px'
  }
}));

const UsersTableToolbar = props => {
  const { className, ...rest } = props;

  const classes = useStyles();

  const [open, setOpen] = React.useState(false);

  const localData = JSON.parse(localStorage.getItem("data"));

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const FileSaver = require('file-saver');

  const handleGenerateReport = (branchId) => {
    // setBranchId(branchId);
    axios.get(API_BASE_URL + '/trx-service/v1/transactionBranch/downloadTrx/' + branchId, {
      responseType: 'arraybuffer',
      headers: {
        'Authorization': `Bearer ${localData}` 
      },
      responseType: 'blob'

  })
      .then(res => {
          console.log(res.data)
          const blob = new Blob([res.data], {
            type: 'application/pdf',
          });
          FileSaver.saveAs(blob, "Branch Account Report")
      })
      .catch(err => {
        if (!err.response){
          axios.get(API_BASE_URL + '/login-service/v1/auth/logout', {
            headers: {
              'Authorization': `Bearer ${localData}` 
            }
          })
          .then(res => {
            console.log(res);
            console.log(res.data.message);
            // setFailMessage("Connection Error");
            localStorage.clear();
            // setOpenUnauthorized(true);       
          })
          .catch(err => {
            console.log(err + localData);
          })
        }
        else if (err.response.status === 401){
          // setFailMessage("Unauthorized Access");
          localStorage.clear();
          // setOpenUnauthorized(true);
        }
        else {
          console.log(err + localData)
        }
      })
  }

  return (
    <div
      {...rest}
      className={clsx(classes.root, className)}
    >
      <div className={classes.row}>
        <span className={classes.spacer} />
        <Button
          className={classes.addBranchButton}
          color="primary"
          variant="contained"
          // onClick={handleClickOpen}
          onClick={handleGenerateReport()}
        >
          Generate Report Branch
        </Button>
      </div>

      <Dialog onClose={handleClose} aria-labelledby="customized-dialog-title" open={open}>
        <DialogTitle id="customized-dialog-title" onClose={handleClose}>
          Generate Report Confirmation
        </DialogTitle>
          <DialogContent dividers>
            <TextField
              disabled
              className={classes.textField}
              fullWidth
              label="Report Type"
              name="reportType"
              type="text"
              variant="outlined"
              value="Monthly"
          />
            <TextField
              className={classes.textField}
              fullWidth
              label="Verification Code"
              name="verificationCode"
              type="password"
              variant="outlined"
            />
            <div className={classes.agreement}>
              <Checkbox
                className={classes.agreementCheckbox}
                color="primary"
                name="agreement"
              />
              <Typography
                color="textSecondary"
                variant="body1"
              >
                Are You Sure To Generate Report For This Branch?
              </Typography>
            </div>
          </DialogContent>
        <DialogActions>
          <Button autoFocus onClick={handleClose} color="primary">
            Generate Report
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

UsersTableToolbar.propTypes = {
  className: PropTypes.string
};

export default UsersTableToolbar;
