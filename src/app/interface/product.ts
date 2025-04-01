export interface Product {
  id: string;
  code?: string;
  name: string;
  description?: string;
  price: number;
  inventoryStatus?: string;
  categoryId?: number;
  image?: string;
  rating?: number;
  options?: ProductOption[];

  featured: boolean;
  status: boolean;
  userCreated?: number;
  createdAt?: Date;

  //for order
  totalPrice?: number;
  optionsDetails?: string;
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
  optionsName?: string;
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
