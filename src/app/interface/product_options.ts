export interface ProductOptions {
    id?: number;
    name: string;
    price: number;
    type: 'radio' | 'checkbox' | 'number' | 'text';
    values: string[];
    multiple: boolean;
}
