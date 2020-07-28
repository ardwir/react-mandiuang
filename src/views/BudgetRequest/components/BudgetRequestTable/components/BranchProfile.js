import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import axios from 'axios';
import { API_BASE_URL } from '../../../../../constants'
import moment from 'moment';
import CurrencyFormat from 'react-currency-format';
import { makeStyles } from '@material-ui/styles';
import {
  Card,
  CardContent,
  Avatar,
  LinearProgress,
  Typography,
  Divider
} from '@material-ui/core';

const useStyles = makeStyles(theme => ({
  root: {},
  details: {
    // display: 'flex',
    width:'50%'
  },
  avatar: {
    marginLeft: 'auto',
    height: 110,
    width: 100,
    flexShrink: 0,
    flexGrow: 0
  },
  progress: {
    marginTop: theme.spacing(2)
  },
  uploadButton: {
    marginRight: theme.spacing(2)
  },
  colorPrimary: {
    backgroundColor: '#B2DFDB',
  },
  barColorPrimary: {
    backgroundColor: '#00695C',
  }
}));

const BranchProfile = props => {
  const { className, branchId, ...rest } = props;
  
  const [ branchProfile, setBranchProfile ] = useState({});
  const [ branchOut, setBranchOut ] = useState();
  const localData = JSON.parse(localStorage.getItem("data"));
  
  const classes = useStyles();
  
  useEffect(() => {
    console.log(branchId)
    axios.get(API_BASE_URL + `/mainbranch-service/v1/branch/branchProfile/${branchId}`, {
        headers: {
          'Authorization': `Bearer ${localData}` 
        }
    })
    .then(res => {
        console.log(res) 
        setBranchProfile(res.data);
    })
    .catch(err => {
        console.log(err + localData)
    })

    axios.get(API_BASE_URL + `/trx-service/v1/transactionBranch/branchTotalTransactionForAdmin/${branchId}`, {
      headers: {
        'Authorization': `Bearer ${localData}` 
      }
    })
    .then(res => {
      console.log(res) 
      setBranchOut(res.data);
    })
    .catch(err => {
      console.log(err + localData)
    })
  }, [branchProfile.branchAccountId])
  const user = {
    name: 'Test Test',
    city: 'DKI Jakarta',
    country: 'Indonesia',
    timezone: 'GMT+7',
    avatar: '/images/avatars/Picture1.png'
  };

  return (
    <Card
      {...rest}
      className={clsx(classes.root, className)}
    >
      <CardContent>
        <div className={classes.details}>
          <div>
            <Typography
              gutterBottom
              variant="h2"
            >
              {branchProfile.branchName}
            </Typography>
            <Typography
              className={classes.locationText}
              color="textSecondary"
              variant="body1"
            >
              {branchProfile.cityName}, {branchProfile.address}
            </Typography>
            <Typography
              className={classes.dateText}
              color="textSecondary"
              variant="body1"
            >
              {moment().format('hh:mm A')} ({user.timezone})
            </Typography>
            <Typography
              className={classes.dateText}
              color="textSecondary"
              variant="body1"
            >
              Balance: Rp. {<CurrencyFormat value={branchOut} displayType={'text'} thousandSeparator={true} prefix={''} />} / {<CurrencyFormat value={branchProfile.branchBalance} displayType={'text'} thousandSeparator={true} prefix={''} />}
            </Typography>
            <div className={classes.progress}>
            <Typography variant="body1">Budget Limit: {Math.round((`${branchOut}`)*100/`${branchProfile.branchBalance}`).toFixed(2)}%</Typography>
              {/* Math.Round Bug angka pembilang nya harus di kali 100 baru bener */}
              <LinearProgress
                classes={{colorPrimary: classes.colorPrimary, barColorPrimary: classes.barColorPrimary}}
                value={(`${branchOut}`/`${branchProfile.branchBalance}`)*100}
                variant="determinate"
              />
            </div>
          </div>
        </div>
      </CardContent>
      <Divider />
    </Card>
  );
};

BranchProfile.propTypes = {
  className: PropTypes.string
};

export default BranchProfile;
