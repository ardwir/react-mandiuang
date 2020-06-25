import React from 'react';
import { Doughnut } from 'react-chartjs-2';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import { makeStyles, useTheme } from '@material-ui/styles';
import {
  Card,
  CardHeader,
  CardContent,
  IconButton,
  Divider,
  Typography
} from '@material-ui/core';
import AddBoxIcon from '@material-ui/icons/AddBox';
import IndeterminateCheckBoxIcon from '@material-ui/icons/IndeterminateCheckBox';
import RefreshIcon from '@material-ui/icons/Refresh';

const useStyles = makeStyles(theme => ({
  root: {
    height: '100%'
  },
  chartContainer: {
    position: 'relative',
    height: '300px'
  },
  stats: {
    marginTop: theme.spacing(2),
    display: 'flex',
    justifyContent: 'center'
  },
  device: {
    textAlign: 'center',
    padding: theme.spacing(1)
  },
  deviceIcon: {
    color: theme.palette.icon
  }
}));

const Statistic = props => {
  const { className, ...rest } = props;

  const classes = useStyles();
  const theme = useTheme();

  const data = {
    datasets: [
      {
        data: [73, 27],
        backgroundColor: [
          theme.palette.primary.main,
          theme.palette.error.main
        ],
        borderWidth: 5,
        borderColor: theme.palette.white,
        hoverBorderColor: theme.palette.white,
      }
    ],
    labels: ['Expense', 'Income']
  };

  const options = {
    legend: {
      display: false
    },
    responsive: true,
    maintainAspectRatio: false,
    animation: false,
    cutoutPercentage: 80,
    layout: { padding: 0 },
    tooltips: {
      enabled: true,
      mode: 'index',
      intersect: false,
      borderWidth: 1,
      borderColor: theme.palette.divider,
      backgroundColor: theme.palette.white,
      titleFontColor: theme.palette.text.primary,
      bodyFontColor: theme.palette.text.secondary,
      footerFontColor: theme.palette.text.secondary
    }
  };

  const devices = [
    {
      title: 'Credit',
      value: '73',
      icon: <AddBoxIcon />,
      color: theme.palette.primary.main
    },
    {
      title: 'Debit',
      value: '27',
      icon: <IndeterminateCheckBoxIcon />,
      color: theme.palette.error.main
    }
  ];

  return (
    <Card
      {...rest}
      className={clsx(classes.root, className)}
    >
      <CardHeader
        action={
          <IconButton size="small">
            <RefreshIcon />
          </IconButton>
        }
        title="Statistic"
      />
      <Divider />
      <CardContent>
        <div className={classes.chartContainer}>
          <Doughnut
            data={data}
            options={options}
          />
        </div>
        <div className={classes.stats}>
          {devices.map(device => (
            <div
              className={classes.device}
              key={device.title}
            >
              <span className={classes.deviceIcon}>{device.icon}</span>
              <Typography variant="body1">{device.title}</Typography>
              <Typography
                style={{ color: device.color }}
                variant="h2"
              >
                {device.value}%
              </Typography>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

Statistic.propTypes = {
  className: PropTypes.string
};

export default Statistic;
