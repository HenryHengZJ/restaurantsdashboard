import React from 'react';
import DefaultLayout from './containers/DefaultLayout';

const Dashboard = React.lazy(() => import('./views/Dashboard'));
const BusinessProfile = React.lazy(() => import('./views/Basics/BusinessProfile'));
const Location = React.lazy(() => import('./views/Basics/Location'));
const Cuisine = React.lazy(() => import('./views/Basics/Cuisine'));
const Payment = React.lazy(() => import('./views/Basics/Payment/TopPayment'));

const Order = React.lazy(() => import('./views/Order'));

const Menu = React.lazy(() => import('./views/Menu'));

const Sales = React.lazy(() => import('./views/Analysis/Sales'));
const Customer = React.lazy(() => import('./views/Analysis/Customer'));
const Review = React.lazy(() => import('./views/Analysis/Review'));

const Profile = React.lazy(() => import('./views/Account/Profile'));
const TermsCondition = React.lazy(() => import('./views/Account/TermsCondition'));
const PrivacyPolicy = React.lazy(() => import('./views/Account/PrivacyPolicy'));

const routes = [
  { path: '/caterer', exact: true, name: 'Caterer Dashboard', component: DefaultLayout },

  { path: '/caterer/dashboard', name: 'Dashboard', component: Dashboard },

  { path: '/caterer/basics', exact: true, name: 'Basics', component: BusinessProfile },
  { path: '/caterer/basics/businessprofile', name: 'Business Profile', component: BusinessProfile },
  { path: '/caterer/basics/location', name: 'Location', component: Location },
  { path: '/caterer/basics/cuisine', name: 'Cuisine', component: Cuisine },
  { path: '/caterer/basics/onlinepayment', name: 'Online Payment', component: Payment },

  { path: '/caterer/menusetup', name: 'Menu', component: Menu },

  { path: '/caterer/order', name: 'Order', component: Order },

  { path: '/caterer/analysis', exact: true, name: 'Analysis', component: Sales },
  { path: '/caterer/analysis/sales', name: 'Sales', component: Sales },
  { path: '/caterer/analysis/customer', name: 'Customer', component: Customer },
  { path: '/caterer/analysis/review', name: 'Review', component: Review },
 

  { path: '/caterer/account/profile', exact: true, name: 'Profile', component: Profile },
  { path: '/caterer/account/termscondition', exact: true, name: 'Terms & Conditions', component: TermsCondition },
  { path: '/caterer/account/privacypolicy', exact: true, name: 'Privacy Policy', component: PrivacyPolicy },
];

export default routes;
