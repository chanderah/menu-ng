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
import { ToastrService } from 'ngx-toastr';
import { Observable, catchError, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { Product } from 'src/app/interface/product';
import { CustomerInfo } from '../interface/customer_info';
import CommonUtil from '../lib/shared.util';
import { environment } from './../../environments/environment';
import { Category } from './../interface/category';
import { PagingInfo } from './../interface/paging_info';
import { User } from './../interface/user';

@Injectable({
    providedIn: 'root'
})
export class ApiService extends CommonUtil implements HttpInterceptor {
    private isDevelopment: boolean = environment.production === false;
    private apiUrl: string = environment.apiUrl;

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        if (req.url.includes('demo') || req.url.includes('.json')) return next.handle(req);
        if (this.isDevelopment) console.log('REQUEST:', req.method, req.url, req.body);

        const user = this.jsonParse(localStorage.getItem('user'));
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

    constructor(
        private httpClient: HttpClient,
        private toastr: ToastrService
    ) {
        super();
    }

    encrypt(data: any): string {
        return data;
    }

    decrypt(data: any) {
        return data;
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

    findUserById(user: User) {
        return this.httpClient.post('/user/findById', user);
    }

    findUserByUsername(user: User) {
        return this.httpClient.post('/user/findByUsername', user);
    }

    updateUser(user: User) {
        return this.httpClient.post('/user/findByUsername', user);
    }

    deleteUser(user: User) {
        return this.httpClient.post('/user/findByUsername', user);
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

    /* PRODUCT */
    getProducts(pagingInfo: PagingInfo) {
        return this.httpClient.post('/product/findAll', pagingInfo);
    }

    getActiveProducts(pagingInfo: PagingInfo) {
        return this.httpClient.post('/product/findActive', pagingInfo);
    }

    getFeaturedProducts() {
        return this.httpClient.post('/product/findFeatured', {});
    }

    findProductById(product: Product) {
        return this.httpClient.post('/product/findById', product);
    }

    findProductByCategory(product: Product) {
        return this.httpClient.post('/product/findByCategory', product);
    }

    findActiveProductByCategory(pagingInfo: PagingInfo) {
        return this.httpClient.post('/product/findActiveByCategory', pagingInfo);
    }

    findActiveProductByCategoryParam(pagingInfo: PagingInfo) {
        return this.httpClient.post('/product/findActiveByCategoryParam', pagingInfo);
    }

    createProduct(product: Product) {
        // const p = { ...product, options: JSON.stringify(product.options) };
        return this.httpClient.post('/product/create', product);
    }

    updateProduct(product: Product) {
        // const p = { ...product, options: JSON.stringify(product.options) };
        return this.httpClient.post('/product/update', product);
    }

    deleteProduct(product: Product) {
        return this.httpClient.post('/product/delete', product);
    }

    /* ORDER */
    getOrders(customerInfo: CustomerInfo) {
        return this.httpClient.post('/order/findAll', {});
    }

    getOrderById(orderId: number) {
        return this.httpClient.post('/order/findById', { orderId: orderId });
    }

    updateOrder(orderId: number) {
        return this.httpClient.post('/order/update', { orderId: orderId });
    }

    deleteOrder(orderId: number) {
        return this.httpClient.post('/order/delete', { orderId: orderId });
    }
}
