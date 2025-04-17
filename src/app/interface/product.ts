export interface Product {
  id: string;
  code?: string;
  name: string;
  description?: string;
  price: number;
  categoryId?: number;
  image?: string;
  options?: ProductOption[];

  featured: boolean;
  status: boolean;
  createdBy?: number;
  createdAt?: Date;

  totalPrice?: number;
  notes?: string;
  quantity?: number;
}

export interface ProductOption {
  id: number;
  productId: number;
  name: string;
  multiple: boolean;
  required: boolean;

  values: ProductOptionValue[];
  createdAt?: Date;
}

export interface ProductOptionValue {
  id: number;
  productOptionId: number;
  value: string;
  price: number;
  selected?: boolean;
  createdAt?: Date;
}
