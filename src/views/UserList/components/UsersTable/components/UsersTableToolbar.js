import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import validate from 'validate.js';
import axios from 'axios';
import { API_BASE_URL, API_BASE_UR } from '../../../../../constants'
import { makeStyles } from '@material-ui/styles';
import { Button, Checkbox, Dialog, DialogTitle, DialogContent, DialogActions, TextField, Typography } from '@material-ui/core';
import  { withRouter }  from 'react-router-dom';
import { SearchInput } from 'components';

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
  },
  confirmDeactivateButton: {
    marginRight: theme.spacing(1), 
    backgroundColor: 'white', 
    color: 'red',
    fontSize: '80%'
  }
}));

const schema = {
  branchIdWork: {
    presence: { allowEmpty: false, message: 'is required' },
  },
  name: {
    presence: { allowEmpty: false, message: 'is required' },
    length: {
      minimum: 4,
      maximum: 40
    }
  },
  username: {
    presence: { allowEmpty: false, message: 'is required' },
    length: {
      minimum: 4,
      maximum: 40
    }
  },
  email: {
    presence: { allowEmpty: false, message: 'is required' },
    length: {
      minimum: 6,
      maximum: 50
    }
  },
  phoneNumber: {
    presence: { allowEmpty: false, message: 'is required' },
    length: {
      minimum: 10,
      maximum: 16
    }
  },
  password: {
    presence: { allowEmpty: false, message: 'is required' },
    length: {
      minimum: 6,
      maximum: 40
    }
  },
  jobPosition: {
    presence: { allowEmpty: false, message: 'is required' },
    length: {
      minimum: 3,
      maximum: 40
    }
  },
  verificationCode: {
    presence: { allowEmpty: false, message: 'is required' },
    length: {
      maximum: 6,
      minimum: 6
    }
  }
};

const UsersTableToolbar = props => {
  const { className, branchId, history, ...rest } = props;

  const classes = useStyles();

  const [open, setOpen] = React.useState(false);
  const [successMessage, setSuccessMessage] = useState([]);
  const [failMessage, setFailMessage] = useState({});
  const [openFail, setOpenFail] = React.useState(false);
  const [openFailReload, setOpenFailReload] = React.useState(false);
  const [openSuccess, setOpenSuccess] = React.useState(false);
  const [openUnauthorized, setOpenUnauthorized] = React.useState(false);
  const localData = JSON.parse(localStorage.getItem("data"));

  const [formState, setFormState] = useState({
    isValid: false,
    values: {},
    touched: {},
    errors: {}
  });

  const hasError = field =>
  formState.touched[field] && formState.errors[field] ? true : false;

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };
  
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

  const handleRegisterUser = event => {
    event.preventDefault();
    var data = JSON.stringify(
      {
        "name": `${formState.values.name}`,
        "username": `${formState.values.username}`,
        "branch_id_work": `${formState.values.branchIdWork}`,
        "email": `${formState.values.email}`,
        "password": `${formState.values.password}`,
        "phone_number": `${formState.values.phoneNumber}`,
        "job_position": `${formState.values.jobPosition}`,
        "verification_code": `${formState.values.verificationCode}`
      }
    ) 
    
    axios({
      method: 'POST', 
      url: API_BASE_URL + '/login-service/v1/auth/signup', 
      data: data, 
      headers: {
        'Authorization': `Bearer ${localData}`,
        'Content-Type': 'application/json'
      }
    }).then(res =>{
      let statusCode = res.status
      if (statusCode === 201){
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
      // alert(err.response.data.message)
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

  const handleCloseFailReload = () => {
    setOpenFailReload(false);
    window.location.reload()
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
          onClick={handleClickOpen}
        >
          Add User
        </Button>
      </div>
      {/* <div className={classes.row}>
        <SearchInput
          className={classes.searchInput}
          placeholder="Search Branch ID"
          style={{marginLeft:'2px', marginBottom:'25px'}}
        />
      </div> */}

      <Dialog onClose={handleClose} aria-labelledby="customized-dialog-title" open={open}>
        <DialogTitle className={classes.dialogTitle} id="customized-dialog-title" onClose={handleClose}>
          <span style={{color: 'white'}}>Add New User Account</span>
        </DialogTitle>
        <DialogContent dividers>
            <TextField
              disabled
              className={classes.textField}
              fullWidth
              label="Branch ID"
              name="branchIdWork"
              value={formState.values.branchIdWork = `${branchId}`  || `${branchId}`}
              onChange={handleChange}
              type="text"
              variant="outlined"
            />
            <TextField
              className={classes.textField}
              fullWidth
              label="Name"
              name="name"
              error={hasError('name')}
              helperText={
                    hasError('name') ? formState.errors.name[0] : null
              }
              value={formState.values.name || ''}
              onChange={handleChange}
              type="text"
              variant="outlined"
            />
            <TextField
              className={classes.textField}
              fullWidth
              label="Username"
              name="username"
              error={hasError('username')}
              helperText={
                    hasError('username') ? formState.errors.username[0] : null
              }
              value={formState.values.username || ''}
              onChange={handleChange}
              type="text"
              variant="outlined"
            />
            <TextField
              className={classes.textField}
              fullWidth
              label="Email address"
              name="email"
              error={hasError('email')}
              helperText={
                    hasError('email') ? formState.errors.email[0] : null
              }
              value={formState.values.email || ''}
              onChange={handleChange}
              type="email"
              variant="outlined"
            />
            <TextField
              className={classes.textField}
              fullWidth
              label="Phone Number"
              name="phoneNumber"
              error={hasError('phoneNumber')}
              helperText={
                    hasError('phoneNumber') ? formState.errors.phoneNumber[0] : null
              }
              value={formState.values.phoneNumber || ''}
              onChange={handleChange}
              type="number"
              variant="outlined"
            />
            <TextField
              className={classes.textField}
              fullWidth
              label="Password"
              name="password"
              error={hasError('password')}
              helperText={
                    hasError('password') ? formState.errors.password[0] : null
              }
              value={formState.values.password || ''}
              onChange={handleChange}
              type="password"
              variant="outlined"
            />
            <TextField
              className={classes.textField}
              fullWidth             
              label="Job Position"
              name="jobPosition"
              error={hasError('jobPosition')}
              helperText={
                    hasError('jobPosition') ? formState.errors.jobPosition[0] : null
              }
              value={formState.values.jobPosition || ''}
              onChange={handleChange}
              type="text"
              variant="outlined"
            />
            <TextField
              className={classes.textField}
              fullWidth
              label="Verification Code"
              name="verificationCode"
              error={hasError('verificationCode')}
              helperText={
                    hasError('verificationCode') ? formState.errors.verificationCode[0] : null
              }
              value={formState.values.verificationCode || ''}
              onChange={handleChange}
              type="password"
              variant="outlined"
            />
          </DialogContent>
        <DialogActions>
          <Button autoFocus onClick={handleRegisterUser} color="primary"
                  // disabled={!formState.values.verificationCode || !formState.values.password || !formState.values.jobPosition || 
                  //           !formState.values.phoneNumber || !formState.values.email || !formState.values.name || !formState.values.username ||
                  //           !formState.values.branchIdWork}
                  disabled={!formState.isValid}
          >
            Register User
          </Button>
        </DialogActions>
      </Dialog>
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
    </div>
  );
};

UsersTableToolbar.propTypes = {
  className: PropTypes.string,
  history: PropTypes.object
};

export default withRouter(UsersTableToolbar);
