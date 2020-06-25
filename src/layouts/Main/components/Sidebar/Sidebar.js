import React from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/styles';
import { Divider, Drawer } from '@material-ui/core';

import HomeIcon from '@material-ui/icons/Home';
import TransferWithinAStation from '@material-ui/icons/TransferWithinAStation'; 
import MonetizationOn from '@material-ui/icons/MonetizationOn'
import Eco from '@material-ui/icons/Eco'
import PermIdentity from '@material-ui/icons/PermIdentity'
import TextFieldsIcon from '@material-ui/icons/TextFields';
import AccountBoxIcon from '@material-ui/icons/AccountBox';
import SettingsIcon from '@material-ui/icons/Settings';

import { Profile, SidebarNav } from './components';

const useStyles = makeStyles(theme => ({
  drawer: {
    width: 240,
    [theme.breakpoints.up('lg')]: {
      marginTop: 64,
      height: 'calc(100% - 64px)'
    }
  },
  root: {
    backgroundColor: theme.palette.white,
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    padding: theme.spacing(2)
  },
  divider: {
    margin: theme.spacing(2, 0)
  },
  nav: {
    marginBottom: theme.spacing(2)
  }
}));

const Sidebar = props => {
  const { open, variant, onClose, className, ...rest } = props;

  const classes = useStyles();

  const pages = [
    {
      title: 'Home ',
      href: '/dashboard',
      icon: <HomeIcon />
    },
    {
      title: 'Transfer',
      href: '/transfer',
      icon: <TransferWithinAStation />
    },
    {
      title: 'Budget Request',
      href: '/budgetrequest',
      icon: <MonetizationOn />
    },
    {
      title: 'Branch Control',
      href: '/userlist',
      icon: <PermIdentity />
    },
    {
      title: 'Transfer Status',
      href: '/transferstatus',
      icon: <TextFieldsIcon />
    },
    {
      title: 'Account Report',
      href: '/accountreport',
      icon: <AccountBoxIcon />
    },
    {
      title: 'Forecasting',
      href: '/forecasting',
      icon: <Eco />
    },
    {
      title: 'Settings',
      href: '/settings',
      icon: <SettingsIcon />
    }
  ];

  return (
    <Drawer
      anchor="left"
      classes={{ paper: classes.drawer }}
      onClose={onClose}
      open={open}
      variant={variant}
    >
      <div
        {...rest}
        className={clsx(classes.root, className)}
      >
        <Profile />
        <Divider className={classes.divider} />
        <SidebarNav
          className={classes.nav}
          pages={pages}
        />
      </div>
    </Drawer>
  );
};

Sidebar.propTypes = {
  className: PropTypes.string,
  onClose: PropTypes.func,
  open: PropTypes.bool.isRequired,
  variant: PropTypes.string.isRequired
};

export default Sidebar;
