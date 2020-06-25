import React, { useState } from 'react';
import clsx from 'clsx';
import moment from 'moment';
import PerfectScrollbar from 'react-perfect-scrollbar';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/styles';
import BranchProfile from './components';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import {
  Button,
  Card,
  CardActions,
  CardHeader,
  CardContent,
  Checkbox,
  Dialog,
  DialogActions,
  DialogTitle,
  DialogContent,
  Divider,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  Tooltip,
  TableSortLabel,
  TablePagination,
  Typography
} from '@material-ui/core';

import mockData from './data';
import { StatusBullet } from 'components';

const useStyles = makeStyles(theme => ({
  root: {},
  deactivateButton: {
    marginRight: theme.spacing(1), 
    backgroundColor: 'white', 
    color: 'red'
  },
  approveButton: {
    marginRight: theme.spacing(1), 
    backgroundColor: 'white', 
    color: 'primary'
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
  statusContainer: {
    display: 'flex',
    alignItems: 'center'
  },
  status: {
    marginRight: theme.spacing(1)
  },
}));

const statusColors = {
  done: 'success',
  pending: 'info',
  rejected: 'danger'
};


const BudgetRequestTable = props => {
  const { className, ...rest } = props;

  const classes = useStyles();

  const [requests] = useState(mockData);
  
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [page, setPage] = useState(0);
  const [openRow, setOpenRow] = React.useState(false);
  const [open, setOpen] = React.useState(false);
  
  const handleBack = () => {
    setOpen(false);
  };

  const handleRowClick = () => {
    setOpenRow(true);
  };

  const handleRowClose = () => {
    setOpenRow(false);
  };

  const handleClickOpen = () => {
    setOpen(true); 
  }

  const handleClickClose = () => {
    setOpen(false);
    setOpenRow(false);
  }

  const handlePageChange = (event, page) => {
    setPage(page);
  };
  
  const handleRowsPerPageChange = event => {
    setRowsPerPage(event.target.value);
  };
  
  return (
    <Card
      {...rest}
      className={clsx(classes.root, className)}
    >
      <CardHeader
        title="Budget Request"
      />
      <Divider />
      <CardContent className={classes.content}>
        <PerfectScrollbar>
          <div className={classes.inner}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Request ID</TableCell>
                  <TableCell>Branch ID</TableCell>
                  <TableCell>Branch Name</TableCell>
                  <TableCell>Request Amount</TableCell>
                  <TableCell sortDirection="desc">
                    <Tooltip
                      enterDelay={300}
                      title="Sort"
                    >
                      <TableSortLabel
                        active
                        direction="desc"
                      >
                        Request Date
                      </TableSortLabel>
                    </Tooltip>
                  </TableCell>
                  <TableCell>Status</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {requests.map(request => (
                  <TableRow
                    hover
                    key={request.id}
                    onClick={()=>handleRowClick(request.id)}
                  >
                    <TableCell>{request.ref}</TableCell>
                    <TableCell>{request.branch.ids}</TableCell>
                    <TableCell>{request.branch.name}</TableCell>
                    <TableCell>{request.amount}</TableCell>
                    <TableCell>
                      {moment(request.createdAt).format('DD/MM/YYYY')}
                    </TableCell>
                    <TableCell>
                      <div className={classes.statusContainer}>
                        <StatusBullet
                          className={classes.status}
                          color={statusColors[request.status]}
                          size="sm"
                        />
                        {request.status}
                      </div>
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
          count={requests.length}
          onChangePage={handlePageChange}
          onChangeRowsPerPage={handleRowsPerPageChange}
          page={page}
          rowsPerPage={rowsPerPage}
          rowsPerPageOptions={[5, 10, 25]}
        />
      </CardActions>
      <Divider />

      <Dialog onClose={handleRowClose} aria-labelledby="customized-dialog-title" open={openRow} maxWidth = 'lg' fullWidth>
        <DialogTitle id="customized-dialog-title" onClose={handleRowClose}>
          Budget Approval
        </DialogTitle>
        <DialogContent dividers>
          <CardContent className={classes.content}>
            <PerfectScrollbar>
              <div className={classes.inner}>
                <BranchProfile />
              </div>
              <TextField
                disabled
                className={classes.textField}
                fullWidth
                label="Branch ID"
                name="branchId"
                type="text"
                variant="outlined"
                value="100"
              />
              <TextField
                disabled
                className={classes.textField}
                fullWidth
                label="Branch Account Number"
                name="branchAccountNumber"
                type="text"
                variant="outlined"
                value='1234567890'
              />
              <TextField
                disabled
                className={classes.textField}
                fullWidth
                label="Requested Amount"
                name="requestedAmount"
                type="text"
                variant="outlined"
                value='Rp. 10.000.000'
              />
              <TextField
                disabled
                className={classes.textField}
                fullWidth
                label="Requested By"
                name="requestedBy"
                type="text"
                variant="outlined"
                value='TEST123456'
              />
              <TextField
                className={classes.textField}
                fullWidth
                label="Amount Approved"
                name="Approved"
                type="number"
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
                  Are You Sure Approve Budget Request From This Branch ?
                </Typography>
              </div>
            </PerfectScrollbar>
          </CardContent>
        </DialogContent>
        <DialogActions>
          <Button 
            className={classes.approveButton}
            autoFocus onClick={handleRowClose} color="primary"
          >
            Approve Request
          </Button>
          
          <Button
          className={classes.deactivateButton}
          autoFocus onClick={handleClickOpen}
          >
            Reject Request
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog onClose={handleClickClose} aria-labelledby="customized-dialog-title" open={open} maxWidth = 'lg' fullWidth>
        <DialogTitle id="customized-dialog-title" onClose={handleClickClose}>
        <IconButton onClick={handleBack}>
          <ArrowBackIcon />
        </IconButton>
          Reject Confirmation
        </DialogTitle>
        <DialogContent dividers>
          <CardContent className={classes.content}>
            <PerfectScrollbar>
              <div className={classes.inner}>
                <BranchProfile />
              </div>
              <TextField
                disabled
                className={classes.textField}
                fullWidth
                label="Branch ID"
                name="branchId"
                type="text"
                variant="outlined"
                value="100"
              />
              <TextField
                disabled
                className={classes.textField}
                fullWidth
                label="Branch Account Number"
                name="branchAccountNumber"
                type="text"
                variant="outlined"
                value='1234567890'
              />
              <TextField
                disabled
                className={classes.textField}
                fullWidth
                label="Requested Amount"
                name="requestedAmount"
                type="text"
                variant="outlined"
                value='Rp. 10.000.000'
              />
              <TextField
                disabled
                className={classes.textField}
                fullWidth
                label="Requested By"
                name="requestedBy"
                type="text"
                variant="outlined"
                value='TEST123456'
              />
              <TextField
                className={classes.textField}
                fullWidth             
                label="Reason"
                name="rejectReason"
                type="text"
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
                  Are You Sure To Reject Request From This Branch ?
                </Typography>
              </div>
            </PerfectScrollbar>
          </CardContent>
        </DialogContent>
        <DialogActions>
          <Button
          className={classes.deactivateButton}
          autoFocus onClick={handleClickClose}
          >
            Confirm Rejection
          </Button>
        </DialogActions>
      </Dialog>
    </Card>
  );
};

BudgetRequestTable.propTypes = {
  className: PropTypes.string
};

export default BudgetRequestTable;
