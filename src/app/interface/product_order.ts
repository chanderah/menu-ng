export interface ProductOrder {
    id?: string;
    name?: string;
    price?: number;
    image?: string;

    options?: ProductOrderOptions[];

    //for order
    quantity?: number;
    notes?: string;
    totalPrice?: number;
}

export interface ProductOrderOptions {
    name: string;
    values: ProductOrderOptionValues[];
}

export interface ProductOrderOptionValues {
    value: string;
    price: number;
    selected?: boolean;
}
