export interface ProductOptions {
    name: string;
    multiple: boolean;
    required: boolean;

    values: ProductOptionValues[];
}

export interface ProductOptionValues {
    variant: string;
    price: number;
}

// [
//     {
//         name: 'Milk',
//         multiple: true,
//         required: true,
//         value: [
//             {
//                 'no milk': 0
//             }, {
//                 "extra": 0
//             }
//         ]
//     }
// ];
