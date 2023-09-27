export interface Product {
    id?: string;
    code?: string;
    name?: string;
    description?: string;
    price?: number;
    inventoryStatus?: string;
    category?: string;
    image?: string;
    rating?: number;

    options?: ProductOptions[];

    //for order
    totalPrice?: number;
    optionsDetails?: string;
    notes?: string;
    quantity?: number;

    createdAt?: Date;
    userCreated?: number;
}

export interface ProductOptions {
    name: string;
    multiple: boolean;
    required: boolean;

    values: ProductOptionValues[];
    optionsName?: string;
}

export interface ProductOptionValues {
    value: string;
    price: number;
    selected?: boolean;
}
