export default {
  items: [
    {
      name: 'Dashboard',
      url: '/restaurant/dashboard',
      icon: 'icon-speedometer',
    },
    {
      name: 'Basics',
      url: '/restaurant/basics',
      icon: 'icon-home',
      children: [
        {
          name: 'Profile',
          url: '/restaurant/basics/businessprofile',
          icon: '',
        },
        {
          name: 'Location',
          url: '/restaurant/basics/location',
          icon: '',
        },
        {
          name: 'Online Payment',
          url: '/restaurant/basics/onlinepayment',
          icon: '',
        },
      ]
    },
    {
      name: 'Menu',
      url: '/restaurant/menusetup',
      icon: 'icon-book-open',
    },
    {
      name: 'Order',
      url: '/restaurant/order',
      icon: 'icon-bell',
    },
    {
      name: 'Analysis',
      url: '/restaurant/analysis',
      icon: 'icon-chart',
      children: [
        {
          name: 'Sales',
          url: '/restaurant/analysis/sales',
          icon: '',
        },
        {
          name: 'Customer',
          url: '/restaurant/analysis/customer',
          icon: '',
        },
      ]
    },
  ],
};
