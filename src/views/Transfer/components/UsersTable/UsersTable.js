import React, { useState, useEffect } from 'react';
import clsx from 'clsx';
import axios from 'axios';
import { API_BASE_URL } from '../../../../constants'
import PropTypes from 'prop-types';
import PerfectScrollbar from 'react-perfect-scrollbar';
import { makeStyles } from '@material-ui/styles';
import BranchProfile from './components/BranchProfile';
import "react-datepicker/dist/react-datepicker.css";
import validate from 'validate.js';

import {
  AppBar, 
  Tabs, 
  Tab,
  Box,
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
  TextField,
  Typography,
  TablePagination, 
  FormControl,
  InputLabel, 
  Select, 
  MenuItem,
  FormHelperText
} from '@material-ui/core';

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box p={3}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired,
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

const useStyles = makeStyles(theme => ({
  root: {},
  dialogTitle: {
    backgroundColor: '#00A479',
    color: '#FFFFFF',
    fontWeight: 'bold',
    boxShadow: '1px 3px 1px'
  },
  tabs: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.paper,
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
  }
}));

const schema = {
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
  transferType: {
    presence: { allowEmpty: false, message: 'is required' },
    length: {
      maximum: 140
    }
  },
  transferAmount: {
    presence: { allowEmpty: false, message: 'is required' },
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
  
  const { className, users, ...rest } = props;

  const classes = useStyles();

  const [branchId, setBranchId] = useState({});
  const [branchAcctNo, setBranchAcctNo] = useState({}); 
  const [branchs, setBranchs] = useState([]);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [page, setPage] = useState(0);
  const [openRow2, setOpenRow2] = React.useState(false);
  const [value, setValue] = React.useState(0);
  const [date, setDate] = React.useState('');
  const [month, setMonth] = React.useState('');
  const localData = JSON.parse(localStorage.getItem("data"));

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
  }, []);

  const handlePageChange = (event, page) => {
    setPage(page);
  };

  const handleRowsPerPageChange = event => {
    setRowsPerPage(event.target.value);
  };

  // ====================================== Main To Branch Trx ======================================
const [formState, setFormState] = useState({
  isValid: false,
  values: {},
  touched: {},
  errors: {}
});
const handleChange = (event, newValue) => {
  setValue(newValue);
};

const handleChange3 = (event) => {
  setMonth(event.target.value);
};

const handleChange2 = (event) => {
  setDate(event.target.value);
};

// open dialog transfer
const handleRowClick2 = (branchAccountId, branchAcctNo) => {
  setBranchId(branchAccountId);
  setBranchAcctNo(branchAcctNo);
  setOpenRow2(true);
};
// close dialog transfer
const handleRowClose2 = () => {
  setOpenRow2(false);
};

useEffect(() => {
  const errors = validate(formState.values, schema);

  setFormState(formState => ({
    ...formState,
    isValid: errors ? false : true,
    errors: errors || {}
  }));
}, [formState.values]);

