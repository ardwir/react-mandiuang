import React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/styles';
import GridList from '@material-ui/core/GridList';
import GridListTile from '@material-ui/core/GridListTile';
import GridListTileBar from '@material-ui/core/GridListTileBar';

import {
  Card,
  CardHeader,
  Divider
} from '@material-ui/core';

const useStyles = makeStyles(theme => ({
  root: {},
  content: {
    padding: 0
  },
  inner: {
    minWidth: 800
  },
  statusContainer: {
    display: 'flex',
    alignItems: 'center'
  },
  status: {
    marginRight: theme.spacing(1)
  },
  actions: {
    justifyContent: 'flex-end'
  },
  gridList: {
    flexWrap: 'nowrap',
    // Promote the list into his own layer on Chrome. This cost memory but helps keeping high FPS.
    transform: 'translateZ(0)',
  },
  title: {
    color: theme.palette.primary.light,
  },
  titleBar: {
    background:
      'linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.3) 70%, rgba(0,0,0,0) 100%)',
  },
}));

const tileData=[
  {
    img: '/images/products/product_7.jpg',
    title: 'SmartCash',
    url: 'https://www.bca.co.id/en/Bisnis/Produk-dan-Layanan/Kartu-Kredit'
  },
  {
    img: '/images/products/product_8.jpg',
    title: 'Giro BCA',
    url: 'https://www.bca.co.id/en/Bisnis/Produk-dan-Layanan/Simpanan/Giro'
  },
  {
    img: '/images/products/product_9.jpg',
    title: 'EDC BCA',
    url: 'https://www.bca.co.id/Bisnis/Produk-dan-Layanan/E-Banking/EDC-BCA'
  }
];


const Recommendation = props => {
  const { className, ...rest } = props;

  const classes = useStyles();

  return (
    <Card
      {...rest}
      className={clsx(classes.root, className)}
    >
      <CardHeader
        title="Produt Recommendation"
      />
      <Divider />
      <div className={classes.root}>
      <GridList className={classes.gridList} cols={2.5}>
        {tileData.map((tile) => (
          <GridListTile key={tile.img}>
            <img src={tile.img} alt={tile.title} />
            <GridListTileBar
              title={tile.title}
              classes={{
                root: classes.titleBar,
                title: classes.title
              }}
            />
          </GridListTile>
        ))}
      </GridList>
    </div>
    </Card>
  );
};

Recommendation.propTypes = {
  className: PropTypes.string
};

export default Recommendation;
