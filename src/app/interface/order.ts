import { Product } from 'src/app/interface/product';

export interface Order {
    id?: number;
    orderCode?: string;
    tableId: number;
    totalPrice: number;
    createdAt: Date;

    isNew?: boolean;

    products: Product[];
    productsName?: string;
}

export interface OrderReceipt {
    id?: number;
    tableId: number;
    orderCode: string;

    taxes: number;
    subTotal: number;
    total: number;
    receivedAmount: number;
    changes: number;

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
