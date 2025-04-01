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
  options?: ProductOptions[];

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

export interface ProductOptions {
  id: number;
  productId: number;
  name: string;
  multiple: boolean;
  required: boolean;

  values: ProductOptionValues[];
  optionsName?: string;
  createdAt?: Date;
}

export interface ProductOptionValues {
  id: number;
  productOptionId: number;
  value: string;
  price: number;
  selected?: boolean;
  createdAt?: Date;
}
