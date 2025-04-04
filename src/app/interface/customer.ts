export interface Customer {
  table?: Table;
  name?: string;
  phone?: number;

  listOrderId: string[];
  createdAt: Date;
}

export interface Table {
  id: number;
  name: string;
  status: boolean;
  createdAt: Date;
}
