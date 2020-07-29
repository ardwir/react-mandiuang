import React, {useState, useEffect} from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
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
  carousel:{
    width: 1024,
    float: 'none',
    margin: 'auto'
  }
}));

//const [ recomemnd, setRecommend ] = useState({});
const localData = JSON.parse(localStorage.getItem("data"));

// const classes = useStyles();

//Axios Image
  // useEffect(() => {
  //   axios.get('https://mupy.apps.pcf.dti.co.id/recopred/', {
  //       headers: {
  //         'Authorization': `Bearer ${localData}` 
  //       }
  //   })
  //       .then(res => {
  //           console.log(res) 
  //           setRecommend(res.data);
  //       })
  //       .catch(err => {
  //           console.log(err)
  //       })
  // }, [])


//image res 980x352
const tileData = [
  <a href="" target="_blank"><img src="/images/products/img_01.jpg" /></a>,
  <a href="" target="_blank"><img src="/images/products/img_02.jpg" /></a>,
  <a href="" target="_blank"><img src="/images/products/img_03.jpg" /></a>,
  <a href="" target="_blank"><img src="/images/products/img_04.jpg" /></a>,
  <a href="" target="_blank"><img src="/images/products/img_05.jpg" /></a>,
  <a href="" target="_blank"><img src="/images/products/img_06.jpg" /></a>,
  <a href="" target="_blank"><img src="/images/products/img_07.jpg" /></a>,
  <a href="" target="_blank"><img src="/images/products/img_08.jpg" /></a>,
  <a href="" target="_blank"><img src="/images/products/img_09.jpg" /></a>,
  <a href="" target="_blank"><img src="/images/products/img_10.jpg" /></a>,
  <a href="" target="_blank"><img src="/images/products/img_11.jpg" /></a>,
  <a href="" target="_blank"><img src="/images/products/img_12.jpg" /></a>,
  <a href="" target="_blank"><img src="/images/products/img_13.jpg" /></a>,
  <a href="" target="_blank"><img src="/images/products/img_14.jpg" /></a>,
];

const recommendData = [
  tileData[0],
  tileData[2],
  tileData[4]
];

const responsive = {
  0: {
    items: 0
  },
  600: {
    items: 1
  },
  1024: {
    items: 1
  }
};

const padding = {
  paddingLeft: 0,
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
      <div className={classes.carousel}>
        <AliceCarousel
          items= {recommendData}
          stagePadding={padding}
          duration={1000}
          autoPlay={true}
          startIndex = {0}
          fadeOutAnimation={true}
          mouseDragEnabled={true}
          buttonsDisabled={true}
          fadeOutAnimation={true}
          // playButtonEnabled={true}
          responsive={responsive}
          autoPlayInterval={3000}
          autoPlayDirection="ltr"
          autoPlayActionDisabled={true}
        />
      </div>
    </Card>
  );
};

Recommendation.propTypes = {
  className: PropTypes.string
};

export default Recommendation;
