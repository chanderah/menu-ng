import { Product } from 'src/app/interface/product';

export interface Order {
  id?: number;
  orderCode?: string;
  tableName: string;
  totalPrice: number;

  isServed: boolean;

  products: Product[];
  productsName?: string;

  token?: string;
  status: string;
  createdAt: Date;
}

export interface OrderReceipt {
  id?: number;
  tableId: number;
  orderCode: string;
  paymentMethod: PaymentMethod;

  taxes: number;
  subTotal: number;
  total?: number;
  receivedAmount: number;
  changes?: number;

  products: Product[];

  issuedAt: Date;
  createdAt: Date;
}

export interface PaymentMethod {
  id: number;
  name: string;
  accountName: string;
  accountNumber: number;

  updatedAt: Date;
  createdAt: Date;
}

export interface ProductOrder {
  id: number;
  image: string;
  code: string;
  name: string;
  price: number;
  options: ProductOrderOption[];
  notes: string;
  quantity: number;
  totalPrice: number;
}

export interface ProductOrderOption {
  name: string;
  multiple: boolean;
  required: boolean;
  values: ProductOrderValue[];
}
export interface ProductOrderValue {
  value: string;
  price: number;
  selected: boolean;
}
