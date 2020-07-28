import React, { useState, useEffect } from 'react';
import  { withRouter }  from 'react-router-dom';
import PropTypes from 'prop-types';
import validate from 'validate.js';
import { makeStyles } from '@material-ui/styles';
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent, 
  DialogActions,
  TextField,
  Typography,
  Card,
  Divider
} from '@material-ui/core';

import Axios from 'axios';
import { API_BASE_URL, API_BASE_UR } from '../../constants';

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
  dialogTitle: {
    backgroundColor: '#00A479',
    color: '#FFFFFF',
    fontWeight: 'bold',
    boxShadow: '1px 3px 1px'
  },
  dialogTitleFail: {
    backgroundColor: '#F14D4D',
    color: '#FFFFFF',
    fontWeight: 'bold',
    boxShadow: '1px 3px 1px'
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
    marginBottom: '20%',
    boxShadow: '2px 1px 2px #9E9E9E'

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
    // margin: theme.spacing(1),
    // left: '40%'
  },
  updateButton: {
    marginRight: theme.spacing(1), 
    backgroundColor: 'white', 
    color: 'primary',
    fontSize: '80%'
  },
  helpButton: {
    // marginTop: theme.sapcing(1),
    // marginBottom: theme.spacing(1),
    marginTop: theme.spacing(1), 
    marginBottom: theme.spacing(1), 
    backgroundColor: 'white', 
    color: 'green',
    fontSize: '80%'
  },
  otpButton: {
    marginRight: theme.spacing(1), 
    backgroundColor: 'white', 
    color: '#28B8D7',
    fontSize: '80%'
  }
}));

