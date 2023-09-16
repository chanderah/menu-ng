export interface ProductOrder {
    id?: string;
    price?: number;
    quantity?: number;
    image?: string;

    options?: ProductOptions[];

    //for order
    totalPrice?: number;
    notes?: string;
    qty?: number;
}

export interface ProductOptions {
    name: string;
    multiple: boolean;
    required: boolean;

    values: ProductOptionValues[];
}

export interface ProductOptionValues {
    value: string;
    price: number;
    selected?: boolean;
}
