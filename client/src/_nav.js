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
      name: 'Operation',
      url: '/caterer/operation',
      icon: 'icon-clock',
      children: [
        {
          name: 'Pickup',
          url: '/caterer/operation/pickup',
          icon: '',
        },
        {
          name: 'Delivery',
          url: '/caterer/operation/delivery',
          icon: '',
        },
        {
          name: 'Delivery Hours',
          url: '/caterer/operation/deliveryhours',
          icon: '',
        },
        {
          name: 'Minimum Spending',
          url: '/caterer/operation/minspending',
          icon: '',
        },
        {
          name: 'Receive Order',
          url: '/caterer/operation/receiveorder',
          icon: '',
        },
      ]
    },
    {
      name: 'GoLunch',
      url: '/caterer/golunch',
      icon: 'icon-fire',
      children: [
        {
          name: 'Menu Setup',
          url: '/caterer/golunch/menusetup',
          icon: '',
        },
        {
          name: 'Order',
          url: '/caterer/golunch/order',
          icon: '',
        },
        {
          name: 'Sales',
          url: '/caterer/golunch/sales',
          icon: '',
        },
        {
          name: 'Dishes',
          url: '/caterer/golunch/dishes',
          icon: '',
        },
      ]
    },
    {
      name: 'GoCatering',
      url: '/caterer/gocatering',
      icon: 'icon-energy',
      children: [
        {
          name: 'Menu Setup',
          url: '/caterer/gocatering/menusetup',
          icon: '',
        },
        {
          name: 'Order',
          url: '/caterer/gocatering/order',
          icon: '',
        },
        {
          name: 'Sales',
          url: '/caterer/gocatering/sales',
          icon: '',
        },
        {
          name: 'Customer',
          url: '/caterer/gocatering/customer',
          icon: '',
        },
        {
          name: 'Dishes',
          url: '/caterer/gocatering/dishes',
          icon: '',
        },
      ]
    },
    {
      name: 'Payment',
      url: '/caterer/payment',
      icon: 'icon-wallet',
      children: [
        {
          name: 'Online Payment',
          url: '/caterer/payment/onlinepayment',
          icon: '',
        },
      ]
    },
    {
      name: 'Review',
      url: '/caterer/review',
      icon: 'icon-star',
      children: [
        {
          name: 'Review',
          url: '/caterer/review/review',
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
