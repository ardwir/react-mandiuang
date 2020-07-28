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

// const schema = {
//   oldPassword: {
//     presence: { allowEmpty: false, message: 'minimum 6 characters' },
//     length: {
//       minimum: 6,
//       maximum: 20
//     }
//   },
//   password: {
//     presence: { allowEmpty: false, message: 'is required' },
//     length: {
//       minimum: 6,
//       maximum: 20
//     }
//   },
//   confirmPassword: {
//     presence: { allowEmpty: false, message: 'is required' },
//     length: {
//       minimum: 6,
//       maximum: 20
//     }
//   }
// };

const ImportData = props => {
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

//   const hasError = field =>
//     formState.touched[field] && formState.errors[field] ? true : false;

//   useEffect(() => {
//     const errors = validate(formState.values, schema);

//     setFormState(formState => ({
//       ...formState,
//       isValid: errors ? false : true,
//       errors: errors || {}
//     }));
//   }, [formState.values]);
  
//   const handleChange = event => {
//     event.persist();

//     setFormState(formState => ({
//       ...formState,
//       values: {
//         ...formState.values,
//         [event.target.name]:
//           event.target.type === 'checkbox'
//             ? event.target.checked
//             : event.target.value
//       },
//       touched: {
//         ...formState.touched,
//         [event.target.name]: true
//       }
//     }));

//   };
//   const handleChangePassword = event => {
//     event.preventDefault();
//     var data = JSON.stringify(
//       {
//         "old_password": `${formState.values.oldPassword}`,
//         "new_password": `${formState.values.password}`,
//       }
//     ) 
    
//     axios({
//       method: 'PUT', 
//       url: API_BASE_URL + '/login-service/v1/auth/updatePassword', 
//       data: data, 
//       headers: {
//         'Authorization': `Bearer ${localData}`,
//         'Content-Type': 'application/json'
//       }
//     }).then(res =>{
//       let statusCode = res.status
//       if (statusCode === 202){
//         setSuccessMessage(res.data.message)
//         setOpenSuccess(true)
//         // alert(res.data.message)
//         // window.location.reload()
//       }
//     }).catch(err => {
//       console.log(data)
//       if (!err.response){
//         axios.get(API_BASE_URL + '/login-service/v1/auth/logout', {
//           headers: {
//             'Authorization': `Bearer ${localData}` 
//           }
//         })
//         .then(res => {
//           console.log(res);
//           console.log(res.data.message);
//           setFailMessage("Connection Error");
//           localStorage.clear();
//           setOpenUnauthorized(true);       
//         })
//         .catch(err => {
//           console.log(err + localData);
//         })
//       }
//       else if (err.response.status === 401){
//         setFailMessage("Unauthorized Access");
//         localStorage.clear();
//         setOpenUnauthorized(true);
//       }
//       else {
//         setFailMessage(err.response.data.message)
//         setOpenFail(true)
//       }
//     })
    
//   };

//   const handleContinueToSignIn = event => {
//     history.push('/sign-in');
//   }

  // =================================================== API Response =================================================
//   const handleCloseSuccess = () => {
//     setOpenSuccess(false);
//     window.location.reload()
//   }

//   const handleCloseFail = () => {
//     setOpenFail(false);
//   }


  // =================================================== Reserverd =================================================
  const handleOpenSuccess = () => {
      
  }
// =================================================== Render Side =================================================
  return (
    <Card
      {...rest}
      className={clsx(classes.root, className)}
    >
      <form>
        <CardHeader
          subheader="Update Your Previous Data Of Transaction"
          title="Forecasting"
        />
        <Divider />
        <Divider />
        <CardActions>
          <Button 
          autoFocus onClick={handleOpenSuccess} color="primary">
            Upload Data
          </Button>
        </CardActions>
      </form>
    </Card>
  );
};

ImportData.propTypes = {
  className: PropTypes.string,
  history: PropTypes.object
};

export default withRouter(ImportData);
