import React, { useState } from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import moment from 'moment';
import PerfectScrollbar from 'react-perfect-scrollbar';
import { makeStyles, ThemeProvider } from '@material-ui/styles';
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
import { StatusBullet } from 'components';

import mockData from './data';
import TransferDetail from './components/TransferDetail'

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
  dialogtitle:{
    backgroundColor: '#00A479'
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
    minWidth: 500
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

const UsersTable = props => {
  const { className, users, ...rest } = props;

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

  const handleRowClose = () =>{
    setOpenRow(false);
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClickClose = () => {
    setOpen(false);
    setOpenRow(false);
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
      {/* <CardHeader
        title="Transfer Status List"/>
      <Divider /> */}
      <CardContent className={classes.content}>
        <PerfectScrollbar>
          <div className={classes.content}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Transfer ID</TableCell>
                  <TableCell>Branch Name</TableCell>
                  <TableCell>Destination</TableCell>
                  <TableCell>Amount</TableCell>
                  <TableCell sortDirection="desc">
                    <Tooltip
                      enterDelay={300}
                      title="Sort"
                    >
                      <TableSortLabel
                        active
                        direction="desc"
                      >
                        Transfer Date
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
                    <TableCell>{request.transferID}</TableCell>
                    <TableCell>{request.branch.name}</TableCell>
                    <TableCell>{request.destination.name}</TableCell>
                    <TableCell>{request.amount}</TableCell>
                    <TableCell>
                      {moment(request.createAt).format('DD/MM/YYY')}
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
          onChangeRowPerPage={handleRowsPerPageChange}
          page={page}
          rowsPerPage={rowsPerPage}
          rowsPerPageOptions={[5, 10, 25]}
        />
      </CardActions>
      <Divider />

      <Dialog onClose={handleRowClose} aria-labelledby="costumized-dialog-title" open={openRow} maxWitdh='lg' fullWidth>
        <DialogTitle
          className ={classes.dialogtitle}
          id="costumized-dialog-title"
          onClose={handleRowClose}
        >
          <span style={{color: 'white'}}>Transfer Detail</span>
        </DialogTitle>
        <DialogContent dividers>
          <CardContent className={classes.content}>
            <PerfectScrollbar>
              <div className={classes.inner}>
                <TransferDetail />
              </div>
              <TextField
                disabled
                className={classes.textField}
                fullWidth
                label="Transfer ID"
                name="transferId"
                type="text"
                variant="outlined"
                value="0"
              />
              <TextField
                disabled
                className={classes.textField}
                fullWidth
                label="Branch Account Number"
                name="branchId"
                type="text"
                variant="outlined"
                value='1234567890'
              />
              <TextField
                disabled
                className={classes.textField}
                fullWidth
                label="Destination"
                name="destinationId"
                type="text"
                variant="outlined"
                value='1234567891'
              />
              <TextField
                disabled
                className={classes.textField}
                fullWidth
                label="Amount"
                name="amount"
                type="text"
                variant="outlined"
                value='Rp 10.000.000'
              />
              <TextField
                disabled
                className={classes.textField}
                fullWidth
                label="Date"
                name="date"
                type="text"
                variant="outlined"
                value='24/06/2020'
              />
              <TextField
                disabled
                className={classes.textField}
                fullWidth
                label="Status"
                name="status"
                type="text"
                variant="outlined"
                value='done'
              />
              <TextField
                disabled
                className={classes.textField}
                fullWidth
                label="Remark"
                name="remark"
                type="text"
                variant="outlined"
                value='this is the remarks'
              />
            </PerfectScrollbar>
          </CardContent>
        </DialogContent>
        <DialogActions>
          <Button 
            className={classes.approveButton}
            autoFocus onClick={handleRowClose} color="primary"
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Card>
  )

};

UsersTable.propTypes = {
  className: PropTypes.string,
  users: PropTypes.array.isRequired
};

export default UsersTable;
