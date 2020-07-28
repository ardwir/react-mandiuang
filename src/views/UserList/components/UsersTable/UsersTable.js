import React, { useState, useEffect } from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import axios from 'axios';
import { API_BASE_URL, API_BASE_UR } from '../../../../constants';
import PerfectScrollbar from 'react-perfect-scrollbar';
import { makeStyles } from '@material-ui/styles';
import UsersTableToolbar from './components/UsersTableToolbar';
import BranchProfile from './components/BranchProfile';
import validate from 'validate.js';
import CurrencyFormat from 'react-currency-format';
import { SearchInput } from 'components';
import  { withRouter }  from 'react-router-dom';

import {
  Button,
  Checkbox, 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions,
  Card,
  CardActions,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TablePagination,
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
  row: {
    height: '42px',
    display: 'flex',
    alignItems: 'center',
    marginTop: theme.spacing(1)
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
  content: {
    padding: 0
  },
  inner: {
    minWidth: 1050
  },
  nameContainer: {
    display: 'flex',
    alignItems: 'center'
  },
  avatar: {
    marginRight: theme.spacing(2)
  },
  actions: {
    justifyContent: 'flex-end'
  },
  deactivateButton: {
    marginRight: theme.spacing(1), 
    backgroundColor: 'red', 
    color: 'white',
    fontSize: '80%'
  },
  confirmDeactivateButton: {
    marginRight: theme.spacing(1), 
    backgroundColor: 'white', 
    color: 'red',
    fontSize: '80%'
  },
  updateButton: {
    marginRight: theme.spacing(1), 
    backgroundColor: '#28B8D7', 
    color: 'white',
    fontSize: '80%'
  },
  confirmUpdateButton: {
    marginRight: theme.spacing(1), 
    backgroundColor: 'white', 
    color: '#28B8D7',
    fontSize: '80%'
  },
  searchInput: {
    marginTop: theme.spacing(2),
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
  },
  searchButton: {
    marginTop: theme.spacing(2),
    marginRight: theme.spacing(1), 
  },
}));

