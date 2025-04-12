import { environment } from 'src/environments/environment';

export const CONSTANTS = {
  IMAGE_PLACEHOLDER: `${environment.imagePath}/default_product.png`,
  USER_ROLE: {
    1: 'Admin',
    2: 'Super Admin',
  },
  ADMIN_MENU: [
    {
      label: 'Live Orders',
      routerLink: '/admin/order/live',
      role: 1,
    },
    {
      label: 'Orders',
      routerLink: '/admin/order',
      role: 1,
    },
    {
      label: 'Categories',
      routerLink: '/admin/category',
      role: 1,
    },
    {
      label: 'Products',
      routerLink: '/admin/product',
      role: 1,
    },
    {
      label: 'Tables',
      routerLink: '/admin/table',
      role: 1,
    },
    {
      label: 'Payments',
      routerLink: '/admin/payment',
      role: 2,
    },
    {
      label: 'Users',
      routerLink: '/admin/user',
      role: 2,
    },
  ],
  ORDER_STATUS: {
    expire: 'Expired',
    deny: 'Denied',
    pending: 'Pending',
    capture: 'Paid',
    settlement: 'Paid',
    complete: 'Completed',
  },
};
