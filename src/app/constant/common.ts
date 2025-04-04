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
      label: 'Manage Orders',
      routerLink: '/admin/order',
      role: 1,
    },
    {
      label: 'Manage Categories',
      routerLink: '/admin/category',
      role: 1,
    },
    {
      label: 'Manage Products',
      routerLink: '/admin/product',
      role: 1,
    },
    {
      label: 'Manage Tables',
      routerLink: '/admin/table',
      role: 1,
    },
    {
      label: 'Manage Users',
      routerLink: '/admin/user',
      role: 2,
    },
  ],
};
