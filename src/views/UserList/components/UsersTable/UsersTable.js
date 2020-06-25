import React, { useState, useEffect } from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import axios from 'axios';
import { API_BASE_URL } from '../../../../constants'
import PerfectScrollbar from 'react-perfect-scrollbar';
import { makeStyles } from '@material-ui/styles';
import UsersTableToolbar from './components/UsersTableToolbar'
import BranchProfile from './components/BranchProfile'
import validate from 'validate.js';

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
    fontWeight: 'bold'
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

const UsersTable = props => {
  const { className, users, history, ...rest } = props;

  const classes = useStyles();
  
  const [passingBranchNo, setPassingBranchNo] = useState();
  const [passingBranchId, setPassingBranchId] = useState();
  const [passingUsername, setPassingUsername] = useState();
  const [branchId, setBranchId] = useState({});
  const [selectedUsers2, setSelectedUsers2] = useState([]);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [page, setPage] = useState(0);
  const [openRow2, setOpenRow2] = React.useState(false);
  const [open2, setOpen2] = React.useState(false);
  const [open3, setOpen3] = React.useState(false);
  const [branchs, setBranchs] = useState([]);
  const [userBranchs, setUserBranchs] = useState([]);
  const localData = JSON.parse(localStorage.getItem("data"));
  

  const user = {
    balance: 'Rp. 10.000.000',
    avatar: '/images/avatars/Picture1.png'
  };

  // ====================================== For Branch Account List  ======================================
  useEffect(() => {
    axios.get(API_BASE_URL + '/mainbranch-service/v1/branch/allBranchProfile', {
        headers: {
          'Authorization': `Bearer ${localData.accessToken}` 
        }
    })
        .then(res => {
            console.log(res) 
            setBranchs(res.data);
        })
        .catch(err => {
            console.log(err + localData.accessToken)
        })
  }, [])
  
  const handlePageChange = (event, page) => {
    setPage(page);
  };

  const handleRowsPerPageChange = event => {
    setRowsPerPage(event.target.value);
  }; 

  // ====================================== Branch User List  ======================================
  const handleRowClick2 = (branchAccountId) => {  
    setBranchId(branchAccountId);
    axios.get(API_BASE_URL + '/login-service/v1/users/allUsers/' + branchAccountId, {
          headers: {
            'Authorization': `Bearer ${localData.accessToken}` 
          }
      })
        .then(res => {
            console.log(res) 
            console.log(branchId);
            setUserBranchs(res.data);
        })
        .catch(err => {
            console.log(err + localData.accessToken)
        })
    setOpenRow2(true);
  };

  const handleRowClose2 = () => {
    setOpenRow2(false);
  };

// ====================================== Deactivate Branch  ======================================
const [formState2, setFormState2] = useState({
  isValid: false,
  values: {},
  touched: {},
  errors: {}
});

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
    url: API_BASE_URL + '/mainbranch-service/v1/branch/deactiveBranch', 
    data: data, 
    headers: {
      'Authorization': `Bearer ${localData.accessToken}`,
      'Content-Type': 'application/json'
    }
  }).then(res =>{
    let statusCode = res.status
    if (statusCode === 200){
      console.log(data)
      alert('Deactivation Success')
      window.location.reload()
    }
  }).catch(err => {
    console.warn(err)
    console.log(data)
    alert('Deactivation Failed')
  })
};

// ====================================== Deactivate User  ======================================
const [formState3, setFormState3] = useState({
  isValid: false,
  values: {},
  touched: {},
  errors: {}
});

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

  setFormState2(formState3 => ({
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
      'Authorization': `Bearer ${localData.accessToken}`,
      'Content-Type': 'application/json'
    }
  }).then(res =>{
    let statusCode = res.status
    if (statusCode === 200){
      console.log(data)
      alert('Deactivation Success')
      window.location.reload()
    }
  }).catch(err => {
    console.warn(err)
    console.log(data)
    alert('Deactivation Failed')
  })
};

// ====================================== Render Side  ======================================

  return (
    <Card
      {...rest}
      className={clsx(classes.root, className)}
    >
      <CardContent className={classes.content}>
        <PerfectScrollbar>
          <div className={classes.inner}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Branch ID</TableCell>
                  <TableCell>Account Number</TableCell>
                  <TableCell>Balance</TableCell>
                  <TableCell>Branch Name</TableCell>
                  <TableCell>Location</TableCell>
                  <TableCell>Action</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {branchs.slice(0, rowsPerPage).map(branch => (
                  <TableRow
                    className={classes.tableRow}
                    key={branch.branchAccountId}
                    onClick={()=>handleRowClick2(branch.branchAccountId)}
              >
                    <TableCell
                      hover
                    >
                      {branch.branchAccountId}
                    </TableCell>
                    <TableCell
                      hover
                    >
                      {branch.branchAccountNo}
                    </TableCell>
                    <TableCell
                      hover
                    >
                      {user.balance} 
                    </TableCell>
                    <TableCell
                      hover
                    >
                      {branch.branchName}
                    </TableCell>
                    <TableCell
                      hover
                    >
                      {branch.cityName}, {branch.address}
                    </TableCell>
                    <TableCell
                      hover
                      key={branch.branchAccountId}
                    >
                      <Button
                        className={classes.deactivateButton}
                        variant="contained"
                        size="small"
                        onClick={()=>handleClickOpen2(branch.branchAccountId, branch.branchAccountNo)}
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
          count={branchs.length}
          onChangePage={handlePageChange}
          onChangeRowsPerPage={handleRowsPerPageChange}
          page={page}
          rowsPerPage={rowsPerPage}
          rowsPerPageOptions={[5, 10, 25]}
        />
      </CardActions>
  
      <Dialog onClose={handleRowClose2} aria-labelledby="customized-dialog-title" open={openRow2} maxWidth = 'lg' fullWidth>
        <DialogTitle className={classes.dialogTitle} id="customized-dialog-title" onClose={handleRowClose2}>
          Branch User Information
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
          count={userBranchs.length}
          onChangePage={handlePageChange}
          onChangeRowsPerPage={handleRowsPerPageChange}
          page={page}
          rowsPerPage={rowsPerPage}
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

      <Dialog onClose={handleClose2} aria-labelledby="customized-dialog-title" open={open2}>
        <DialogTitle className={classes.dialogTitle} id="customized-dialog-title" onClose={handleClose2}>
          Deactivate Branch
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
            value={formState2.values.verificationCode || ''}
            onChange={handleChange2}
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
              Are You Sure Deactivate This Branch?
            </Typography>
          </div>
        </DialogContent>
        <DialogActions>
          <Button autoFocus onClick={handleDeactivateBranch} color="primary">
            Deactivate Branch
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog onClose={handleClose3} aria-labelledby="customized-dialog-title" open={open3}>
        <DialogTitle className={classes.dialogTitle} id="customized-dialog-title" onClose={handleClose3}>
          Deactivate User
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
                  value={formState3.values.verificationCode  || ''}
                  onChange={handleChange3}
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
                    Are You Sure Deactivate This User
                  </Typography>
                </div>
          </DialogContent>
        <DialogActions>
          <Button autoFocus onClick={handleDeactivateUser} color="primary">
            Deactivate User
          </Button>
        </DialogActions>
      </Dialog>
    </Card>

  );
};

UsersTable.propTypes = {
  className: PropTypes.string,
  users: PropTypes.array.isRequired
};

export default UsersTable;