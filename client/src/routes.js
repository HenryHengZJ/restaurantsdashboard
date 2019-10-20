import React from 'react';
import DefaultLayout from './containers/DefaultLayout';

const Dashboard = React.lazy(() => import('./views/Dashboard'));

const NameAddress = React.lazy(() => import('./views/Basics/NameAddress'));
const Description = React.lazy(() => import('./views/Basics/Description'));
const Location = React.lazy(() => import('./views/Basics/Location'));
const Website = React.lazy(() => import('./views/Basics/Website'));
const Cuisine = React.lazy(() => import('./views/Basics/Cuisine'));
const Occasion = React.lazy(() => import('./views/Basics/Occasion'));
const ValidateEmail = React.lazy(() => import('./views/Basics/ValidateEmail'));

const Pickup = React.lazy(() => import('./views/Operation/Pickup'));
const Delivery = React.lazy(() => import('./views/Operation/Delivery'));
const MinSpending = React.lazy(() => import('./views/Operation/MinSpending'));
const DeliveryHours = React.lazy(() => import('./views/Operation/DeliveryHours'));
const OrderLater = React.lazy(() => import('./views/Operation/OrderLater'));
const ReceiveOrder = React.lazy(() => import('./views/Operation/ReceiveOrder'));

const MenuSetup = React.lazy(() => import('./views/GoCatering/MenuSetup'));
const Order = React.lazy(() => import('./views/GoCatering/Order'));
const Sales = React.lazy(() => import('./views/GoCatering/Sales'));
const Customer = React.lazy(() => import('./views/GoCatering/Customer'));
const Dishes = React.lazy(() => import('./views/GoCatering/Dishes'));

const MenuSetup_Lunch = React.lazy(() => import('./views/GoLunch/MenuSetup'));
const Order_Lunch = React.lazy(() => import('./views/GoLunch/Order'));
const Sales_Lunch = React.lazy(() => import('./views/GoLunch/Sales'));
const Dishes_Lunch = React.lazy(() => import('./views/GoLunch/Dishes'));

const TopPayment = React.lazy(() => import('./views/Payment/TopPayment'));

const Publish = React.lazy(() => import('./views/Publish/Publish'));

const Review = React.lazy(() => import('./views/Review/Review'));

const Profile = React.lazy(() => import('./views/Account/Profile'));
const TermsCondition = React.lazy(() => import('./views/Account/TermsCondition'));
const PrivacyPolicy = React.lazy(() => import('./views/Account/PrivacyPolicy'));

const routes = [
  { path: '/caterer', exact: true, name: 'Caterer Dashboard', component: DefaultLayout },
  { path: '/caterer/dashboard', name: 'Dashboard', component: Dashboard },
  { path: '/caterer/basics', exact: true, name: 'Basics', component: NameAddress },
  { path: '/caterer/basics/nameaddress', name: 'Name & Address', component: NameAddress },
  { path: '/caterer/basics/description', name: 'Description', component: Description },
  { path: '/caterer/basics/location', name: 'Location', component: Location },
  { path: '/caterer/basics/website', name: 'Website', component: Website },
  { path: '/caterer/basics/cuisine', name: 'Cuisine', component: Cuisine },
  { path: '/caterer/basics/occasion', name: 'Occasion', component: Occasion },
  { path: '/caterer/basics/validateemail', name: 'Account Confirmation', component: ValidateEmail },

  { path: '/caterer/operation', exact: true, name: 'Operation', component: Pickup },
  { path: '/caterer/operation/pickup', name: 'Pickup', component: Pickup },
  { path: '/caterer/operation/delivery', name: 'Delivery', component: Delivery },
  { path: '/caterer/operation/minspending', name: 'Minimum Spending', component: MinSpending },
  { path: '/caterer/operation/deliveryhours', name: 'Delivery Hours', component: DeliveryHours },
  { path: '/caterer/operation/receiveorder', name: 'Receive Order', component: ReceiveOrder },
  { path: '/caterer/operation/orderlater', name: 'Order for Later', component: OrderLater },

  { path: '/caterer/gocatering', exact: true, name: 'GoCatering', component: MenuSetup },
  { path: '/caterer/gocatering/menusetup', name: 'Menu Setup', component: MenuSetup },
  { path: '/caterer/gocatering/order', name: 'Order', component: Order },
  { path: '/caterer/gocatering/sales', name: 'Sales', component: Sales },
  { path: '/caterer/gocatering/customer', name: 'Customer', component: Customer },
  { path: '/caterer/gocatering/dishes', name: 'Dishes', component: Dishes },

  { path: '/caterer/golunch', exact: true, name: 'GoLunch', component: MenuSetup_Lunch },
  { path: '/caterer/golunch/menusetup', name: 'Menu Setup', component: MenuSetup_Lunch },
  { path: '/caterer/golunch/order', name: 'Order', component: Order_Lunch },
  { path: '/caterer/golunch/sales', name: 'Sales', component: Sales_Lunch },
  { path: '/caterer/golunch/dishes', name: 'Dishes', component: Dishes_Lunch },

  { path: '/caterer/payment', exact: true, name: 'Payment', component: TopPayment },
  { path: '/caterer/payment/onlinepayment', name: 'Online Payment', component: TopPayment },

  { path: '/caterer/review', exact: true, name: 'Review', component: Review },
  { path: '/caterer/review/review', name: 'Review', component: Review },

  { path: '/caterer/publish', exact: true, name: 'Publish', component: Publish },
  { path: '/caterer/publish/publish', name: 'Publish Store', component: Publish },

  { path: '/caterer/account/profile', exact: true, name: 'Profile', component: Profile },
  { path: '/caterer/account/termscondition', exact: true, name: 'Terms & Conditions', component: TermsCondition },
  { path: '/caterer/account/privacypolicy', exact: true, name: 'Privacy Policy', component: PrivacyPolicy },
];

export default routes;
