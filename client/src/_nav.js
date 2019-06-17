export default {
  items: [
    {
      name: 'Dashboard',
      url: '/caterer/dashboard',
      icon: 'icon-speedometer',
    },
    {
      name: 'Basics',
      url: '/caterer/basics',
      icon: 'icon-home',
      children: [
        {
          name: 'Name & Address',
          url: '/caterer/basics/nameaddress',
          icon: '',
        },
        {
          name: 'Description',
          url: '/caterer/basics/description',
          icon: '',
        },
        {
          name: 'Location',
          url: '/caterer/basics/location',
          icon: '',
        },
        {
          name: 'Cuisine',
          url: '/caterer/basics/cuisine',
          icon: '',
        },
        {
          name: 'Occasion',
          url: '/caterer/basics/occasion',
          icon: '',
        },
      ]
    },
    {
      name: 'Services & Hours',
      url: '/caterer/services',
      icon: 'icon-clock',
      children: [
        {
          name: 'Pickup',
          url: '/caterer/services/pickup',
          icon: '',
        },
        {
          name: 'Delivery',
          url: '/caterer/services/delivery',
          icon: '',
        },
        {
          name: 'Delivery Hours',
          url: '/caterer/services/deliveryhours',
          icon: '',
        },
        {
          name: 'Minimum Spending',
          url: '/caterer/services/minspending',
          icon: '',
        },
       
      ]
    },
    {
      name: 'Orders & Menu',
      url: '/caterer/ordersmenu',
      icon: 'icon-book-open',
      children: [
        {
          name: 'Receive Order',
          url: '/caterer/ordersmenu/receiveorder',
          icon: '',
        },
        {
          name: 'Menu Setup',
          url: '/caterer/ordersmenu/menusetup',
          icon: '',
        },
        
      ]
    },
    {
      name: 'Payment',
      url: '/caterer/payment',
      icon: 'icon-credit-card',
      children: [
        {
          name: 'Online Payment',
          url: '/caterer/payment/onlinepayment',
          icon: '',
        },
      ]
    },
    {
      name: 'Reports',
      url: '/caterer/reports',
      icon: 'icon-chart',
      children: [
        {
          name: 'Order',
          url: '/caterer/reports/order',
          icon: '',
        },
        {
          name: 'Sales',
          url: '/caterer/reports/sales',
          icon: '',
        },
        {
          name: 'Customer',
          url: '/caterer/reports/customer',
          icon: '',
        },
        {
          name: 'Review',
          url: '/caterer/reports/review',
          icon: '',
        },
        {
          name: 'Dishes',
          url: '/caterer/reports/dishes',
          icon: '',
        },
      ]
    },
    {
      name: 'Publish',
      url: '/caterer/publish',
      icon: 'icon-rocket',
      children: [
        {
          name: 'Publish Store',
          url: '/caterer/publish/publish',
          icon: '',
        },
      ]
    }, 
  ],
};
