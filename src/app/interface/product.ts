export interface Product {
    id?: string;
    code?: string;
    name?: string;
    description?: string;
    price?: number;
    quantity?: number;
    inventoryStatus?: string;
    category?: string;
    image?: string;
    rating?: number;
    userCreated?: number;

    options?: ProductOptions[];

    //for order
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
