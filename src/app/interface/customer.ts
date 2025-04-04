export interface Customer {
  table?: Table;
  name?: string;
  orderId?: number;
  phone?: number;
  createdAt: Date;
}

export interface Table {
  id: number;
  name: string;
  status: boolean;
  createdAt: Date;
}
