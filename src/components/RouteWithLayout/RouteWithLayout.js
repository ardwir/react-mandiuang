import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import PropTypes from 'prop-types';

const RouteWithLayout = props => {
  const { access: access, layout: Layout, component: Component, ...rest } = props;

  const data = localStorage.getItem("data");
  return (
    <Route
      {...rest}
      render={matchProps => access === "private" ?
      ( data != null ?
        (<Layout>
          <Component {...matchProps} />
        </Layout>)
        : (<Redirect to={{pathname: "/" }} />))
        : (<Layout>
          <Component {...matchProps} />
        </Layout>)
      }
    />
  );
};

RouteWithLayout.propTypes = {
  component: PropTypes.any.isRequired,
  layout: PropTypes.any.isRequired,
  path: PropTypes.string
};

export default RouteWithLayout;
