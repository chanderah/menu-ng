import {
    HttpClient,
    HttpErrorResponse,
    HttpEvent,
    HttpHandler,
    HttpHeaders,
    HttpInterceptor,
    HttpRequest,
    HttpResponse,
    HttpStatusCode
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { Product } from 'src/app/interface/product';
import SharedUtil from '../lib/shared.util';
import { environment } from './../../environments/environment';
import { Category } from './../interface/category';
import { Order } from './../interface/order';
import { PagingInfo } from './../interface/paging_info';
import { Table } from './../interface/table';
import { User } from './../interface/user';
import { jsonParse } from './../lib/shared.util';

@Injectable({
    providedIn: 'root'
})
export class ApiService extends SharedUtil implements HttpInterceptor {
    private apiUrl: string = environment.apiUrl;

    constructor(private httpClient: HttpClient) {
        super();
    }

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        if (req.url.includes('.json')) return next.handle(req);
        if (this.isDevelopment) console.log('REQUEST:', req.method, req.url, req.body);

        const user = jsonParse(localStorage.getItem('user')) as User;
        req = req.clone({
            url: this.apiUrl + req.url,
            headers: new HttpHeaders({
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'User': 'Unauthorized'
            }),
            body: { ...req.body, userCreated: user?.id || 0 }
            // body: this.validator.encrypt(req.body),
        });
        return next.handle(req).pipe(
            map((res: HttpEvent<any>) => {
                if (res instanceof HttpResponse) {
                    if (this.isDevelopment) console.log('RESPONSE:', res.body.status, req.method, req.url, res.body);
                    return res;
                }
            }),
            catchError((error: HttpErrorResponse) => {
                error = error.error?.message
                    ? error.error
                    : {
                          status: error.status === 0 ? HttpStatusCode.InternalServerError : error.status,
                          message: error.message ? error.message : 'Something went wrong.'
                      };
                if (this.isDevelopment) console.error('ERROR:', req.method, req.url, error, req.body);
                return of(new HttpResponse({ body: error }));
            })
        );
    }

    /* AUTH */
    register(user: User) {
        return this.httpClient.post('/user/register', user);
    }

    login(user: User) {
        return this.httpClient.post('/user/login', user);
    }

    /* USER */
    getUsers(pagingInfo: PagingInfo) {
        return this.httpClient.post('/user/findAll', pagingInfo);
    }

    getUserRoles() {
        return this.httpClient.post('/user/role/findAll', {});
    }

    findUserById(user: User) {
        return this.httpClient.post('/user/findById', user);
    }

    findUserByUsername(user: User) {
        return this.httpClient.post('/user/findByUsername', user);
    }

    updateUser(user: User) {
        return this.httpClient.post('/user/update', user);
    }

    updateFcmToken(user: User) {
        return this.httpClient.post('/user/updateFcmToken', user);
    }

    deleteUser(user: User) {
        return this.httpClient.post('/user/deleteUser', user);
    }

    /* CATEGORY */
    getCategories() {
        return this.httpClient.post('/category/findAll', {});
    }

    findCategoryById(category: Category) {
        return this.httpClient.post('/category/findById', category);
    }

    createCategory(category: Category) {
        return this.httpClient.post('/category/create', category);
    }

    updateCategory(category: Category) {
        return this.httpClient.post('/category/update', category);
    }

    deleteCategory(category: Category) {
        return this.httpClient.post('/category/delete', category);
    }

    /* TABLE */
    getTables(pagingInfo: PagingInfo) {
        return this.httpClient.post('/table/findAll', pagingInfo);
    }

    findTableById(table: Table) {
        return this.httpClient.post('/table/findById', table);
    }

    createTable(table: Table) {
        return this.httpClient.post('/table/create', table);
    }

    updateTable(table: Table) {
        return this.httpClient.post('/table/update', table);
    }

    deleteTable(table: Table) {
        return this.httpClient.post('/table/delete', table);
    }

    /* PRODUCT */
    getProducts(pagingInfo: PagingInfo) {
        return this.httpClient.post('/product/findAll', pagingInfo);
    }

    findProductByCategory(product: Product) {
        return this.httpClient.post('/product/findByCategory', product);
    }

    findActiveProductByCategoryParam(pagingInfo: PagingInfo) {
        return this.httpClient.post('/product/findActiveByCategoryParam', pagingInfo);
    }

    findProductById(product: Product) {
        return this.httpClient.post('/product/findById', product);
    }

    createProduct(product: Product) {
        // const p = { ...product, options: JSON.stringify(product.options) };
        return this.httpClient.post('/product/create', product);
    }

    updateProduct(product: Product) {
        console.log(product);
        // const p = { ...product, options: JSON.stringify(product.options) };
        return this.httpClient.post('/product/update', product);
    }

    deleteProduct(product: Product) {
        return this.httpClient.post('/product/delete', product);
    }

    /* ORDER */
    markOrderAsDone(fromId: number, toId: number) {
        return this.httpClient.post('/order/markAsDone', { fromId, toId });
    }

    getLiveOrders(lastFetchedId: number, limit: number) {
        return this.httpClient.post('/order/findLive', { id: lastFetchedId, limit });
    }

    getOrders(pagingInfo: PagingInfo) {
        return this.httpClient.post('/order/findAll', pagingInfo);
    }

    getOrderById(orderId: number) {
        return this.httpClient.post('/order/findById', { orderId });
    }

    createOrder(order: Order) {
        return this.httpClient.post('/order/create', order);
    }

    updateOrder(orderId: number) {
        return this.httpClient.post('/order/update', { orderId });
    }

    deleteOrder(orderId: number) {
        return this.httpClient.post('/order/delete', { orderId });
    }

    getPaymentMethods() {
        return this.httpClient.post('/payment/findAllMethod', {});
    }
}
