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
          name: 'Profile',
          url: '/caterer/basics/businessprofile',
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
          name: 'Online Payment',
          url: '/caterer/basics/onlinepayment',
          icon: '',
        },
      ]
    },
    {
      name: 'Menu',
      url: '/caterer/menusetup',
      icon: 'icon-book-open',
    },
    {
      name: 'Order',
      url: '/caterer/order',
      icon: 'icon-bell',
    },
    {
      name: 'Analysis',
      url: '/caterer/analysis',
      icon: 'icon-chart',
      children: [
        {
          name: 'Sales',
          url: '/caterer/analysis/sales',
          icon: '',
        },
        {
          name: 'Customer',
          url: '/caterer/analysis/customer',
          icon: '',
        },
        {
          name: 'Review',
          url: '/caterer/analysis/review',
          icon: '',
        },
      ]
    },
  ],
};