const schema2 = {
  branchAccountId: {
    presence: { allowEmpty: false, message: 'is required' },
  },
  branchAccountNo: {
    presence: { allowEmpty: false, message: 'is required' },
    length: {
      maximum: 10,
      minimum: 10
    }
  },
  updateReason: {
    presence: { allowEmpty: false, message: 'is required' },
    length: {
      minimum: 4,
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

const schema3 = {
  username: {
    presence: { allowEmpty: false, message: 'is required' },
    length: {
      maximum: 40
    }
  },
  updateReason: {
    presence: { allowEmpty: false, message: 'is required' },
    length: {
      minimum: 4,
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

const schema4 = {
  branchAccountNo: {
    presence: { allowEmpty: false, message: 'is required' },
    length: {
      minimum: 10,
      maximum: 10
    }
  },
  newPicName: {
    presence: { allowEmpty: false, message: 'is required' },
    length: {
      minimum: 4,
      maximum: 40
    }
  },
  newPicPhone: {
    presence: { allowEmpty: false, message: 'is required' },
    length: {
      maximum: 40
    }
  },
  newBusinessType: {
    presence: { allowEmpty: false, message: 'is required' },
    length: {
      minimum: 4,
      maximum: 40
    }
  },
  updateReason: {
    presence: { allowEmpty: false, message: 'is required' },
    length: {
      minimum: 6,
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

const UsersTable = props => {
  const { className, users, history, ...rest } = props;

  const classes = useStyles();
  
  const [passingBranchNo, setPassingBranchNo] = useState();
  const [passingBranchId, setPassingBranchId] = useState();
  const [passingUsername, setPassingUsername] = useState();
  const [passingPicName, setPassingPicName] = useState();
  const [passingPicPhone, setPassingPicPhone] = useState();
  const [passingBusinessType, setPassingBusinessType] = useState();
  const [branchId, setBranchId] = useState(0);
  const [selectedUsers2, setSelectedUsers2] = useState([]);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [page, setPage] = useState(0);
  const [rowsPerPage2, setRowsPerPage2] = useState(10);
  const [page2, setPage2] = useState(0);
  const [openRow2, setOpenRow2] = React.useState(false);
  const [open2, setOpen2] = React.useState(false);
  const [open3, setOpen3] = React.useState(false);
  const [open4, setOpen4] = React.useState(false);
  const [successMessage, setSuccessMessage] = useState([]);
  const [failMessage, setFailMessage] = useState({});
  const [openFail, setOpenFail] = React.useState(false);
  const [openFailReload, setOpenFailReload] = React.useState(false);
  const [openUnauthorized, setOpenUnauthorized] = React.useState(false);
  const [openSuccess, setOpenSuccess] = React.useState(false);
  const [branchs, setBranchs] = useState([]);
  const [userBranchs, setUserBranchs] = useState([]);
  const [dataLength, setDataLength] = useState({});
  const [dataLength2, setDataLength2] = useState({});
  const localData = JSON.parse(localStorage.getItem("data"));
  

  // const user = {
  //   balance: 'Rp. 10.000.000',
  //   avatar: '/images/avatars/Picture1.png'
  // };

  // ====================================== Search For Branch Account User List  ======================================
  const [formState6, setFormState6] = useState({
    isValid: false,
    values: {accountName:''},
    touched: {},
    errors: {}
  });

  const handleChange6 = event => {
    event.persist();

    setFormState6(formState6 => ({
      ...formState6,
      values: {
        ...formState6.values,
        [event.target.name]:
          event.target.type === 'checkbox'
            ? event.target.checked
            : event.target.value
      },
      touched: {
        ...formState6.touched,
        [event.target.name]: true
      }
    }));

  };
  
  const handleSearch2 = () => {
    axios.get(API_BASE_URL + '/login-service/v1/users/allUsers/' + branchId + '?page=' + page2 + '&rowsPerPage=' + rowsPerPage2 + '&username=' + (formState6.values.accountName).replace(" ", "%20"), {
      headers: {
        'Authorization': `Bearer ${localData}` 
      }
  })
    .then(res => {
        console.log(res) 
        console.log(branchId);
        setUserBranchs(res.data.listAllusers);
        setDataLength2(res.data.dataCount);
    })
    .catch(err => {
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
      else{
        console.log(err + localData);
      }  
    })
  }
  // ====================================== For Branch Account List  ======================================
  const [formState5, setFormState5] = useState({
    isValid: false,
    values: {accountName:''},
    touched: {},
    errors: {}
  });

  const handleChange5 = event => {
    event.persist();

    setFormState5(formState5 => ({
      ...formState5,
      values: {
        ...formState5.values,
        [event.target.name]:
          event.target.type === 'checkbox'
            ? event.target.checked
            : event.target.value
      },
      touched: {
        ...formState5.touched,
        [event.target.name]: true
      }
    }));

  };
  
  const handleSearch = () => {
    axios.get(API_BASE_URL + '/mainbranch-service/v1/branch/allBranchProfile?page=' + page + '&rowsPerPage=' + rowsPerPage + '&accountName=' + (formState5.values.accountName).replace(" ", "%20"), {
      headers: {
        'Authorization': `Bearer ${localData}` 
      }
    })
      .then(res => {
          console.log(res) 
          setBranchs(res.data.branchAccountList);
          setDataLength(res.data.dataCount);
      })
      .catch(err => {
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
          console.log(err + localData)
        }
      })
  }
  // ====================================== For Branch Account List  ======================================
  useEffect(() => {
    axios.get(API_BASE_URL + '/mainbranch-service/v1/branch/allBranchProfile?page=' + page + '&rowsPerPage=' + rowsPerPage + '&accountName=' + (formState5.values.accountName).replace(" ", "%20"), {
        headers: {
          'Authorization': `Bearer ${localData}` 
        }
    })
        .then(res => {
            console.log(res) 
            setBranchs(res.data.branchAccountList);
            setDataLength(res.data.dataCount);
        })
        .catch(err => {
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
            console.log(err + localData)
          }
        })
  }, [])

  const handleContinueToSignIn = event => {
    history.push('/sign-in');
  }
  
  const handlePageChange = (event, page) => {
    setPage(page);
  };

  const handleRowsPerPageChange = event => {
    setRowsPerPage(event.target.value);
  }; 

  // ====================================== Branch User List  ======================================
  useEffect(()=>{
    axios.get(API_BASE_URL + '/login-service/v1/users/allUsers/' + branchId + '?page=' + page2 + '&rowsPerPage=' + rowsPerPage2 + '&accountName=' + (formState6.values.accountName).replace(" ", "%20"), {
      headers: {
        'Authorization': `Bearer ${localData}` 
      }
  })
    .then(res => {
        console.log(res) 
        console.log(branchId);
        setUserBranchs(res.data.listAllusers);
        setDataLength2(res.data.dataCount);
    })
    .catch(err => {
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
      else{
        console.log(err + localData);
      }  
    })
  },[page2, rowsPerPage2])

  const handleRowClick2 = (branchAccountId) => {  
    setBranchId(branchAccountId);
    axios.get(API_BASE_URL + '/login-service/v1/users/allUsers/' + branchAccountId + '?page=' + page2 + '&rowsPerPage=' + rowsPerPage2 + '&accountName=' + (formState6.values.accountName).replace(" ", "%20"), {
          headers: {
            'Authorization': `Bearer ${localData}` 
          }
      })
        .then(res => {
            console.log(res) 
            console.log(branchId);
            setUserBranchs(res.data.listAllusers);
            setDataLength2(res.data.dataCount);
        })
        .catch(err => {
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
          else{
            console.log(err + localData);
          }  
        })
    setOpenRow2(true);
  };

  const handleRowClose2 = () => {
    setOpenRow2(false);
  };

  const handlePageChange2 = (event, page2) => {
    setPage2(page2);
  };

  const handleRowsPerPageChange2 = event => {
    setRowsPerPage2(event.target.value);
  };
// ====================================== Deactivate Branch  ======================================
const [formState2, setFormState2] = useState({
  isValid: false,
  values: {},
  touched: {},
  errors: {}
});

const hasError2 = field =>
    formState2.touched[field] && formState2.errors[field] ? true : false;

const handleClickOpen2 = (branchIds, branchNo) => {
  setPassingBranchId(branchIds)
  setPassingBranchNo(branchNo)
  setOpen2(true);
};

const handleClose2 = () => {
  setOpen2(false);
};

useEffect(() => {
  const errors = validate(formState2.values, schema2);

  setFormState2(formState2 => ({
    ...formState2,
    isValid: errors ? false : true,
    errors: errors || {}
  }));
}, [formState2.values]);

const handleChange2 = event => {
  event.persist();

  setFormState2(formState2 => ({
    ...formState2,
    values: {
      ...formState2.values,
      [event.target.name]:
        event.target.type === 'checkbox'
          ? event.target.checked
          : event.target.value
    },
    touched: {
      ...formState2.touched,
      [event.target.name]: true
    }
  }));
};

const handleDeactivateBranch = event => {
  event.preventDefault();
  var data = JSON.stringify(
    {
      "branch_account_no": `${formState2.values.branchAccountNo}`,
      "branch_account_id": `${formState2.values.branchAccountId}`,
      "update_reason": `${formState2.values.updateReason}`,
      "verification_code": `${formState2.values.verificationCode}`
    }
  ) 
  
  axios({
    method: 'DELETE', 
    url: API_BASE_URL + '/mainbranch-service/v1/branch/deactivateBranch', 
    data: data, 
    headers: {
      'Authorization': `Bearer ${localData}`,
      'Content-Type': 'application/json'
    }
  }).then(res =>{
    let statusCode = res.status
    if (statusCode === 200){
      console.log(data)
      setSuccessMessage(res.data.message)
      setOpenSuccess(true)
      // alert('Deactivation Success')
      // window.location.reload()
    }
  }).catch(err => {
    console.log(err.response.status);
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
      console.warn(err)
      console.log(data)
      setFailMessage(err.response.data.message)
      setOpenFail(true)
    }
    // alert('Deactivation Failed')
  })
};
// ====================================== Update Branch  ======================================
const [formState4, setFormState4] = useState({
  isValid: false,
  values: {},
  touched: {},
  errors: {}
});

const hasError4 = field =>
    formState4.touched[field] && formState4.errors[field] ? true : false;

const handleClickOpen4 = (branchIds, branchNo, picName, picPhone, businessType) => {
  setPassingBranchId(branchIds);
  setPassingBranchNo(branchNo);
  setPassingPicName(picName);
  setPassingPicPhone(picPhone); 
  setPassingBusinessType(businessType);
  setOpen4(true);
};

const handleClose4 = () => {
  setOpen4(false);
};

useEffect(() => {
  const errors = validate(formState4.values, schema4);

  setFormState4(formState4 => ({
    ...formState4,
    isValid: errors ? false : true,
    errors: errors || {}
  }));
}, [formState4.values]);

const handleChange4 = event => {
  event.persist();

  setFormState4(formState4 => ({
    ...formState4,
    values: {
      ...formState4.values,
      [event.target.name]:
        event.target.type === 'checkbox'
          ? event.target.checked
          : event.target.value
    },
    touched: {
      ...formState4.touched,
      [event.target.name]: true
    }
  }));
};

const handleUpdateBranch = event => {
  event.preventDefault();
  var data = JSON.stringify(
    {
      "branch_account_no": `${formState4.values.branchAccountNo}`,
      "new_pic_phone": `${formState4.values.newPicPhone}`,
      "new_pic_name": `${formState4.values.newPicName}`,
      "new_business_type": `${formState4.values.newBusinessType}`,
      "update_reason": `${formState4.values.updateReason}`,
      "verification_code": `${formState4.values.verificationCode}`
    }
  ) 
  
  axios({
    method: 'PUT', 
    url: API_BASE_URL + '/mainbranch-service/v1/branch/updateBranch', 
    data: data, 
    headers: {
      'Authorization': `Bearer ${localData}`,
      'Content-Type': 'application/json'
    }
  }).then(res =>{
    let statusCode = res.status
    if (statusCode === 202){
      console.log(data)
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
    // alert(err.response.data.message)
  })
};

// ====================================== Deactivate User  ======================================
const [formState3, setFormState3] = useState({
  isValid: false,
  values: {},
  touched: {},
  errors: {}
});

const hasError3 = field =>
    formState3.touched[field] && formState3.errors[field] ? true : false;

const handleClickOpen3 = (branchIds, username) => {
  setPassingBranchId(branchIds)
  setPassingUsername(username)
  setOpen3(true);
};

const handleClose3 = () => {
  setOpen3(false);
};

useEffect(() => {
  const errors = validate(formState3.values, schema3);

  setFormState3(formState3 => ({ // ada Edit disini setFormState2 ke 3
    ...formState3,
    isValid: errors ? false : true,
    errors: errors || {}
  }));
}, [formState3.values]);

const handleChange3 = event => {
  event.persist();

  setFormState3(formState3 => ({
    ...formState3,
    values: {
      ...formState3.values,
      [event.target.name]:
        event.target.type === 'checkbox'
          ? event.target.checked
          : event.target.value
    },
    touched: {
      ...formState3.touched,
      [event.target.name]: true
    }
  }));
};
const handleDeactivateUser = event => {
  event.preventDefault();
  var data = JSON.stringify(
    {
      "username": `${formState3.values.username}`,
      "update_reason": `${formState3.values.updateReason}`,
      "verification_code": `${formState3.values.verificationCode}`
    }
  ) 
  
  axios({
    method: 'DELETE', 
    url: API_BASE_URL + '/login-service/v1/auth/deactivateUser', 
    data: data, 
    headers: {
      'Authorization': `Bearer ${localData}`,
      'Content-Type': 'application/json'
    }
  }).then(res =>{
    let statusCode = res.status
    if (statusCode === 200){
      console.log(data)
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
      setFailMessage(err.responst.data.message)
      setOpenFail(true)
    }
    // alert(err.response.data.message)
  })
};
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
    <Card
      {...rest}
      className={clsx(classes.root, className)}
    >
    {/* // ====================================== List All branch  ====================================== */}
      <CardContent className={classes.content}>
          <div
            className={classes.row}
          >
              <SearchInput
                style={{float: 'left'}}
                className={classes.searchInput}
                placeholder="Search Branch Name"
                name="accountName"
                value={formState5.values.accountName}
                onChange={handleChange5}
              />
              <Button
                style={{float: 'left'}}
                className={classes.searchButton}
                color="primary"
                variant="contained"
                onClick={handleSearch}
              >
                Search
              </Button>
            <span className={classes.flexGrow} />        
          </div>
          <br />
        <PerfectScrollbar>
          <div className={classes.inner}>
            <Table>
              <TableHead>
                <TableRow>
                  {/* <TableCell>Branch ID</TableCell> */}
                  <TableCell>Account Number</TableCell>
                  <TableCell>Branch Name</TableCell>
                  <TableCell>Balance</TableCell>
                  <TableCell>Location</TableCell>
                  <TableCell>Action</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {branchs.slice(0, rowsPerPage).map(branch => (
                  <TableRow
                    className={classes.tableRow}
                    hover
                    key={branch.branchAccountId}
                  >
                    {/* <TableCell
                      hover
                      onClick={()=>handleRowClick2(branch.branchAccountId)}
                    >
                      {branch.branchAccountId}
                    </TableCell> */}
                    <TableCell
                      hover
                      onClick={()=>handleRowClick2(branch.branchAccountId)}
                    >
                      {branch.accountNo}
                    </TableCell>
                    <TableCell
                      hover
                      onClick={()=>handleRowClick2(branch.branchAccountId)}
                    >
                      {branch.branchName}
                    </TableCell>
                    <TableCell
                      hover
                      onClick={()=>handleRowClick2(branch.branchAccountId)}
                      
                    >
                      {<CurrencyFormat value={branch.branchBalance} displayType={'text'} thousandSeparator={true} prefix={'Rp.'} />} 
                    </TableCell>
                    <TableCell
                      hover
                      onClick={()=>handleRowClick2(branch.branchAccountId)}
                    >
                      {branch.location}
                    </TableCell>
                    <TableCell
                      hover
                    >
                      <Button
                        className={classes.deactivateButton}
                        variant="contained"
                        size="small"
                        onClick={()=>handleClickOpen2(branch.branchAccountId, branch.accountNo)}
                      >
                        Deactivate
                      </Button>
                      <Button
                        className={classes.updateButton}
                        variant="contained"
                        size="small"
                        onClick={()=>handleClickOpen4(branch.branchAccountId, branch.accountNo,
                                                branch.picName, branch.picPhone, branch.businessType)}
                      >
                        Update
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </PerfectScrollbar>
      </CardContent>
      <CardActions className={classes.actions}>
        <TablePagination
          component="div"
          count={branchs.length}
          onChangePage={handlePageChange}
          onChangeRowsPerPage={handleRowsPerPageChange}
          page={page}
          rowsPerPage={rowsPerPage}
          rowsPerPageOptions={[5, 10, 25]}
        />
      </CardActions>

  {/* // ====================================== List All User in Branch  ====================================== */}
      <Dialog onClose={handleRowClose2} aria-labelledby="customized-dialog-title" open={openRow2} maxWidth = 'lg' fullWidth>
        <DialogTitle className={classes.dialogTitle} id="customized-dialog-title" onClose={handleRowClose2}>
          <span style={{color: 'white'}}>Branch User Information</span>
        </DialogTitle>
        <DialogContent dividers>
          <CardContent className={classes.content}>
            <PerfectScrollbar>
          <div className={classes.inner}>
            <BranchProfile branchId={branchId}/>
          </div>
          <div className={classes.inner}>
            <UsersTableToolbar branchId={branchId}/>
          </div>
          <div
            className={classes.row}
          >
              <SearchInput
                style={{float: 'left'}}
                className={classes.searchInput}
                placeholder="Search Username"
                name="accountName"
                value={formState6.values.accountName}
                onChange={handleChange6}
              />
              <Button
                style={{float: 'left'}}
                className={classes.searchButton}
                color="primary"
                variant="contained"
                onClick={handleSearch2}
              >
                Search
              </Button>
            <span className={classes.flexGrow} />        
          </div>
          <br />
          <div className={classes.inner}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Username</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>Phone</TableCell>
                  <TableCell>Action</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {userBranchs.slice(0, rowsPerPage).map(userBranch => (
                  <TableRow
                    className={classes.tableRow}
                    hover
                    key={userBranch.id}
                    selected={selectedUsers2.indexOf(userBranch.id) !== -1}
                  >
                    <TableCell
                      hover
                    >
                      {userBranch.username}
                    </TableCell>
                    <TableCell
                      hover
                    >
                      {userBranch.email}
                    </TableCell>
                    <TableCell
                      hover
                    >
                      {userBranch.phoneNumber}
                    </TableCell>
                    <TableCell
                      hover
                    >
                      <Button
                        className={classes.deactivateButton}
                        variant="contained"
                        size="small"
                        onClick={()=>handleClickOpen3(userBranch.branchIdWork, userBranch.username)}
                      >
                        Deactivate
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </PerfectScrollbar>
      </CardContent>
      <CardActions className={classes.actions}>
        <TablePagination
          component="div"
          count={dataLength2}
          onChangePage={handlePageChange2}
          onChangeRowsPerPage={handleRowsPerPageChange2}
          page={page2}
          rowsPerPage={rowsPerPage2}
          rowsPerPageOptions={[5, 10, 25]}
        />
      </CardActions>
    </DialogContent>
        <DialogActions>
          <Button autoFocus onClick={handleRowClose2} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>

{/* // ====================================== Deactive Branch Dialog  ====================================== */}
      <Dialog onClose={handleClose2} aria-labelledby="customized-dialog-title" open={open2}>
        <DialogTitle className={classes.dialogTitle} id="customized-dialog-title" onClose={handleClose2}>
          <span style={{color: 'white'}}>Deactivate Branch</span>
        </DialogTitle>
        <DialogContent dividers>
          <TextField
            disabled
            className={classes.textField}
            fullWidth
            label="Branch ID"
            name="branchAccountId"
            value={formState2.values.branchAccountId = `${passingBranchId}` || `${passingBranchId}`}
            onChange={handleChange2}
            type="text"
            variant="outlined"
          />
          <TextField
            disabled
            className={classes.textField}
            fullWidth
            label="Branch Account Number"
            name="branchAccountNumber"
            onChange={handleChange2}
            value={formState2.values.branchAccountNo = `${passingBranchNo}` || `${passingBranchNo}`}
            type="text"
            variant="outlined"
          />
          <TextField
            className={classes.textField}
            fullWidth             
            label="Reason"
            name="updateReason"
            error={hasError2('updateReason')}
            helperText={
                        hasError2('updateReason') ? formState2.errors.updateReason[0] : null
            }
            value={formState2.values.updateReason || ''}
            onChange={handleChange2}
            type="text"
            variant="outlined"
          />
          <TextField
            className={classes.textField}
            fullWidth
            label="Verification Code"
            name="verificationCode"
            error={hasError2('verificationCode')}
            helperText={
                        hasError2('verificationCode') ? formState2.errors.verificationCode[0] : null
            }
            value={formState2.values.verificationCode || ''}
            onChange={handleChange2}
            type="password"
            variant="outlined"
          />
        </DialogContent>
        <DialogActions>
          <Button className={classes.confirmDeactivateButton} autoFocus onClick={handleDeactivateBranch} color="primary"
                  // disabled={!formState2.values.verificationCode || !formState2.values.updateReason}
                  disabled={!formState2.isValid}
          >
            Deactivate Branch
          </Button>
        </DialogActions>
      </Dialog>

  {/* // ====================================== Update Branch Dialog  ====================================== */}
      <Dialog onClose={handleClose4} aria-labelledby="customized-dialog-title" open={open4}>
        <DialogTitle className={classes.dialogTitle} id="customized-dialog-title" onClose={handleClose4}>
          <span style={{color: 'white'}}>Update Branch</span>
        </DialogTitle>
        <DialogContent dividers>
        <span className={classes.textField} style={{color: 'red'}}>*Update Only If Necessary</span>
          <TextField
            disabled
            className={classes.textField}
            fullWidth
            label="Branch ID"
            name="branchAccountId"
            value={`${passingBranchId}`}
            onChange={handleChange4}
            type="text"
            variant="outlined"
          />
          <TextField
            disabled
            className={classes.textField}
            fullWidth
            label="Branch Account Number"
            name="branchAccountNo"
            value={formState4.values.branchAccountNo = `${passingBranchNo}` || `${passingBranchNo}`}
            onChange={handleChange4}
            type="text"
            variant="outlined"
          />
          <TextField
            className={classes.textField}
            fullWidth             
            label="New PIC Name"
            name="newPicName"
            error={hasError4('newPicName')}
            helperText={
                        hasError4('newPicName') ? formState4.errors.newPicName[0] : null
            }
            value={formState4.values.newPicName}
            onChange={handleChange4}
            placeholder={passingPicName}
            type="text"
            variant="outlined"
          />
          <TextField
            className={classes.textField}
            fullWidth             
            label="New PIC Phone"
            name="newPicPhone"
            error={hasError4('newPicPhone')}
            helperText={
                        hasError4('newPicPhone') ? formState4.errors.newPicPhone[0] : null
            }
            value={formState4.values.newPicPhone}
            onChange={handleChange4}
            placeholder={passingPicPhone}
            type="text"
            variant="outlined"
          />
          <TextField
            className={classes.textField}
            fullWidth             
            label="New Business Type"
            name="newBusinessType"
            error={hasError4('newBusinessType')}
            helperText={
                        hasError4('newBusinessType') ? formState4.errors.newBusinessType[0] : null
            }
            value={formState4.values.newBusinessType}
            onChange={handleChange4}
            placeholder={passingBusinessType}
            type="text"
            variant="outlined"
          />
          <TextField
            className={classes.textField}
            fullWidth             
            label="Update Reason"
            name="updateReason"
            error={hasError4('updateReason')}
            helperText={
                        hasError4('updateReason') ? formState4.errors.updateReason[0] : null
            }
            value={formState4.values.updateReason || ''}
            onChange={handleChange4}
            type="text"
            variant="outlined"
          />
          <TextField
            className={classes.textField}
            fullWidth
            label="Verification Code"
            name="verificationCode"
            error={hasError4('verificationCode')}
            helperText={
                        hasError4('verificationCode') ? formState4.errors.verificationCode[0] : null
            }
            value={formState4.values.verificationCode || ''}
            onChange={handleChange4}
            type="password"
            variant="outlined"
          />
        </DialogContent>
        <DialogActions>
          <Button className={classes.confirmUpdateButton} autoFocus onClick={handleUpdateBranch} color="primary"
                  // disabled={!formState4.values.verificationCode || !formState4.values.updateReason || !formState4.values.newBusinessType || 
                            // !formState4.values.newPicPhone || !formState4.values.newPicName}
                  disabled={!formState4.isValid}
          >        
            Update Branch
          </Button>
        </DialogActions>
      </Dialog>

{/* // ====================================== Deactive User Dialog  ====================================== */}
      <Dialog onClose={handleClose3} aria-labelledby="customized-dialog-title" open={open3}>
        <DialogTitle className={classes.dialogTitle} id="customized-dialog-title" onClose={handleClose3}>
          <span style={{color: 'white'}}>Deactivate User</span>
        </DialogTitle>
        <DialogContent dividers>
          <TextField
                  disabled
                  className={classes.textField}
                  fullWidth
                  label="Branch ID"
                  name="branchAccountId"
                  value={`${passingBranchId}`}
                  onChange={handleChange3}
                  type="text"
                  variant="outlined"
                  
                />
                <TextField
                  disabled
                  className={classes.textField}
                  fullWidth
                  label="Username"
                  name="username"
                  value={formState3.values.username = `${passingUsername}` || `${passingUsername}`}
                  onChange={handleChange3}
                  type="text"
                  variant="outlined"
                />
                <TextField
                  className={classes.textField}
                  fullWidth             
                  label="Reason"
                  name="updateReason"
                  error={hasError3('updateReason')}
                  helperText={
                        hasError3('updateReason') ? formState3.errors.updateReason[0] : null
                  }
                  value={formState3.values.updateReason || ''}
                  onChange={handleChange3}
                  type="text"
                  variant="outlined"
                />
                <TextField
                  className={classes.textField}
                  fullWidth
                  label="Verification Code"
                  name="verificationCode"
                  error={hasError3('verificationCode')}
                  helperText={
                        hasError3('verificationCode') ? formState3.errors.verificationCode[0] : null
                  }
                  value={formState3.values.verificationCode  || ''}
                  onChange={handleChange3}
                  type="password"
                  variant="outlined"
                />
          </DialogContent>
        <DialogActions>
          <Button className={classes.confirmDeactivateButton} autoFocus onClick={handleDeactivateUser} color="primary"
                  // disabled={!formState3.values.verificationCode || !formState3.values.updateReason }
                  disabled={!formState3.isValid}
          >
            Deactivate User
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
    </Card>

  );
};

UsersTable.propTypes = {
  className: PropTypes.string,
  users: PropTypes.array.isRequired,
  history: PropTypes.object
};

export default withRouter(UsersTable);