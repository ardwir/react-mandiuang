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
  Button,
  Paper
} from '@material-ui/core';
import {
  ArgumentAxis,
  ValueAxis,
  Chart,
  LineSeries,
  SplineSeries,
  Legend,
  Tooltip
} from '@devexpress/dx-react-chart-material-ui';
import { ValueScale, Animation, EventTracker } from '@devexpress/dx-react-chart';

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

const data = [
  { argument: 'JAN', value: 10000000 },
  { argument: 'FEB', value: 15000000 },
  { argument: 'MAR', value: 10000000 },
  { argument: 'APR', value: 20000000 },
  { argument: 'MAY', value: 15000000 },
  { argument: 'JUN', value: 15000000 },
  { argument: 'JUL', value: 10000000 },

  { argument2: 'AUG', value: 11000000},
  { argument2: 'SEP', value: 18500000 },
  { argument2: 'OCT', value: 16000000 },
  { argument2: 'NOV', value: 9500000 },
  { argument2: 'DEC', value: 18000000 }
]

const Charts = props => {
  const { className, ...rest } = props;

  const classes = useStyles();

  return (
    <Paper>
      <Chart data={data}>
        {/* <ValueScale name="exist" />
        <ValueScale name="forecast" /> */}

        <ArgumentAxis />
        <ValueAxis />
        {/* <ValueAxis scaleName="exist" showGrid={false} showLine showTicks />
        <ValueAxis scaleName="forecast" position="left" showGrid={false} showLine showTicks /> */}

        <LineSeries 
          name="Input Data"
          valueField="value"
          argumentField="argument"
          />

        <LineSeries
          name="Forecast"
          valueField="value"
          argumentField="argument2"
          />

        <EventTracker />
        <Tooltip />
        <Animation />
      </Chart>
    </Paper>
  )
};

Charts.propTypes = {
  className: PropTypes.string
};

export default Charts;
