import { Product } from 'src/app/interface/product';

export interface Order {
    id?: number;
    orderCode?: string;
    tableId: number;
    totalPrice: number;
    createdAt: Date;

    isNew?: boolean;

    products: Product[];
    productsName: string;
}