const handleChangeTransfer = event => {
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

const handleTrxMainToBranch = event => {
  event.preventDefault();
  var data = JSON.stringify(
    {
      "transfer_to_acct": `${formState.values.branchAccountNo}`,
      "branch_account_id": `${formState.values.branchAccountId}`,
      "transfer_type": "Immediately",
      "trx_amount": `${formState.values.transferAmount}`,
      "verification_code": `${formState.values.verificationCode}`
    }
  ) 
  
  axios({
    method: 'POST', 
    url: API_BASE_URL + '/trx-service/v1/transactionMain/trxMainToBranch', 
    data: data, 
    headers: {
      'Authorization': `Bearer ${localData.accessToken}`,
      'Content-Type': 'application/json'
    }
  }).then(res =>{
    let statusCode = res.status
    if (statusCode === 202){
      console.log(data)
      alert('Main To Branch Transfer Success')
      window.location.reload()
    }
  }).catch(err => {
    console.warn(err)
    console.log(data)
    alert('Deactivation Failed')
  })
};
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
                  <TableCell>Status</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {branchs.slice(0, rowsPerPage).map(branch => (
                  <TableRow
                    className={classes.tableRow}
                    hover
                    key={branch.branchAccountId}
                    onClick={()=>handleRowClick2(branch.branchAccountId, branch.branchAccountNo)}
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
                      {branch.branchBalance}
                    </TableCell>
                    <TableCell
                      hover
                    >
                      {branch.branchName}
                    </TableCell>
                    <TableCell
                      hover
                    >
                      Active
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
          count={users.length}
          onChangePage={handlePageChange}
          onChangeRowsPerPage={handleRowsPerPageChange}
          page={page}
          rowsPerPage={rowsPerPage}
          rowsPerPageOptions={[5, 10, 25]}
        />
      </CardActions>
  
      <Dialog onClose={handleRowClose2} aria-labelledby="customized-dialog-title" open={openRow2} maxWidth = 'lg' fullWidth>
        <DialogTitle className={classes.dialogTitle} id="customized-dialog-title" onClose={handleRowClose2}>
          <span style={{color: 'white'}}>Transfer To Branch</span>
        </DialogTitle>
        <DialogContent dividers>
          <CardContent className={classes.content}>
            <PerfectScrollbar>
          <div className={classes.inner}>
            <BranchProfile branchId={branchId} />
          </div>
          <AppBar position="static">
            <Tabs value={value} onChange={handleChange} aria-label="simple tabs example">
              <Tab label="Immediately" {...a11yProps(0)} />
              <Tab label="Post Date" {...a11yProps(1)} />
              <Tab label="Scheduled" {...a11yProps(2)} />
            </Tabs>
          </AppBar>
          <TabPanel value={value} index={0}>
            <TextField
              disabled
              className={classes.textField}
              fullWidth
              label="Branch ID"
              name="branchAccountId"
              value={formState.values.branchAccountId = `${branchId}` || `${branchId}`}
              onChange={handleChangeTransfer}
              type="text"
              variant="outlined"
            />
            <TextField
              disabled
              className={classes.textField}
              fullWidth
              label="Branch Account Number"
              name="branchAccountNo"
              value={formState.values.branchAccountNo = `${branchAcctNo}` || `${branchAcctNo}`}
              onChange={handleChangeTransfer}
              type="text"
              variant="outlined"
            />
            <TextField
              className={classes.textField}
              fullWidth
              label="Transfer Amount"
              name="transferAmount"
              value={formState.values.transferAmount || ''}
              onChange={handleChangeTransfer}
              type="text"
              variant="outlined"
            />
            <TextField
              className={classes.textField}
              fullWidth
              label="Verification Code"
              name="verificationCode"
              value={formState.values.verificationCode || ''}
              onChange={handleChangeTransfer}
              type="password"
              variant="outlined"
            />
            <div className={classes.agreement}>
              <Checkbox
                className={classes.agreementCheckbox}
                color="primary"
                name="agreement"
                style={{paddingLeft:'15px'}}
              />
              <Typography
                color="textSecondary"
                variant="body1"
              >
                Are You Sure To Tranfer To This Branch ?
              </Typography>
            </div>
          </TabPanel>

          <TabPanel value={value} index={1}>
            <TextField
              disabled
              className={classes.textField}
              fullWidth
              label="Branch ID"
              name="branchId"
              type="text"
              variant="outlined"
              value={`${branchId}`}
            />
            <TextField
              disabled
              className={classes.textField}
              fullWidth
              label="Branch Account Number"
              name="branchAccountNumber"
              type="text"
              variant="outlined"
              value={`${branchAcctNo}`}
            />
            <TextField
              className={classes.textField}
              fullWidth
              label="Transfer Amount"
              name="transferAmount"
              type="text"
              variant="outlined"
            />
            <TextField
              className={classes.textField}
              fullWidth
              // label="Date"
              name="postDate"
              type="date"
              variant="outlined"
            />
            <TextField
              className={classes.textField}
              fullWidth
              label="Verification Code"
              name="verificationCode"
              type="password"
              variant="outlined"
            />
            <div className={classes.agreement}>
              <Checkbox
                className={classes.agreementCheckbox}
                color="primary"
                name="agreement"
                style={{paddingLeft:'15px'}}
              />
              <Typography
                color="textSecondary"
                variant="body1"
              >
                Are You Sure To Tranfer To This Branch ?
              </Typography>
            </div>
          </TabPanel>

          <TabPanel value={value} index={2}>
            <TextField
              disabled
              className={classes.textField}
              fullWidth
              label="Branch ID"
              name="branchId"
              type="text"
              variant="outlined"
              value={`${branchId}`}
            />
            <TextField
              disabled
              className={classes.textField}
              fullWidth
              label="Branch Account Number"
              name="branchAccountNumber"
              type="text"
              variant="outlined"
              value={`${branchAcctNo}`}
            />
            <TextField
              className={classes.textField}
              fullWidth
              label="Transfer Amount"
              name="transferAmount"
              type="text"
              variant="outlined"
            />
            <FormControl className={classes.textField} style={{paddingRight:"25px"}}>
              <InputLabel id="demo-simple-select-helper-label">Date Transfer</InputLabel>
              <Select
                labelId="demo-simple-select-helper-label"
                id="demo-simple-select-helper"
                value={date}
                onChange={handleChange2}
              >
                <MenuItem value="">
                  <em>None</em>
                </MenuItem>
                <MenuItem value={1}>1</MenuItem>
                <MenuItem value={2}>2</MenuItem>
                <MenuItem value={3}>3</MenuItem>
                <MenuItem value={4}>4</MenuItem>
                <MenuItem value={5}>5</MenuItem>
                <MenuItem value={6}>6</MenuItem>
                <MenuItem value={7}>7</MenuItem>
                <MenuItem value={8}>8</MenuItem>
                <MenuItem value={9}>9</MenuItem>
                <MenuItem value={10}>10</MenuItem>
                <MenuItem value={11}>11</MenuItem>
                <MenuItem value={12}>12</MenuItem>
                <MenuItem value={13}>13</MenuItem>
                <MenuItem value={14}>14</MenuItem>
                <MenuItem value={15}>15</MenuItem>
                <MenuItem value={16}>16</MenuItem>
                <MenuItem value={17}>17</MenuItem>
                <MenuItem value={18}>18</MenuItem>
                <MenuItem value={19}>19</MenuItem>
                <MenuItem value={20}>20</MenuItem>
                <MenuItem value={21}>21</MenuItem>
                <MenuItem value={22}>22</MenuItem>
                <MenuItem value={23}>23</MenuItem>
                <MenuItem value={24}>24</MenuItem>
                <MenuItem value={25}>25</MenuItem>
                <MenuItem value={26}>26</MenuItem>
                <MenuItem value={27}>27</MenuItem>
                <MenuItem value={28}>28</MenuItem>
                <MenuItem value={29}>29</MenuItem>
                <MenuItem value={30}>30</MenuItem>
              </Select>
              <FormHelperText>Transfer On Every x Date</FormHelperText>
            </FormControl>
            <FormControl className={classes.textField} style={{paddingRight:"25px"}}>
              <InputLabel id="demo-simple-select-helper-label">Transfer Frequency</InputLabel>
              <Select
                labelId="demo-simple-select-helper-label"
                id="demo-simple-select-helper"
                value={month}
                onChange={handleChange3}
              >
                <MenuItem value="">
                  <em>None</em>
                </MenuItem>
                <MenuItem value={1}>One Month</MenuItem>
                <MenuItem value={2}>Two Months</MenuItem>
                <MenuItem value={3}>Three Months</MenuItem>
                <MenuItem value={4}>Four Months</MenuItem>
                <MenuItem value={6}>Six Months</MenuItem>
                <MenuItem value={12}>Twelve Months</MenuItem>
              </Select>
              <FormHelperText>Transfer For Every x Month</FormHelperText>
            </FormControl>
            <FormControl className={classes.textField} style={{paddingRight:"25px"}}>
              {/* <InputLabel id="demo-simple-select-helper-label">Transfer Frequency</InputLabel> */}
              <TextField
                className={classes.textField}
                fullWidth
                label="Repetition"
                name="repetition Number"
                type="number"
                variant="outlined"
              />
            </FormControl>
            <TextField
              className={classes.textField}
              fullWidth
              label="Verification Code"
              name="verificationCode"
              type="password"
              variant="outlined"
            />
            <div className={classes.agreement}>
              <Checkbox
                className={classes.agreementCheckbox}
                color="primary"
                name="agreement"
                style={{paddingLeft:'15px'}}
              />
              <Typography
                color="textSecondary"
                variant="body1"
              >
                Are You Sure To Tranfer To This Branch ?
              </Typography>
            </div>
          </TabPanel>
        </PerfectScrollbar>
      </CardContent>
    </DialogContent>

        <DialogActions>
          <Button 
            autoFocus onClick={handleTrxMainToBranch} color="primary" 
            style={{paddingRight:"15px"}}
          >
            Confirm Transfer
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