import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import validate from 'validate.js';
import axios from 'axios';
import { API_BASE_URL } from '../../../../../constants'
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

const schema = {
  branchIdWork: {
    presence: { allowEmpty: false, message: 'is required' },
    length: {
      maximum: 10,
      minimum:10
    }
  },
  name: {
    presence: { allowEmpty: false, message: 'is required' },
    length: {
      maximum: 40
    }
  },
  username: {
    presence: { allowEmpty: false, message: 'is required' },
    length: {
      maximum: 40
    }
  },
  email: {
    presence: { allowEmpty: false, message: 'is required' },
    length: {
      maximum: 50
    }
  },
  phoneNumber: {
    presence: { allowEmpty: false, message: 'is required' },
    length: {
      maximum: 16
    }
  },
  password: {
    presence: { allowEmpty: false, message: 'is required' },
    length: {
      maximum: 40
    }
  },
  jobPosition: {
    presence: { allowEmpty: false, message: 'is required' },
    length: {
      maximum: 40
    }
  },
  verificationCode: {
    presence: { allowEmpty: false, message: 'is required' },
    length: {
      maximum: 8,
      minimum: 8
    }
  }
};

const UsersTableToolbar = props => {
  const { className, branchId, ...rest } = props;

  const classes = useStyles();

  const [open, setOpen] = React.useState(false);
  const localData = JSON.parse(localStorage.getItem("data"));

  const [formState, setFormState] = useState({
    isValid: false,
    values: {},
    touched: {},
    errors: {}
  });

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
        'Authorization': `Bearer ${localData.accessToken}`,
        'Content-Type': 'application/json'
      }
    }).then(res =>{
      let statusCode = res.status
      if (statusCode === 201){
        alert('Registration Success')
        window.location.reload()
      }
    }).catch(err => {
      console.warn(err)
      console.log(data)
      alert('Registration Failed')
    })
    
  };
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
      <div className={classes.row}>
        <SearchInput
          className={classes.searchInput}
          placeholder="Search Branch ID"
        />
      </div>

      <Dialog onClose={handleClose} aria-labelledby="customized-dialog-title" open={open}>
        <DialogTitle id="customized-dialog-title" onClose={handleClose}>
          Add New User Account
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
              value={formState.values.email || ''}
              onChange={handleChange}
              type="text"
              variant="outlined"
            />
            <TextField
              className={classes.textField}
              fullWidth
              label="Phone Number"
              name="phoneNumber"
              value={formState.values.phoneNumber || ''}
              onChange={handleChange}
              type="text"
              variant="outlined"
            />
            <TextField
              className={classes.textField}
              fullWidth
              label="Password"
              name="password"
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
              value={formState.values.verificationCode || ''}
              onChange={handleChange}
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
                Are You Sure To Create New User For This Branch?
              </Typography>
            </div>
          </DialogContent>
        <DialogActions>
          <Button autoFocus onClick={handleRegisterUser} color="primary">
            Register User
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
