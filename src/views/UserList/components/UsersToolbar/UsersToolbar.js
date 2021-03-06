import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import validate from 'validate.js';
import axios from 'axios';
import { API_BASE_URL } from '../../../../constants'
import { makeStyles } from '@material-ui/styles';
import  { withRouter }  from 'react-router-dom';
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
      minimum: 4,
      maximum: 40
    }
  },
  picPhone: {
    presence: { allowEmpty: false, message: 'is required' },
    length: {
      minimum: 10,
      maximum: 20
    }
  },
  picName: {
    presence: { allowEmpty: false, message: 'is required' },
    length: {
      minimum: 4,
      maximum: 40
    }
  },
  cityId: {
    presence: { allowEmpty: false, message: 'is required' },
  },
  businessType: {
    presence: { allowEmpty: false, message: 'is required' },
    length: {
      minimum: 4,
      maximum: 40
    }
  },
  address: {
    presence: { allowEmpty: false, message: 'is required' },
    length: {
      minimum: 10,
      maximum: 140
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
  const [successMessage, setSuccessMessage] = useState([]);
  const [failMessage, setFailMessage] = useState({});
  const [openFail, setOpenFail] = React.useState(false);
  const [openFailReload, setOpenFailReload] = React.useState(false);
  const [openSuccess, setOpenSuccess] = React.useState(false);
  const [openUnauthorized, setOpenUnauthorized] = React.useState(false);
  const localData = JSON.parse(localStorage.getItem("data"));

  // ====================================== For Create New Branch Dialog  ======================================
  const handleClickOpen = () => {
      axios.get(API_BASE_URL + `/account-service/v1/city/allCity`, {
          headers: {
            'Authorization': `Bearer ${localData}` 
          }
      })
          .then(res => {
              console.log(res) 
              setCitys(res.data);
          })
          .catch(err => {
              console.log(err + localData)
          })
    setOpen(true);
  };

  const hasError = field =>
  formState.touched[field] && formState.errors[field] ? true : false;

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
      console.warn(err)
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
    localStorage.clear();
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
{/* 
      <div className={classes.row}>
        <SearchInput
          className={classes.searchInput}
          placeholder="Search Branch ID"
          style={{paddingLeft:'10px'}}
        />
      </div> */}

      <Dialog onClose={handleClose} aria-labelledby="customized-dialog-title" open={open}>
        <DialogTitle className={classes.dialogTitle} id="customized-dialog-title" onClose={handleClose}>
          <span style={{color: 'white'}}>Add New Branch Account</span>
        </DialogTitle>
        <DialogContent dividers>
          <TextField
            className={classes.textField}
            fullWidth
            label="Branch Account Number"
            name="branchAccountNo"
            error={hasError('branchAccountNo')}
            helperText={
                        hasError('branchAccountNo') ? formState.errors.branchAccountNo[0] : null
            }
            value={formState.values.branchAccountNo || ''}
            onChange={handleChange}
            type="number"
            variant="outlined"
          />
          <TextField
            className={classes.textField}
            fullWidth
            label="Branch Name"
            name="branchName"
            error={hasError('branchName')}
            helperText={
                        hasError('branchName') ? formState.errors.branchName[0] : null
            }
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
            error={hasError('businessType')}
            helperText={
                        hasError('businessType') ? formState.errors.businessType[0] : null
            }
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
            error={hasError('picPhone')}
            helperText={
                        hasError('picPhone') ? formState.errors.picPhone[0] : null
            }
            value={formState.values.picPhone || ''}
            onChange={handleChange}
            type="number"
            variant="outlined"
          />
          <TextField
            className={classes.textField}
            fullWidth
            label="PIC name"
            name="picName"
            error={hasError('picName')}
            helperText={
                        hasError('picName') ? formState.errors.picName[0] : null
            }
            value={formState.values.picName || ''}
            onChange={handleChange}
            type="text"
            variant="outlined"
          />
          <FormControl className={classes.textField} style={{paddingLeft:"10px",paddingRight:"25px"}}>
            <InputLabel
              style={{paddingLeft:"10px",paddingRight:"10px"}}>City
            </InputLabel>
              <Select
                style={{paddingLeft:"10px",paddingRight:"10px"}}
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
            error={hasError('address')}
            helperText={
                        hasError('address') ? formState.errors.address[0] : null
            }
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
          <Button autoFocus onClick={handleRegisterBranch} color="primary"
                  // disabled={!formState.values.verificationCode || !formState.values.address || !formState.values.cityId ||
                  //           !formState.values.picName || !formState.values.picPhone || !formState.values.businessType || 
                  //           !formState.values.branchName || !formState.values.branchAccountNo}
                  disabled={!formState.isValid}
          >
            Register Branch
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

UsersToolbar.propTypes = {
  className: PropTypes.string,
  history: PropTypes.object
};

export default withRouter(UsersToolbar);
