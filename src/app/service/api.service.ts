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
import { catchError, Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { Product } from 'src/app/interface/product';
import { jsonParse } from 'src/app/lib/object';
import { environment } from './../../environments/environment';
import { Category } from './../interface/category';
import { PagingInfo } from './../interface/paging_info';
import { User } from './../interface/user';

@Injectable({
    providedIn: 'root'
})
export class ApiService implements HttpInterceptor {
    private isDevelopment = true;
    // public baseUrl = environment.apiUrl;
    // public baseUrl = 'https://go.chandrasa.fun/api';
    public apiUrl = environment.apiUrl;

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        if (req.url.includes('demo') || req.url.includes('.json')) return next.handle(req);
        if (this.isDevelopment) console.log('REQUEST:', req.method, req.url, req.body);
        req = req.clone({
            url: this.apiUrl + req.url,
            headers: new HttpHeaders({
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'User': this.encrypt(localStorage.getItem('test'))
            }),
            body: { ...req.body, userCreated: jsonParse(localStorage.getItem('user')).id }
            // body: this.validator.encrypt(req.body),
        });

        return next.handle(req).pipe(
            map((res: HttpEvent<any>) => {
                if (res instanceof HttpResponse) {
                    if (this.isDevelopment) {
                        console.log('RESPONSE:', res.body.status, req.method, req.url, res.body);
                    }
                    return res;
                }
            }),
            catchError((error: HttpErrorResponse) => {
                error = error.error
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
    ) {}

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
    getCategories(pagingInfo: PagingInfo) {
        return this.httpClient.post('/category/findAll', pagingInfo);
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

    findProductById(product: Product) {
        return this.httpClient.post('/product/findById', product);
    }

    findProductByCategory(product: Product) {
        return this.httpClient.post('/product/findByCategory', product);
    }

    createProduct(product: Product) {
        return this.httpClient.post('/product/create', product);
    }

    updateProduct(product: Product) {
        return this.httpClient.post('/product/update', product);
    }

    deleteProduct(product: Product) {
        return this.httpClient.post('/product/delete', product);
    }
}
