import React, { useState, useEffect } from 'react';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import validate from 'validate.js';
import { makeStyles } from '@material-ui/styles';
import {
  Grid,
  Button,
  IconButton,
  TextField,
  FormHelperText,
  Checkbox,
  Typography
} from '@material-ui/core';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';

const schema = {
  username: {
    presence: { allowEmpty: false, message: 'is required' },
    length: {
      maximum: 32
    }
  },
  name: {
    presence: { allowEmpty: false, message: 'is required' },
    length: {
      maximum: 32
    }
  },
  email: {
    presence: { allowEmpty: false, message: 'is required' },
    email: true,
    length: {
      maximum: 64
    }
  },
  password: {
    presence: { allowEmpty: false, message: 'is required' },
    length: {
      maximum: 20
    }
  },
  branchId: {
    presence: { allowEmpty: false, message: 'is required' },
    length: {
      maximum: 64
    }
  },
  jobPosition: {
    presence: { allowEmpty: false, message: 'is required' },
    length: {
      maximum: 64
    }
  },
  phoneNumber: {
    presence: { allowEmpty: false, message: 'is required' },
    length: {
      maximum: 64
    }
  },
  role: {
    presence: { allowEmpty: false, message: 'is required' },
    length: {
      maximum: 64
    }
  },
  agreement: {
    presence: { allowEmpty: false, message: 'is required' },
    checked: true
  }
};

const useStyles = makeStyles(theme => ({
  root: {
    backgroundColor: theme.palette.background.default,
    height: '100%'
  },
  grid: {
    height: '100%'
  },
  quoteContainer: {
    [theme.breakpoints.down('md')]: {
      display: 'none'
    }
  },
  quote: {
    backgroundColor: theme.palette.neutral,
    height: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  quoteInner: {
    textAlign: 'center',
    flexBasis: '600px'
  },
  quoteText: {
    color: theme.palette.black,
    fontWeight: 300
  },
  name: {
    marginTop: theme.spacing(3),
    color: theme.palette.black
  },
  bio: {
    color: theme.palette.black
  },
  contentContainer: {},
  content: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column'
  },
  contentHeader: {
    display: 'flex',
    alignItems: 'center',
    paddingTop: theme.spacing(2),
    paddingBototm: theme.spacing(2),
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2)
  },
  logoImage: {
    marginLeft: theme.spacing(4)
  },
  contentBody: {
    flexGrow: 1,
    display: 'flex',
    alignItems: 'center',
    [theme.breakpoints.down('md')]: {
      justifyContent: 'center'
    }
  },
  form: {
    paddingLeft: 100,
    paddingRight: 100,
    paddingBottom: 125,
    flexBasis: 700,
    [theme.breakpoints.down('sm')]: {
      paddingLeft: theme.spacing(2),
      paddingRight: theme.spacing(2)
    }
  },
  title: {
    marginTop: theme.spacing(3)
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
  signUpButton: {
    margin: theme.spacing(2, 0)
  }
}));

