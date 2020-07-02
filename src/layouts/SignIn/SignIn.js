import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/styles';

const useStyles = makeStyles(() => ({
  root: {
    paddingTop: 64,
    height: '100%'
  },
  content: {
    height: '100%',
    backgroundImage: 'url(/images/bg.png)',
    backgroundAttachment: 'fixed',
    backgroundSize: 'cover',
    backgroundRepeat: 'false'
  },
}));

const SignIn = props => {
  const { children } = props;

  const classes = useStyles();

  return (
    
      <main className={classes.content}>{children}</main>
    
  );
};

SignIn.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string
};

export default SignIn;
