export interface ProductOptions {
    name: string;
    multiple: boolean;
    required: boolean;
    values: ProductOptionValues[];
}

export interface ProductOptionValues {
    name: string;
    price: number;
}
