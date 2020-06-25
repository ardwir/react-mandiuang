import React, { useState } from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import moment from 'moment';
import PerfectScrollbar from 'react-perfect-scrollbar';
import { makeStyles } from '@material-ui/styles';
import mockData2 from '../../data-user'
import UsersTableToolbar from './components/UsersTableToolbar'
import BranchProfile from './components/BranchProfile'

import {
  Button, 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions,
  Card,
  CardActions,
  CardContent,
  Avatar,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
  TablePagination
} from '@material-ui/core';

import { getInitials } from 'helpers';

const useStyles = makeStyles(theme => ({
  root: {},
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

const UsersReportTable = props => {
  
  const [users2] = useState(mockData2);
  const { className, users, ...rest } = props;

  const classes = useStyles();

  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [page, setPage] = useState(0);
  const [openRow2, setOpenRow2] = React.useState(false);
  
  const handleRowClick2 = () => {
    setOpenRow2(true);
  };

  const handleRowClose2 = () => {
    setOpenRow2(false);
  };

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
                  <TableCell>Registration date</TableCell>
                  <TableCell>Status</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {users.slice(0, rowsPerPage).map(user => (
                  <TableRow
                    className={classes.tableRow}
                    hover
                    key={user.id}
                    onClick={()=>handleRowClick2(user.id)}
                  >
                    <TableCell>
                      <div className={classes.nameContainer}>
                        <Avatar
                          className={classes.avatar}
                          src={user.avatarUrl}
                        >
                          {getInitials(user.branchId)}
                        </Avatar>
                        <Typography variant="body1">{user.branchId}</Typography>
                      </div>
                    </TableCell>
                    <TableCell>{user.branchAccountNumber}</TableCell>
                    <TableCell>{user.balance}</TableCell>
                    <TableCell>{user.branchName}</TableCell>
                    <TableCell>
                      {user.address.city}, {user.address.state},{' '}
                      {user.address.country}
                    </TableCell>
                    <TableCell>
                      {moment(user.createdAt).format('DD/MM/YYYY')}
                    </TableCell>
                    <TableCell>
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
        <DialogTitle id="customized-dialog-title" onClose={handleRowClose2}>
          Branch Transaction Report
        </DialogTitle>
        <DialogContent dividers>
          <CardContent className={classes.content}>
            <PerfectScrollbar>
          <div className={classes.inner}>
            <BranchProfile />
          </div>
          <div className={classes.inner}>
            <UsersTableToolbar />
          </div>
          <div className={classes.inner}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Transaction ID</TableCell>
                  <TableCell>Username</TableCell>
                  <TableCell>Account Destination</TableCell>
                  <TableCell>Transaction Date</TableCell>
                  <TableCell>Transaction Amount</TableCell>
                  <TableCell>Transaction Type</TableCell>
                  <TableCell>Transaction Status</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {users2.slice(0, rowsPerPage).map(user => (
                  <TableRow
                    className={classes.tableRow}
                    hover
                    key={user.id}
                    onClick={()=>handleRowClick2(user.id)}
                  >
                    <TableCell>{user.trxId}</TableCell>
                    <TableCell>
                      <div className={classes.nameContainer}>
                        <Avatar
                          className={classes.avatar}
                          src={user.avatarUrl}
                        >
                          {getInitials(user.name)}
                        </Avatar>
                        <Typography variant="body1">{user.username}</Typography>
                      </div>
                    </TableCell>
                    <TableCell>{user.accDestination}</TableCell>
                    <TableCell>
                      {moment(user.createdAt).format('DD/MM/YYYY')}
                    </TableCell>
                    <TableCell>{user.trxAmount}</TableCell>
                    <TableCell>{user.trxType}</TableCell>
                    <TableCell>Success</TableCell>
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
          count={users2.length}
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
    </Card>

  );
};

UsersReportTable.propTypes = {
  className: PropTypes.string,
  users: PropTypes.array.isRequired
};

export default UsersReportTable;