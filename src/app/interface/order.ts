import { Product } from 'src/app/interface/product';

export interface Order {
    id?: number;
    tableId: string;
    totalPrice: number;
    createdAt: Date;

    products: Product[];
}
