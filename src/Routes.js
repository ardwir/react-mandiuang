import React from 'react';
import { Switch, Redirect } from 'react-router-dom';

import { RouteWithLayout } from './components';
import { Main as MainLayout, Minimal as MinimalLayout } from './layouts';

import { SignIn as SignInLayout } from './layouts';

import {
  Dashboard as DashboardView,
  ProductList as ProductListView,
  UserList as UserListView,
  Icons as IconsView,
  Account as AccountView,
  Settings as SettingsView,
  SignUp as SignUpView,
  SignIn as SignInView,
  NotFound as NotFoundView,

  TransferStatus as TransferStatusView,
  Transfer as TransferView,
  BudgetRequest as BudgetRequestView,
  AccountReport as AccountReportView,
  Forecasting as ForecastingView
} from './views';

const Routes = () => {
  return (
    <Switch>
      <Redirect
        exact
        from="/"
        to="/sign-in"
      />
      <RouteWithLayout
        component={DashboardView}
        exact
        layout={MainLayout}
        access={"private"}
        path="/dashboard"
      />
      <RouteWithLayout
        component={TransferView}
        exact
        layout={MainLayout}
        access={"private"}
        path="/transfer"
      />
      <RouteWithLayout
        component={BudgetRequestView}
        exact
        layout={MainLayout}
        access={"private"}
        path="/budgetrequest"
      />
      <RouteWithLayout
        component={UserListView}
        exact
        layout={MainLayout}
        access={"private"}
        path="/users"
      />
      <RouteWithLayout
        component={ProductListView}
        exact
        layout={MainLayout}
        path="/products"
      />
      <RouteWithLayout
        component={IconsView}
        exact
        layout={MainLayout}
        path="/icons"
      />
      <RouteWithLayout
        component={AccountView}
        exact
        layout={MainLayout}
        path="/account"
      />
      <RouteWithLayout
        component={SettingsView}
        exact
        layout={MainLayout}
        access={"private"}
        path="/settings"
      />
      <RouteWithLayout
        component={TransferStatusView}
        exact
        layout={MainLayout}
        access={"private"}
        path="/transferstatus"
      />
      <RouteWithLayout
        component={UserListView}
        exact
        layout={MainLayout}
        access={"private"}
        path="/userlist"
      />
      
      <RouteWithLayout
        component={AccountReportView}
        exact
        layout={MainLayout}
        access={"private"}
        path="/accountreport"
      />
      <RouteWithLayout
        component={ForecastingView}
        exact
        layout={MainLayout}
        access={"private"}
        path="/forecasting"
      />

      <RouteWithLayout
        component={SignUpView}
        exact
        layout={MinimalLayout}
        path="/sign-up"
      />
      <RouteWithLayout
        component={SignInView}
        exact
        layout={SignInLayout}
        path="/sign-in"
      />
      <RouteWithLayout
        component={NotFoundView}
        exact
        layout={MinimalLayout}
        path="/not-found"
      />
      <Redirect to="/not-found" />
    </Switch>
  );
};

export default Routes;
