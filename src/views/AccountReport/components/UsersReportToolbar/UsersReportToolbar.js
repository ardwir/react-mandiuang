import React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import axios from 'axios';
import { API_BASE_URL } from '../../../../constants';
import { makeStyles } from '@material-ui/styles';
import { Button, Checkbox, Dialog, DialogTitle, DialogContent, DialogActions, TextField, Typography } from '@material-ui/core';
// import { SearchInput } from 'components';


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
  importButton: {
    marginRight: theme.spacing(1)
  },
  exportButton: {
    marginRight: theme.spacing(1)
  },
  searchInput: {
    marginRight: theme.spacing(1)
  }
}));

const UsersReportToolbar = props => {
  const { className, history, ...rest } = props;
  const localData = JSON.parse(localStorage.getItem("data"));
  
  const classes = useStyles();
  
  const FileSaver = require('file-saver');
  
  const handleGenerateReport = () => {
    axios.get(API_BASE_URL + '/trx-service/v1/transactionBranch/downloadAll', {
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
          FileSaver.saveAs(blob, "Branch_Account_Report")
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
          color="primary"
          variant="contained"
          onClick={handleGenerateReport}
        >
          Generate Report
        </Button>
      </div>
    </div>
  );
};

UsersReportToolbar.propTypes = {
  className: PropTypes.string
};

export default UsersReportToolbar;
