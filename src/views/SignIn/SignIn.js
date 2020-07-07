import React, { useState, useEffect } from 'react';
import  { withRouter }  from 'react-router-dom';
import PropTypes from 'prop-types';
import validate from 'validate.js';
import { makeStyles } from '@material-ui/styles';
import {
  Grid,
  Button,
  TextField,
  Typography,
  Card,
  Divider
} from '@material-ui/core';

import Axios from 'axios';
import { API_LOGIN, API_BASE_URL } from '../../constants';

const schema = {
  username: {
    presence: { allowEmpty: false, message: 'is required' },
    length: {
      maximum: 64
    }
  },
  password: {
    presence: { allowEmpty: false, message: 'is required' },
    length: {
      maximum: 128
    }
  }
};

const useStyles = makeStyles(theme => ({
  root: {
    backgroundColor: theme.palette.neutral,
    height: '100%',
    // display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundSize: 'cover',
    backgroundRepeat: 'no-repeat'
  },
  grid: {
    // backgroundColor: '#d1dae8',
    display: 'flex',
    height: '100%',
    direction: "column",
    alignItems: "right",
    justify: "center",
  },
  card: {
    // display: 'flex',
    // width: '600px',
    width: '100%',
    backgroundColor: '',
    borderRadius: '20px',
    marginTop: '15%',
    marginBottom: '20%'
  },
  quoteContainer: {
    [theme.breakpoints.down('md')]: {
      display: 'none'
    }
  },
  name: {
    marginTop: theme.spacing(3),
    color: theme.palette.white
  },
  bio: {
    color: theme.palette.white
  },
  contentContainer: { 
    backgroundColor: '#f5f5f5',
  },
  content: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
  },
  contentHeader: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: theme.spacing(5),
    paddingBototm: theme.spacing(2),
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2)
  },
  logoImage: {
    marginLeft: theme.spacing(4)
  },
  contentBody: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    [theme.breakpoints.down('md')]: {
      justifyContent: 'center',
      paddingLeft: theme.spacing(2),
      paddingRight: theme.spacing(2)
    }
  },
  form: {
    // paddingLeft: 500,
    // paddingRight: 500,
    paddingBottom: 10,
    paddingTop: theme.spacing(1),
    flexBasis: 700,
    [theme.breakpoints.down('sm')]: {
      paddingLeft: theme.spacing(2),
      paddingRight: theme.spacing(2)
    },
  },
  title: {
    marginTop: theme.spacing(3)
  },
  textField: {
    margin: theme.spacing(2),
    paddingRight: theme.spacing(4)
  },
  signInButton: {
    margin: theme.spacing(2),
    left: '40%'
  }
}));

const SignIn = props => {
  const { history } = props;

  const classes = useStyles();

  const [formState, setFormState] = useState({
    isValid: false,
    values: {},
    touched: {},
    errors: {}
  });

  useEffect(() => {
    const errors = validate(formState.values, schema);

    setFormState(formState => ({
      ...formState,
      isValid: errors ? false : true,
      errors: errors || {}
    }));
  }, [formState.values]);

  const handleChange = event => {
    event.persist();

    setFormState(formState => ({
      ...formState,
      values: {
        ...formState.values,
        [event.target.name]:
          event.target.type === 'checkbox'
            ? event.target.checked
            : event.target.value
      },
      touched: {
        ...formState.touched,
        [event.target.name]: true
      }
    }));
  };

  const handleSignIn = event => {
    event.preventDefault();
    console.log(formState.values)

    // const token = Buffer.from(`mobileapp:abcd`, `utf8`).toString('base64');
    var inputData = JSON.stringify(formState.values);
    console.log(inputData);

    const https = require('https'); 
    Axios({
      method: 'POST',
      // crossdomain: true,
      url: API_LOGIN + '/v1/auth/signinAdmin',
      data: inputData,
      headers: {  
        'Content-Type': 'application/json'
      },
      httpsAgent: new https.Agent({rejectUnauthorized: false})
    }).then(Response => {
      console.log(Response)
      if(Response.status === 200){
        // console.log("Response Status 200 OK")
        localStorage.setItem("data", JSON.stringify(Response.data))
        // localStorage.setItem(ACCESS_TOKEN, res.accessToken)
        // console.log(JSON.parse(localStorage.getItem("data").access_token))
        history.push('/dashboard');
      }
    }).catch(Error => {
      console.warn(Error)
      alert('Failed to Login')
      history.push('/');
    })

  };

  const hasError = field =>
    formState.touched[field] && formState.errors[field] ? true : false;

  return (
    <div className={classes.root}>
          <div className={classes.content}>
            <div className={classes.contentBody}>
              <form
                className={classes.form}
                onSubmit={handleSignIn}
                >
                <Card className={classes.card}>
                  <form style={{}}>
                  <img
                    alt="Logo"
                    src="/images/logos/MandiUangSignInLogo.png"
                    style={{paddingTop:'10%',paddingLeft: '10%', paddingRight:'10%', width:'100%', borderRadius:'20px'}}
                  />
                    <br></br>
                    <br></br>
                    <Typography
                      align="center"
                      className={classes.sugestion}
                      color="textPrimary"
                      style={{fontWeight: 'bold'}}
                      variant="h3"
                    >
                      Welcome To MandiUang Admin Application
                    </Typography>
                    <br></br>
                    <Divider />
                    <TextField
                      className={classes.textField}
                      width= "50%"
                      error={hasError('username')}
                      fullWidth
                      helperText={
                        hasError('username') ? formState.errors.username[0] : null
                      }
                      label="Username"
                      name="username"
                      onChange={handleChange}
                      type="text"
                      value={formState.values.username || ''}
                      variant="outlined"
                    />
                    <TextField
                      className={classes.textField}
                      error={hasError('password')}
                      fullWidth
                      helperText={
                        hasError('password') ? formState.errors.password[0] : null
                      }
                      label="Password"
                      name="password"
                      onChange={handleChange}
                      type="password"
                      value={formState.values.password || ''}
                      variant="outlined"
                    />
                    <br></br>
                    <Button
                      className={classes.signInButton}
                      color="primary"
                      disabled={!formState.isValid}
                      // fullWidth
                      size="large"
                      type="submit"
                      variant="contained"
                    >
                      Sign in
                    </Button>
                  </form>
                </Card>
              </form>
            </div>
          </div>
    </div>
  );
};

SignIn.propTypes = {
  history: PropTypes.object
};

export default withRouter(SignIn);