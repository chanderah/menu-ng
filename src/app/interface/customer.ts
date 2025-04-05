export interface Customer {
  table?: Table;
  name?: string;
  phone?: number;

  listOrderId: number[];
  createdAt: Date;
}

export interface Table {
  id: number;
  name: string;
  status: boolean;
  createdAt: Date;
}
