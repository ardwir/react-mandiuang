import React, { useState, useEffect } from 'react';
import  { withRouter }  from 'react-router-dom';
import PropTypes from 'prop-types';
import validate from 'validate.js';
import { makeStyles } from '@material-ui/styles';
import {
  Grid,
  Button,
  TextField,
  Typography
} from '@material-ui/core';

import Axios from 'axios';
import { API_BASE_URL } from '../../constants';

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
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundImage: 'url(/images/background.png)',
    backgroundSize: 'cover',
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'center'
    // backgroundColor: theme.palette.background.default,
    // height: '100%'
  },
  grid: {
    // backgroundColor: '#d1dae8',
    height: '100%'
  },
  quoteContainer: {
    [theme.breakpoints.down('md')]: {
      display: 'none'
    }
  },
  quote: {
    backgroundColor: theme.palette.neutral,
    height: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundImage: 'url(/images/singin1.jpg)',
    backgroundSize: 'cover',
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'center'
  },
  quoteInner: {
    textAlign: 'center',
    flexBasis: '600px'
  },
  quoteText: {
    color: theme.palette.white,
    fontWeight: 300
  },
  name: {
    marginTop: theme.spacing(3),
    color: theme.palette.white
  },
  bio: {
    color: theme.palette.white
  },
  contentContainer: {},
  content: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column'
  },
  contentHeader: {
    display: 'flex',
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
    // display: 'flex',
    alignItems: 'center',
    [theme.breakpoints.down('md')]: {
      justifyContent: 'center',
      paddingLeft: theme.spacing(2),
      paddingRight: theme.spacing(2)
    }
  },
  form: {
    paddingLeft: 500,
    paddingRight: 500,
    paddingBottom: 10,
    paddingTop: theme.spacing(1),
    flexBasis: 700,
    [theme.breakpoints.down('sm')]: {
      paddingLeft: theme.spacing(2),
      paddingRight: theme.spacing(2)
    }
  },
  title: {
    marginTop: theme.spacing(3)
  },
  textField: {
    marginTop: theme.spacing(2)
  },
  signInButton: {
    margin: theme.spacing(4,0)
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

    Axios({
      method: 'POST',
      // crossdomain: true,
      url: API_BASE_URL + '/v1/auth/signin',
      data: inputData,
      headers: {
        // 'Authorization': `Barer ${accessToken}`,  
        'Content-Type': 'application/json'
      }
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
      <Grid
        className={classes.grid}
        container
      >
        
        <Grid
          className={classes.content}
          item
          lg={12}
          xs={12}
        >
          <div className={classes.content}>
            <div className={classes.contentBody}>
              <form
                className={classes.form}
                onSubmit={handleSignIn}
              >
                <img
                  alt="Logo"
                  src="/images/logos/mandiuang-trans.png"
                  style={{paddingTop:'10%',paddingLeft: '10%', paddingRight:'10%', width:'100%'}}
                />
                <br></br>
                <br></br>
                <br></br>
                <br></br>
                <Typography
                  align="center"
                  className={classes.sugestion}
                  color="textPrimary"
                  style={{fontWeight: 'bold'}}
                  variant="h3"
                >
                  Welcome To MandiUang Admin Application:
                </Typography>
                <br></br>
                <TextField
                  // style={{paddingLeft: '10%', paddingRight:'10%', width:'100%'}}
                  className={classes.textField}
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
                  // style={{paddingLeft: '10%', paddingRight:'10%', width:'100%'}}
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
                <Button
                  className={classes.signInButton}
                  color="primary"
                  disabled={!formState.isValid}
                  fullWidth
                  size="large"
                  type="submit"
                  variant="contained"
                >
                  Sign in
                </Button>
              </form>
            </div>
          </div>
        </Grid>
      </Grid>
    </div>
  );
};

SignIn.propTypes = {
  history: PropTypes.object
};

export default withRouter(SignIn);
