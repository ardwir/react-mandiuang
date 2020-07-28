import React from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/styles';
import { Typography } from '@material-ui/core';

import Dropdown from 'react-dropdown';
import 'react-dropdown/style.css';

const useStyles = makeStyles(() => ({
  root: {},
  chartContainer: {
    height: 400,
    position: 'relative'
  },
  actions: {
    justifyContent: 'flex-end'
  }
}));

const options = [
  'Week', 'Month'
];
const defaultOption = options[0];

const ChartToolbar = props => {
  const { className, ...rest } = props;

  const classes = useStyles();

  return (
    <div className={classes.root}>
      <Typography variant='h4'>
        Select Period:
      </Typography>
      <Dropdown
        options={options}
        // onChange={this._onSelect}
        value={defaultOption}
        placeholder="Time Scale"
      />
    </div>
  );
};

ChartToolbar.propTypes = {
  className: PropTypes.string
};

export default ChartToolbar;