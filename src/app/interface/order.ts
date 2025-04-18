import { Product } from 'src/app/interface/product';

export interface Order {
  id?: number;
  orderCode?: string;
  tableName: string;
  totalPrice: number;
  receivedAmount: number;
  isServed: boolean;
  products: Product[];
  token?: string;
  paymentType: PaymentType;
  paymentMethod?: string;
  status: string;

  updatedBy: number;
  updatedAt: Date;
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
  label: string;
  description: string;
  isActive: boolean;
  updatedAt: Date;
  createdAt: Date;
}
export interface WithdrawalMethod {
  id: number;
  label: string;
  account: {
    name: string;
    number: string;
  };
  description: string;
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

export enum PaymentType {
  COUNTER = 'counter',
  GATEWAY = 'gateway',
}
