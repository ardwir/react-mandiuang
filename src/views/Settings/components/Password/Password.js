import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import axios from 'axios';
import { API_BASE_URL } from '../../../../constants'
import { makeStyles } from '@material-ui/styles';
import validate from 'validate.js';
import  { withRouter }  from 'react-router-dom';
import {
  Card,
  CardHeader,
  CardContent,
  CardActions,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Button,
  TextField,
  Typography
} from '@material-ui/core';

const useStyles = makeStyles(theme => ({
  root: {},
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
  confirmDeactivateButton: {
    marginRight: theme.spacing(1), 
    backgroundColor: 'white', 
    color: 'red',
    fontSize: '80%'
  }
}));

const schema = {
  oldPassword: {
    presence: { allowEmpty: false, message: 'minimum 6 characters' },
    length: {
      minimum: 6,
      maximum: 20
    }
  },
  password: {
    presence: { allowEmpty: false, message: 'is required' },
    length: {
      minimum: 6,
      maximum: 20
    }
  },
  confirmPassword: {
    presence: { allowEmpty: false, message: 'is required' },
    length: {
      minimum: 6,
      maximum: 20
    }
  }
};
const Password = props => {
  const { className, history, ...rest } = props;

  const classes = useStyles();
  
  const [successMessage, setSuccessMessage] = useState([]);
  const [failMessage, setFailMessage] = useState({});
  const [openUnauthorized, setOpenUnauthorized] = React.useState(false);
  const [openFail, setOpenFail] = React.useState(false);
  const [openSuccess, setOpenSuccess] = React.useState(false);
  const localData = JSON.parse(localStorage.getItem("data"));
  
  const [formState, setFormState] = useState({
    isValid: false,
    values: {},
    touched: {},
    errors: {}
  });

  const hasError = field =>
    formState.touched[field] && formState.errors[field] ? true : false;

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
  const handleChangePassword = event => {
    event.preventDefault();
    var data = JSON.stringify(
      {
        "old_password": `${formState.values.oldPassword}`,
        "new_password": `${formState.values.password}`,
      }
    ) 
    
    axios({
      method: 'PUT', 
      url: API_BASE_URL + '/login-service/v1/auth/updatePassword', 
      data: data, 
      headers: {
        'Authorization': `Bearer ${localData}`,
        'Content-Type': 'application/json'
      }
    }).then(res =>{
      let statusCode = res.status
      if (statusCode === 202){
        setSuccessMessage(res.data.message)
        setOpenSuccess(true)
        // alert(res.data.message)
        // window.location.reload()
      }
    }).catch(err => {
      console.log(data)
      if (!err.response){
        axios.get(API_BASE_URL + '/login-service/v1/auth/logout', {
          headers: {
            'Authorization': `Bearer ${localData}` 
          }
        })
        .then(res => {
          console.log(res);
          console.log(res.data.message);
          setFailMessage("Connection Error");
          localStorage.clear();
          setOpenUnauthorized(true);       
        })
        .catch(err => {
          console.log(err + localData);
        })
      }
      else if (err.response.status === 401){
        setFailMessage("Unauthorized Access");
        localStorage.clear();
        setOpenUnauthorized(true);
      }
      else {
        setFailMessage(err.response.data.message)
        setOpenFail(true)
      }
    })
    
  };

  const handleContinueToSignIn = event => {
    history.push('/sign-in');
  }

  // =================================================== API Response =================================================
  const handleCloseSuccess = () => {
    setOpenSuccess(false);
    window.location.reload()
  }

  const handleCloseFail = () => {
    setOpenFail(false);
  }

// =================================================== Render Side =================================================
  return (
    <Card
      {...rest}
      className={clsx(classes.root, className)}
    >
      <form>
        <CardHeader
          subheader="Update password"
          title="Password"
        />
        <Divider />
        <CardContent>
          <TextField
            fullWidth
            label="Current Password"
            name="oldPassword"
            error={hasError('oldPassword')}
            helperText={
                  hasError('oldPassword') ? formState.errors.oldPassword[0] : null
            }
            onChange={handleChange}
            type="password"
            value={formState.values.oldPassword || ''}
            variant="outlined"
          />
          <TextField
            fullWidth
            label="New Password"
            name="password"
            error={hasError('password')}
            helperText={
                  hasError('password') ? formState.errors.password[0] : null
            }
            onChange={handleChange}
            style={{ marginTop: '1rem' }}
            type="password"
            value={formState.values.password || ''}
            variant="outlined"
          />
          <TextField
            fullWidth
            label="Confirm New Password"
            name="confirmPassword"
            error={hasError('confirmPassword')}
            helperText={
                  hasError('confirmPassword') ? formState.errors.confirmPassword[0] : null
            }
            onChange={handleChange}
            style={{ marginTop: '1rem' }}
            type="password"
            value={formState.values.confirmPassword || ''}
            variant="outlined"
          />
        </CardContent>
        <Divider />
        <CardActions>
          <Button 
          disabled={formState.values.password === formState.values.confirmPassword && formState.values.password != formState.values.oldPassword && formState.values.oldPassword && formState.isValid ? false : true }
          autoFocus onClick={handleChangePassword} color="primary">
            Update
          </Button>
        </CardActions>
      </form>

      {/* ====================================== Transfer Success Dialog Dialog ====================================== */}
      <Dialog onClose={handleCloseSuccess} aria-labelledby="customized-dialog-title" open={openSuccess}>
        <DialogTitle className={classes.dialogTitle} id="customized-dialog-title" onClose={handleCloseSuccess}>
          <span style={{color: 'white'}}>Success</span>
        </DialogTitle>
        <DialogContent align="center" dividers>
          <img
            alt="Logo"
            src="/images/logos/success-icon.png"
            style={{paddingLeft: '10%', paddingRight:'10%', paddingTop:'15px', width:'50%'}}
          />
          <br />
          <Typography
              color="textSecondary"
              variant="h2"
            >
              <br />
              {successMessage}
            </Typography>
        </DialogContent>
        {/* <DialogActions>
          <Button className={classes.confrimButton} autoFocus onClick={handleCloseSuccess} color="primary">
            Back To Tranfer Page
          </Button>
        </DialogActions> */}
      </Dialog>

  {/* ====================================== Transfer Failed Dialog Dialog ====================================== */}
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
        {/* <DialogActions>
          <Button className={classes.confirmButton} autoFocus onClick={handleCloseFail} color="primary">
            Back
          </Button>
        </DialogActions> */}
      </Dialog>
  {/* // ====================================== API Error Handling  ====================================== */}
      <Dialog onClose={handleContinueToSignIn} aria-labelledby="customized-dialog-title" open={openUnauthorized}>
        <DialogTitle className={classes.dialogTitleFail} id="customized-dialog-title" onClose={handleContinueToSignIn}>
          <span style={{color: 'white'}}>Connection Problems!</span>
        </DialogTitle>
        <DialogContent align="center" dividers>
          <img
            alt="Logo"
            src="/images/logos/fail-icon-65.png"
            style={{paddingLeft: '10%', paddingRight:'10%', width:'50%'}}
          />
          <br />
          <Typography
            color="textSecondary"
            variant="h4"
          >
            <br />
            {successMessage} {failMessage}
          </Typography>
          <Typography
            color="textSecondary"
            variant="body1"
          >
            You will be redirected to sign-in page!
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button className={classes.confirmDeactivateButton} autoFocus onClick={handleContinueToSignIn} color="primary">
            Back To Sign-In Page
          </Button>
        </DialogActions>
      </Dialog>
    </Card>
  );
};

Password.propTypes = {
  className: PropTypes.string,
  history: PropTypes.object
};

export default withRouter(Password);
