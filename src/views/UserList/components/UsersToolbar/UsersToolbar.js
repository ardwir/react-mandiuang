import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import validate from 'validate.js';
import axios from 'axios';
import { API_BASE_URL } from '../../../../constants'
import { makeStyles } from '@material-ui/styles';
import { 
  Button, Checkbox, Dialog, DialogTitle, DialogContent, DialogActions, TextField, Typography,
  FormControl, InputLabel, Select, MenuItem, FormHelperText 
} from '@material-ui/core';
import { SearchInput } from 'components';

const schema = {
  branchAccountNo: {
    presence: { allowEmpty: false, message: 'is required' },
    length: {
      maximum: 10,
      minimum:10
    }
  },
  branchName: {
    presence: { allowEmpty: false, message: 'is required' },
    length: {
      maximum: 40
    }
  },
  picPhone: {
    presence: { allowEmpty: false, message: 'is required' },
    length: {
      maximum: 20
    }
  },
  picName: {
    presence: { allowEmpty: false, message: 'is required' },
    length: {
      maximum: 40
    }
  },
  cityId: {
    presence: { allowEmpty: false, message: 'is required' },
  },
  businessType: {
    presence: { allowEmpty: false, message: 'is required' },
    length: {
      maximum: 40
    }
  },
  address: {
    presence: { allowEmpty: false, message: 'is required' },
    length: {
      maximum: 140
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

const UsersToolbar = props => {
  
  const { className, history, ...rest } = props;
  const classes = useStyles();

  const [formState, setFormState] = useState({
    isValid: false,
    values: {},
    touched: {},
    errors: {}
  });

  const [citys, setCitys] = useState([]);
  const [open, setOpen] = React.useState(false);
  const localData = JSON.parse(localStorage.getItem("data"));

  // ====================================== For Create New Branch Dialog  ======================================
  const handleClickOpen = () => {
      axios.get(API_BASE_URL + `/account-service/v1/city/allCity`, {
          headers: {
            'Authorization': `Bearer ${localData.accessToken}` 
          }
      })
          .then(res => {
              console.log(res) 
              setCitys(res.data);
          })
          .catch(err => {
              console.log(err + localData.accessToken)
          })
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

  const handleRegisterBranch = event => {
    event.preventDefault();
    var data = JSON.stringify(
      {
        "branch_account_no": `${formState.values.branchAccountNo}`,
        "branch_name": `${formState.values.branchName}`,
        "pic_phone": `${formState.values.picPhone}`,
        "pic_name": `${formState.values.picName}`,
        "city_id": `${formState.values.cityId}`,
        "business_type": `${formState.values.businessType}`,
        "address": `${formState.values.address}`,
        "verification_code": `${formState.values.verificationCode}`
      }
    ) 
    
    axios({
      method: 'POST', 
      url: API_BASE_URL + '/mainbranch-service/v1/branch/createBranch', 
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

// ====================================== Render Side  ======================================  
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
          Add Branch
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
          Add New Branch Account
        </DialogTitle>
        <DialogContent dividers>
          <TextField
            className={classes.textField}
            fullWidth
            label="Branch Account Number"
            name="branchAccountNo"
            value={formState.values.branchAccountNo || ''}
            onChange={handleChange}
            type="text"
            variant="outlined"
          />
          <TextField
            className={classes.textField}
            fullWidth
            label="Branch Name"
            name="branchName"
            value={formState.values.branchName || ''}
            onChange={handleChange}
            type="text"
            variant="outlined"
          />
          <TextField
            className={classes.textField}
            fullWidth
            label="Business Type"
            name="businessType"
            value={formState.values.businessType || ''}
            onChange={handleChange}
            type="text"
            variant="outlined"
          />
          <TextField
            className={classes.textField}
            fullWidth
            label="PIC Number"
            name="picPhone"
            value={formState.values.picPhone || ''}
            onChange={handleChange}
            type="text"
            variant="outlined"
          />
          <TextField
            className={classes.textField}
            fullWidth
            label="PIC name"
            name="picName"
            value={formState.values.picName || ''}
            onChange={handleChange}
            type="text"
            variant="outlined"
          />
          <FormControl className={classes.textField} style={{paddingRight:"25px"}}>
            <InputLabel>City</InputLabel>
              <Select
                name="cityId"
                value={formState.values.cityId || ''}
                onChange={handleChange}
                type="text"
              >
                <MenuItem value="">
                  <em>None</em>
                </MenuItem>
                {citys.map(city => (
                  <MenuItem value={city.cityId}>{city.cityName}</MenuItem>
                ))}
              </Select>
            <FormHelperText>Select City</FormHelperText>
          </FormControl>
          <TextField
            className={classes.textField}
            fullWidth
            label="Address"
            name="address"
            value={formState.values.address || ''}
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
              Are You Sure To Create New Branch?
            </Typography>
          </div>
        </DialogContent>
        <DialogActions>
          <Button autoFocus onClick={handleRegisterBranch} color="primary">
            Register Branch
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

UsersToolbar.propTypes = {
  className: PropTypes.string
};

export default UsersToolbar;
