import {
    HttpClient,
    HttpErrorResponse,
    HttpEvent,
    HttpHandler,
    HttpHeaders,
    HttpInterceptor,
    HttpRequest,
    HttpResponse,
    HttpStatusCode,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, of } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { Product } from 'src/app/interface/product';
import { environment } from './../../environments/environment';
import { Category } from './../interface/category';
import { Order } from './../interface/order';
import { PagingInfo } from './../interface/paging_info';
import { Table } from './../interface/table';
import { User } from './../interface/user';
import { Aes256Service } from './aes256.service';
import { isDevelopment, jsonParse } from '../lib/utils';

@Injectable({
    providedIn: 'root',
})
export class ApiService implements HttpInterceptor {
    private apiUrl: string = environment.apiUrl;

    constructor(
        private httpClient: HttpClient,
        private aes256Service: Aes256Service
    ) {}

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        if (req.url.includes('.json')) return next.handle(req);
        if (isDevelopment) console.log('REQUEST:', req.method, req.url, req.body);

        const user = jsonParse(localStorage.getItem('user')) as User;
        req = req.clone({
            url: this.apiUrl + req.url,
            headers: new HttpHeaders({
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                ...(user?.id && {
                    User: user.id.toString(),
                }),
            }),
            body: req.body,
            // body: this.aes256Service.encrypt(this.jsonStringify(req.body))
        });
        return next.handle(req).pipe(
            filter((e) => e?.type !== 0),
            map((res: any) => {
                if (res instanceof HttpResponse) {
                    if (res.body?.encryptedData) {
                        res = res.clone({
                            body: jsonParse(this.aes256Service.decrypt(res.body.encryptedData)),
                        });
                    }
                    if (isDevelopment) console.log('RESPONSE:', res.body.status, req.method, req.url, res.body);
                }
                return res;
            }),
            catchError((err: HttpErrorResponse) => {
                err = err.error?.message
                    ? err.error
                    : {
                          status: err.status === 0 ? HttpStatusCode.InternalServerError : err.status,
                          message: err.message ? err.message : 'Something went wrong.',
                      };
                if (isDevelopment) console.error('ERROR:', req.method, req.url, err, req.body);
                return of(new HttpResponse({ body: err }));
            })
        );
    }

    register(user: User) {
        return this.httpClient.post<any>('/user/register', user);
    }

    login(user: User) {
        return this.httpClient.post<any>('/user/login', user);
    }

    getUsers(pagingInfo: PagingInfo) {
        return this.httpClient.post<any>('/user/findAll', pagingInfo);
    }

    getUserRoles() {
        return this.httpClient.post<any>('/user/role/findAll', {});
    }

    findUserById(user: User) {
        return this.httpClient.post<any>('/user/findById', user);
    }

    findUserByUsername(user: User) {
        return this.httpClient.post<any>('/user/findByUsername', user);
    }

    updateUser(user: User) {
        return this.httpClient.post<any>('/user/update', user);
    }

    updateFcmToken(user: User) {
        return this.httpClient.post<any>('/user/updateFcmToken', user);
    }

    deleteUser(user: User) {
        return this.httpClient.post<any>('/user/deleteUser', user);
    }

    /* CATEGORY */
    getCategories() {
        return this.httpClient.post<any>('/category/findAll', {});
    }

    findCategoryById(category: Category) {
        return this.httpClient.post<any>('/category/findById', category);
    }

    createCategory(category: Category) {
        return this.httpClient.post<any>('/category/create', category);
    }

    updateCategory(category: Category) {
        return this.httpClient.post<any>('/category/update', category);
    }

    deleteCategory(category: Category) {
        return this.httpClient.post<any>('/category/delete', category);
    }

    /* TABLE */
    getTables(pagingInfo: PagingInfo) {
        return this.httpClient.post<any>('/table/findAll', pagingInfo);
    }

    findTableById(table: Table) {
        return this.httpClient.post<any>('/table/findById', table);
    }

    createTable(table: Table) {
        return this.httpClient.post<any>('/table/create', table);
    }

    updateTable(table: Table) {
        return this.httpClient.post<any>('/table/update', table);
    }

    deleteTable(table: Table) {
        return this.httpClient.post<any>('/table/delete', table);
    }

    /* PRODUCT */
    getProducts(pagingInfo: PagingInfo) {
        return this.httpClient.post<any>('/product/findAll', pagingInfo);
    }

    findProductByCategory(product: Product) {
        return this.httpClient.post<any>('/product/findByCategory', product);
    }

    findActiveProductByCategoryParam(pagingInfo: PagingInfo) {
        return this.httpClient.post<any>('/product/findActiveByCategoryParam', pagingInfo);
    }

    findProductById(product: Product) {
        return this.httpClient.post<any>('/product/findById', product);
    }

    createProduct(product: Product) {
        // const p = { ...product, options: JSON.stringify(product.options) };
        return this.httpClient.post<any>('/product/create', product);
    }

    updateProduct(product: Product) {
        console.log(product);
        // const p = { ...product, options: JSON.stringify(product.options) };
        return this.httpClient.post<any>('/product/update', product);
    }

    deleteProduct(product: Product) {
        return this.httpClient.post<any>('/product/delete', product);
    }

    /* ORDER */
    markOrderAsDone(fromId: number, toId: number) {
        return this.httpClient.post<any>('/order/markAsDone', { fromId, toId });
    }

    getLiveOrders(lastFetchedId: number, limit: number) {
        return this.httpClient.post<any>('/order/findLive', { id: lastFetchedId, limit });
    }

    getOrders(pagingInfo: PagingInfo) {
        return this.httpClient.post<any>('/order/findAll', pagingInfo);
    }

    getOrderById(orderId: number) {
        return this.httpClient.post<any>('/order/findById', { orderId });
    }

    createOrder(order: Order) {
        return this.httpClient.post<any>('/order/create', order);
    }

    updateOrder(orderId: number) {
        return this.httpClient.post<any>('/order/update', { orderId });
    }

    deleteOrder(orderId: number) {
        return this.httpClient.post<any>('/order/delete', { orderId });
    }

    getPaymentMethods() {
        return this.httpClient.post<any>('/payment/findAllMethod', {});
    }
}
