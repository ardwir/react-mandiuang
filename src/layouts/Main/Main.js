import React, { useState } from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { makeStyles, useTheme } from '@material-ui/styles';
import { useMediaQuery } from '@material-ui/core';

import { Sidebar, Topbar, Footer } from './components';

const useStyles = makeStyles(theme => ({
  root: {
    paddingTop: 56,
    minHeight: '100%',
    display: 'flex',
    flexDirection: 'column',
    [theme.breakpoints.up('sm')]: {
      paddingTop: 64
    },
    minHeight: '100%',
    display: 'flex',
    flexDirection: 'column',
    marginBottom: '-100px'
  },
  shiftContent: {
    paddingLeft: 240
  },
  content: {
    height: '100%'
  },
  footer: {
    backgroundColor: 'transparent',
    textAlign: 'right',
    height: '100px',
    flex: 1,
    position: "sticky",
    bottom: '8px',
    right: '16px'
  }
}));

const Main = props => {
  const { children } = props;

  const classes = useStyles();
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up('lg'), {
    defaultMatches: true
  });

  const [openSidebar, setOpenSidebar] = useState(false);

  const handleSidebarOpen = () => {
    setOpenSidebar(true);
  };

  const handleSidebarClose = () => {
    setOpenSidebar(false);
  };

  const shouldOpenSidebar = isDesktop ? true : openSidebar;

  return (
    <div
      className={clsx({
        [classes.root]: true,
        [classes.shiftContent]: isDesktop
      })}
    >
      <Topbar onSidebarOpen={handleSidebarOpen} />
      <Sidebar
        onClose={handleSidebarClose}
        open={shouldOpenSidebar}
        variant={isDesktop ? 'persistent' : 'temporary'}
      />
      <main className={classes.content}>
        {children}
        <Footer className={classes.footer}/>
      </main>
    </div>
  );
};

Main.propTypes = {
  children: PropTypes.node
};

export default Main;
