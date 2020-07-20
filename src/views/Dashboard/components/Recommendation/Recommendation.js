import React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/styles';

import {
  Card,
  CardHeader,
  Divider
} from '@material-ui/core';

import AliceCarousel from 'react-alice-carousel';
import "react-alice-carousel/lib/alice-carousel.css";

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

const tileData = [
  <a href="https://www.bca.co.id/Bisnis/Produk-dan-Layanan/Kartu-Kredit/BCA-Smartcash" target="_blank"><img src="/images/products/product_7.jpg" /></a>,
  <a href="https://www.bca.co.id/en/Bisnis/Produk-dan-Layanan/Simpanan/Giro" target="_blank"><img src="/images/products/product_8.jpg" /></a>,
  <a href="https://www.bca.co.id/en/Bisnis/Produk-dan-Layanan/E-Banking/Layanan-Merchant" target="_blank"><img src="/images/products/product_9.jpg" /></a>
];

const responsive = {
  0: {
    items: 1
  },
  600: {
    items: 1
  },
  1024: {
    items: 1
  }
};

const padding = {
  paddingLeft: 40,
  paddingRight: 0
}

const Recommendation = props => {
  const { className, ...rest } = props;

  const classes = useStyles();

  return (
    <Card
      {...rest}
      className={clsx(classes.root, className)}
    >
      <CardHeader
        title="Product Recommendation"
      />
      <Divider />
      <AliceCarousel
        items= {tileData}
        stagePadding={padding}
        duration={500}
        autoPlay={true}
        startIndex = {0}
        fadeOutAnimation={true}
        mouseDragEnabled={true}
        buttonsDisabled={true}
        fadeOutAnimation={true}
        // playButtonEnabled={true}
        responsive={responsive}
        autoPlayInterval={2000}
        autoPlayDirection="ltr"
        autoPlayActionDisabled={true}
      />
    </Card>
  );
};

Recommendation.propTypes = {
  className: PropTypes.string
};

export default Recommendation;
