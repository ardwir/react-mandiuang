import React, {useState, useEffect} from 'react';
import clsx from 'clsx';
import axios from 'axios';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/styles';
import {
  Card,
  CardContent,
  Grid,
  Typography,
  Avatar
} from '@material-ui/core';
import AttachMoneyIcon from '@material-ui/icons/AttachMoney';
import Skeleton from "@material-ui/lab/Skeleton";
import { API_BASE_URL } from '../../../../constants'

const useStyles = makeStyles(theme => ({
  root: {
    height: '100%',
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.primary.contrastText
  },
  content: {
    alignItems: 'center',
    display: 'flex'
  },
  title: {
    fontWeight: 700
  },
  number: {
    fontSize: '1.2rem', '@media (min-width:600px)': {
      fontSize: '1.5rem',
    },
    [theme.breakpoints.up('md')]: {
      fontSize: '2.4rem',
    }
  },
  avatar: {
    backgroundColor: 'green',
    color: theme.palette.primary.contrastText,
    height: 56,
    width: 56
  },
  icon: {
    height: 48,
    width: 48
  },
  progress: {
    marginTop: theme.spacing(3)
  }
}));

const Saldo = props => {
  const { className, ...rest } = props;

  const [ mainProfile, setMainProfile ] = useState({});
  const localData = JSON.parse(localStorage.getItem("data"));

  const classes = useStyles();
  var money = `${mainProfile.mainBalance}`;
  var moneyDots = money.toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1.");
  useEffect(() => {
    axios.get(API_BASE_URL + '/mainbranch-service/v1/main/mainProfile', {
        headers: {
          'Authorization': `Bearer ${localData.accessToken}` 
        }
    })
        .then(res => {
            console.log(res) 
            setMainProfile(res.data);
        })
        .catch(err => {
            console.log(err)
        })
  }, [mainProfile.id])

  return (
    <Card
      {...rest}
      className={clsx(classes.root, className)}
    >
      <CardContent>
      <br />
        <Grid
          container
          justify="space-between"
        >
          <Grid item>
            <Typography
              className={classes.title}
              color="inherit"
              gutterBottom
              variant="h4"
            >
              Total Balance
            </Typography>
            
            {/* <Typography color="inherit" variant="h4">Rp. {moneyDots || <Skeleton width={150} animation='wave'/>}</Typography> */}
            <Typography color="inherit" variant="h4">Rp. {mainProfile.mainBalance || <Skeleton width={150} animation='wave'/>}</Typography>
          </Grid>
          <Grid item>
            <Avatar className={classes.avatar}>
              <AttachMoneyIcon className={classes.icon} />
            </Avatar>
          </Grid>
        </Grid>
        <br />
      </CardContent>
    </Card>
  );
};

Saldo.propTypes = {
  className: PropTypes.string
};

export default Saldo;