const SignIn = props => {
  const { history } = props;
  const [open, setOpen] = React.useState(false);
  const [passingVerCode, setPassingVerCode] = React.useState();
  const [successMessage, setSuccessMessage] = useState({});
  const [failMessage, setFailMessage] = useState({});
  const [openFail, setOpenFail] = React.useState(false);
  const [openHelp, setOpenHelp] = React.useState(false);
  const [openOtp, setOpenOtp] = React.useState(false);
  const localData = JSON.parse(localStorage.getItem("data"));

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

  const handleContinueToHome = event => {
    history.push('/dashboard');
  }

  const handleSignIn = event => {
    event.preventDefault();
    console.log(formState.values)

    var inputData = JSON.stringify(formState.values);

    const https = require('https'); 
    Axios({
      method: 'POST',
      url: API_BASE_URL + '/login-service/v1/auth/signinAdmin',
      data: inputData,
      headers: {  
        'Content-Type': 'application/json'
      },
      httpsAgent: new https.Agent({rejectUnauthorized: false})
    }).then(Response => {
      console.log(Response)
      if(Response.status === 200){
        localStorage.setItem("data", JSON.stringify(Response.data.accessToken))
        setPassingVerCode(Response.data.verificationCode)
        setOpen(true);
      }
    }).catch(Error => {
      console.warn(Error)
      if (!Error.response){
        setFailMessage("Login Failed")
        setOpenFail(true)
      }
      else if (Error.response.status === 401){
        setFailMessage("Bad Credentials")
        setOpenFail(true) 
      }
      else {
        if (Error.response.data.message){
          setFailMessage(Error.response.data.message)
          setOpenFail(true)
        }        
      }
      
    })

  };

  const handleOpenHelp = () => {
    setOpenHelp(true);
  }

  const handleCloseHelp = () => {
    setOpenHelp(false);
  }

  const handleGenreateOtp = () => {
    Axios.get(API_BASE_URL + `/login-service/v1/auth/sendOtp` , {
      headers: {
        // 'Content-Type': 'application/json',
        'Authorization': `Bearer ${localData}` 
      }
    })
      .then(res => {
          console.log(res.data) 
          // setTranscationProfile(res.data);
      })
      .catch(err => {
        console.log(err.response.data)
        console.log(err + localData)
      })
    setOpen(false)
    setOpenOtp(true)
  }
// =================================================== API Response =================================================
const handleCloseFail = () => {
  setOpenFail(false);
  history.push('/');
}

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
                <Card align="center" className={classes.card}>
                  <form style={{}}>
                  <img
                    alt="Logo"
                    src="/images/logos/logoafteruats.png"
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
                      align="left"
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
                      align="left"
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
                    <Button
                      className={classes.helpButton}
                      color="primary"
                      // disabled={!formState.isValid}
                      // fullWidth
                      size="small"
                      // variant="contained"
                      onClick={handleOpenHelp}
                    >
                      Need Help ?
                    </Button>
    {/* ====================================== Help Dialog ====================================== */}
                    <Dialog onClose={handleCloseHelp} aria-labelledby="customized-dialog-title" open={openHelp}>
                    <DialogTitle className={classes.dialogTitle} id="customized-dialog-title" onClose={handleCloseHelp}>
                      <span style={{color: 'white'}}>Need Help Fron MandiUang Dev Team?</span>
                    </DialogTitle>
                    <DialogContent align="center" dividers>
                      <img
                        alt="Logo"
                        src="/images/logos/logoafteruats.png"
                        style={{paddingLeft: '10%', paddingRight:'10%', width:'100%'}}
                      />
                      <br />
                      <Typography
                          color="textSecondary"
                          variant="h2"
                      >
                        <br />
                        For Technical Support Assistance
                      </Typography>
                      <Typography
                        color="textSecondary"
                        variant="h4"
                      >
                        Please Contact <b><u>devsupport@mandiuang.com</u></b>
                      </Typography>
                    </DialogContent>
                      <DialogActions>
                        <Button autoFocus onClick={handleCloseHelp} color="primary">
                          Back
                        </Button>
                    </DialogActions>
                  </Dialog>
          {/* ====================================== Login Success Dialog ====================================== */}
                  <Dialog aria-labelledby="customized-dialog-title" open={open}>
                    <DialogTitle className={classes.dialogTitle} id="customized-dialog-title">
                      <span style={{color: 'white'}}>Welcome To MandiUang!</span>
                    </DialogTitle>
                    <DialogContent align="center" dividers>
                      <img
                        alt="Logo"
                        src="/images/logos/logoafteruats.png"
                        style={{paddingLeft: '10%', paddingRight:'10%', width:'100%'}}
                      />
                      <br />
                      <Typography
                          color="textSecondary"
                          variant="h4"
                      >
                        <br />
                        This Application Is Secured Using Verification Code
                      </Typography>
                      <Typography
                        color="textSecondary"
                        variant="body1"
                      >
                        For Doing Transaction Please Generate Your Verification Code!
                      </Typography>
                      <Typography
                        color="textSecondary"
                        variant="body1"
                      >
                        If Not Please Click Continue, and Don't Generete Verification Code.
                      </Typography>
                    </DialogContent>
                      <DialogActions>
                      <Button className={classes.otpButton} autoFocus onClick={handleGenreateOtp} color="primary">
                          Generate Verification Code
                        </Button>
                        <Button className={classes.updateButton} autoFocus onClick={handleContinueToHome} color="primary">
                          Continue
                        </Button>
                    </DialogActions>
                  </Dialog>

    {/* ====================================== Hit Generate Verification Code ====================================== */}
                   <Dialog aria-labelledby="customized-dialog-title" open={openOtp}>
                    <DialogTitle className={classes.dialogTitle} id="customized-dialog-title">
                      <span style={{color: 'white'}}>Verifcation Code Generated</span>
                    </DialogTitle>
                    <DialogContent align="center" dividers>
                      <img
                        alt="Logo"
                        src="/images/logos/otp.png"
                        style={{paddingLeft: '10%', paddingRight:'10%', width:'50%'}}
                      />
                      <br />
                      <Typography
                          color="textSecondary"
                          variant="h4"
                      >
                        <br />
                        Please Check Your Registered Phone Number To See Your Verification Code
                      </Typography>
                    </DialogContent>
                      <DialogActions>
                        <Button className={classes.updateButton} autoFocus onClick={handleContinueToHome} color="primary">
                          Continue
                        </Button>
                    </DialogActions>
                  </Dialog>

        {/* ====================================== Login Failed Dialog Dialog ====================================== */}
                  <Dialog onClose={handleCloseFail} aria-labelledby="customized-dialog-title" open={openFail}>
                    <DialogTitle className={classes.dialogTitleFail} id="customized-dialog-title" onClose={handleCloseFail}>
                      <span style={{color: 'white'}}>Failed</span>
                    </DialogTitle>
                    <DialogContent align="center" dividers>
                      <img
                        alt="Logo"
                        src="/images/logos/fail-icon-65.png"
                        style={{paddingLeft: '10%', paddingRight:'10%', paddingTop:'15px', width:'50%'}}
                      />
                      <br />
                      <Typography
                          color="textSecondary"
                          variant="h2"
                          align="center"
                        >
                          <br />
                          {failMessage}
                        </Typography>
                    </DialogContent>
                  </Dialog>
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