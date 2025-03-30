import { Injectable } from '@angular/core';
import { Product } from 'src/app/interface/product';
import { CustomerInfo } from '../interface/customer_info';
import { isEmpty, jsonParse, jsonStringify } from '../lib/utils';
import { Order, OrderReceipt } from './../interface/order';
import { ApiService } from './api.service';
import { SharedService } from './shared.service';

@Injectable({
    providedIn: 'root',
})
export class OrderService {
    customerInfo = {} as CustomerInfo;
    order = {} as Order;
    cart = [] as Product[];

    constructor(
        private sharedService: SharedService,
        private apiService: ApiService
    ) {}

    getOrders(): Order {
        const data = jsonParse(localStorage.getItem('order')) as Order;
        if (!isEmpty(data)) this.order = data;
        return this.order;
        // SHOULD BE DB!!
    }

    getMyOrders(): Order {
        const data = jsonParse(localStorage.getItem('order')) as Order;
        if (!isEmpty(data)) this.order = data;
        return this.order;
    }

    setMyOrders(order: Order) {
        localStorage.setItem('order', jsonStringify(order));
    }

    finishOrder(totalPrice: number) {
        localStorage.setItem(
            'order',
            jsonStringify({
                products: this.getCart(),
                tableId: this.getCustomerInfo().tableId,
                totalPrice: totalPrice,
                createdAt: new Date(),
            } as Order)
        );
        this.clearCart();
    }

    createOrder(order: Order) {
        this.getCustomerInfo();
        order = {
            ...order,
            tableId: this.customerInfo.tableId,
            createdAt: new Date(),
        };
        this.setCart(order.products);
        this.setMyOrders(order);

        return new Promise((resolve) => {
            this.apiService.createOrder(order).subscribe((res: any) => resolve(res));
        });
    }

    async generateOrderReceipt(order: OrderReceipt): Promise<OrderReceipt> {
        return new Promise((resolve) => {
            order.changes = order.receivedAmount - order.total;
            resolve(order);
        });
    }

    getCustomerInfo(): CustomerInfo {
        const data: CustomerInfo = jsonParse(localStorage.getItem('customer')) as CustomerInfo;
        if (!isEmpty(data)) this.customerInfo = data;
        else this.customerInfo = null;
        return this.customerInfo;
    }

    setCustomerInfo(data: CustomerInfo) {
        localStorage.setItem('customer', jsonStringify(data));
    }

    clearCart() {
        localStorage.removeItem('cart');
    }

    getCart(): Product[] {
        const data = jsonParse(localStorage.getItem('cart')) as Product[];
        if (!isEmpty(data)) this.cart = data;
        return this.cart;
    }

    setCart(products: Product[]) {
        localStorage.setItem('cart', jsonStringify(products));
    }

    addToCart(product: Product) {
        this.getCart();
        this.getCustomerInfo();
        this.cart.push(this.filterProductOptions(product));

        localStorage.setItem('cart', jsonStringify(this.cart));
        localStorage.setItem('customer', jsonStringify(this.customerInfo));

        this.sharedService.showNotification('The item is successfully added to cart!');
    }

    filterProductOptions(product: Product) {
        for (let i = product.options.length - 1; i >= 0; i--) {
            for (let j = product.options[i].values.length - 1; j >= 0; j--) {
                if (!product.options[i].values[j].selected) {
                    product.options[i].values.splice(j, 1);
                }
            }
            if (product.options[i].values.length === 0) product.options.splice(i, 1);
        }
        return product;
    }
}
