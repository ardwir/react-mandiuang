import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import axios from 'axios';
import { API_BASE_URL } from '../../../../constants'
import { makeStyles } from '@material-ui/styles';
import validate from 'validate.js';
import {
  Card,
  CardHeader,
  CardContent,
  CardActions,
  Divider,
  Button,
  TextField
} from '@material-ui/core';

const useStyles = makeStyles(() => ({
  root: {}
}));

const schema = {
  oldPassword: {
    presence: { allowEmpty: false, message: 'minimum 6 characters' },
    length: {
      minimum:6
    }
  },
  password: {
    presence: { allowEmpty: false, message: 'is required' },
    length: {
      maximum: 6
    }
  },
  confirmPassword: {
    presence: { allowEmpty: false, message: 'is required' },
    length: {
      maximum: 6
    }
  }
};
const Password = props => {
  const { className, ...rest } = props;

  const classes = useStyles();
  
  const [values, setValues] = useState({
    password: '',
    confirm: ''
  });
  const localData = JSON.parse(localStorage.getItem("data"));
  
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
      url: API_BASE_URL + '/v1/auth/updatePassword', 
      data: data, 
      headers: {
        'Authorization': `Bearer ${localData.accessToken}`,
        'Content-Type': 'application/json'
      }
    }).then(res =>{
      let statusCode = res.status
      if (statusCode === 202){
        alert('Password Change Success')
        window.location.reload()
      }
    }).catch(err => {
      console.warn(err)
      console.log(data)
      alert('Password Change Failed')
      // alert(err)
    })
    
  };
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
            label="Old Password"
            name="oldPassword"
            onChange={handleChange}
            type="password"
            value={formState.values.oldPassword || ''}
            variant="outlined"
          />
          <TextField
            fullWidth
            label="New Password"
            name="password"
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
          disabled={formState.values.password === formState.values.confirmPassword ? false : true }
          autoFocus onClick={handleChangePassword} color="primary">
            Update
          </Button>
        </CardActions>
      </form>
    </Card>
  );
};

Password.propTypes = {
  className: PropTypes.string
};

export default Password;
