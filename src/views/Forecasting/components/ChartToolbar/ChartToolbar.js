import React from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import { Bar } from 'react-chartjs-2';
import { makeStyles } from '@material-ui/styles';
import {
  Card,
  CardHeader,
  CardContent,
  CardActions,
  Divider,
  Button
} from '@material-ui/core';

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
  'Month', 'Year'
];
const defaultOption = options[0];

const ChartToolbar = props => {
  const { className, ...rest } = props;

  const classes = useStyles();

  return (
    <div className={classes.root}>
      <h4>Select periode:</h4>
        <Dropdown
          options={options}
          // onChange={this._onSelect}
          value={defaultOption}
          placeholder="Select an option"
        />
    </div>
  );
};

ChartToolbar.propTypes = {
  className: PropTypes.string
};

export default ChartToolbar;