import React from 'react';
import DefaultLayout from './containers/DefaultLayout';

const Dashboard = React.lazy(() => import('./views/Dashboard'));
const BusinessProfile = React.lazy(() => import('./views/Basics/BusinessProfile'));
const Location = React.lazy(() => import('./views/Basics/Location'));
const Payment = React.lazy(() => import('./views/Basics/Payment/TopPayment'));

const Order = React.lazy(() => import('./views/Order'));

const Menu = React.lazy(() => import('./views/Menu'));

const Sales = React.lazy(() => import('./views/Analysis/Sales'));
const Customer = React.lazy(() => import('./views/Analysis/Customer'));

const Profile = React.lazy(() => import('./views/Account/Profile'));

const routes = [
  { path: '/', exact: true, name: 'Dashboard', component: DefaultLayout },

  { path: '/restaurant/dashboard', name: 'Dashboard', component: Dashboard },

  { path: '/restaurant/basics', exact: true, name: 'Basics', component: BusinessProfile },
  { path: '/restaurant/basics/businessprofile', name: 'Business Profile', component: BusinessProfile },
  { path: '/restaurant/basics/location', name: 'Location', component: Location },
  { path: '/restaurant/basics/onlinepayment', name: 'Online Payment', component: Payment },

  { path: '/restaurant/menusetup', name: 'Menu', component: Menu },

  { path: '/restaurant/order', name: 'Order', component: Order },

  { path: '/restaurant/analysis', exact: true, name: 'Analysis', component: Sales },
  { path: '/restaurant/analysis/sales', name: 'Sales', component: Sales },
  { path: '/restaurant/analysis/customer', name: 'Customer', component: Customer },


  { path: '/restaurant/account/profile', exact: true, name: 'Profile', component: Profile },

];

export default routes;