const SignUp = props => {
  const { history } = props;

  const classes = useStyles();

  const [formState, setFormState] = useState({
    isValid: false,
    values: {},
    touched: {},
    errors: {}
  });

  useEffect(() => {
    const errors = validate(formState.values, schema);

    setFormState(formState => ({
      ...formState,
      isValid: errors ? false : true,
      errors: errors || {}
    }));
  }, [formState.values]);

  const handleChange = event => {
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

  const handleBack = () => {
    history.goBack();
  };

  const handleSignUp = event => {
    event.preventDefault();
    history.push('/dashboard');
  };

  const hasError = field =>
    formState.touched[field] && formState.errors[field] ? true : false;

  return (
    <div className={classes.root}>
      <Grid
        className={classes.grid}
        container
      >
        <Grid
          className={classes.quoteContainer}
          item
          lg={5}
        >
          <div className={classes.quote}>
            <div className={classes.quoteInner}>
              <img
                alt="Logo"
                src="/images/logos/mandiuang.png"
                style={{paddingLeft: '10%', paddingRight:'10%', width:'100%'}}
              />
              <Typography
                className={classes.quoteText}
                variant="h1"
              >
                Join MandiUang Application
              </Typography>
              <div className={classes.person}>
                <Typography
                  className={classes.name}
                  variant="body1"
                >
                  Team 3
                </Typography>
              </div>
            </div>
          </div>
        </Grid>
        <Grid
          className={classes.content}
          item
          lg={7}
          xs={12}
        >
          <div className={classes.content}>
            <div className={classes.contentHeader}>
              <IconButton onClick={handleBack}>
                <ArrowBackIcon />
              </IconButton>
            </div>
            <div className={classes.contentBody}>
              <form
                className={classes.form}
                onSubmit={handleSignUp}
              >
                <Typography
                  className={classes.title}
                  variant="h2"
                >
                  Create New User
                </Typography>
                <TextField
                  className={classes.textField}
                  error={hasError('username')}
                  fullWidth
                  helperText={
                    hasError('username') ? formState.errors.username[0] : null
                  }
                  label="Username"
                  name="username"
                  onChange={handleChange}
                  type="text"
                  value={formState.values.username || ''}
                  variant="outlined"
                />
                <TextField
                  className={classes.textField}
                  error={hasError('email')}
                  fullWidth
                  helperText={
                    hasError('email') ? formState.errors.email[0] : null
                  }
                  label="Email address"
                  name="email"
                  onChange={handleChange}
                  type="text"
                  value={formState.values.email || ''}
                  variant="outlined"
                />
                <TextField
                  className={classes.textField}
                  error={hasError('name')}
                  fullWidth
                  helperText={
                    hasError('name') ? formState.errors.name[0] : null
                  }
                  label="Name "
                  name="name"
                  onChange={handleChange}
                  type="text"
                  value={formState.values.name || ''}
                  variant="outlined"
                />
                <TextField
                  className={classes.textField}
                  error={hasError('branchId')}
                  fullWidth
                  helperText={
                    hasError('branchId') ? formState.errors.branchId[0] : null
                  }
                  label="Branch ID"
                  name="branchId"
                  onChange={handleChange}
                  type="text"
                  value={formState.values.branchId || ''}
                  variant="outlined"
                />
                <TextField
                  className={classes.textField}
                  error={hasError('password')}
                  fullWidth
                  helperText={
                    hasError('password') ? formState.errors.password[0] : null
                  }
                  label="Password"
                  name="password"
                  onChange={handleChange}
                  type="password"
                  value={formState.values.password || ''}
                  variant="outlined"
                />
                <TextField
                  className={classes.textField}
                  error={hasError('jobPosition')}
                  fullWidth
                  helperText={
                    hasError('jobPosition') ? formState.errors.jobPosition[0] : null
                  }
                  label="Job Position"
                  name="jobPosition"
                  onChange={handleChange}
                  type="text"
                  value={formState.values.jobPosition || ''}
                  variant="outlined"
                />
                <TextField
                  className={classes.textField}
                  error={hasError('phoneNumber')}
                  fullWidth
                  helperText={
                    hasError('phoneNumber') ? formState.errors.phoneNumber[0] : null
                  }
                  label="Phone Number"
                  name="phoneNumber"
                  onChange={handleChange}
                  type="number"
                  value={formState.values.phoneNumber || ''}
                  variant="outlined"
                />
                <TextField
                  className={classes.textField}
                  error={hasError('role')}
                  fullWidth
                  helperText={
                    hasError('role') ? formState.errors.role[0] : null
                  }
                  label="Role"
                  name="role"
                  onChange={handleChange}
                  type="text"
                  value={formState.values.role || ''}
                  variant="outlined"
                />
                <div className={classes.agreement}>
                  <Checkbox
                    checked={formState.values.agreement || false}
                    className={classes.agreementCheckbox}
                    color="primary"
                    name="agreement"
                    onChange={handleChange}
                  />
                  <Typography
                    color="textSecondary"
                    variant="body1"
                  >
                    Agree To Join MandiUang
                  </Typography>
                </div>
                
                {hasError('agreement') && (
                  <FormHelperText error>
                    {formState.errors.agreement[0]}
                  </FormHelperText>
                )}
                <Button
                  className={classes.signUpButton}
                  color="primary"
                  disabled={!formState.isValid}
                  fullWidth
                  size="large"
                  type="submit"
                  variant="contained"
                >
                  Register New Account
                </Button>
              </form>
            </div>
          </div>
        </Grid>
      </Grid>
    </div>
  );
};

SignUp.propTypes = {
  history: PropTypes.object
};

export default withRouter(SignUp);
