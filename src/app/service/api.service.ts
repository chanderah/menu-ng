import { HttpClient, HttpEvent, HttpHandler, HttpHeaders, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';
import { PagingInfo } from './../interface/paging_info';

@Injectable({
    providedIn: 'root'
})
export class ApiService implements HttpInterceptor {
    // public baseUrl = environment.apiUrl;

    // public baseUrl = 'https://go.chandrasa.fun/api';
    public baseUrl = 'http://localhost:3000/api';

    // header: Object = {
    //     headers: new HttpHeaders({
    //         'Accept': 'application/json',
    //         'Content-Type': 'application/json',
    //         'No-Auth': 'True',
    //         'X-Content-Type-Options': 'nosniff',
    //         'X-Frame-Options': 'SAMEORIGIN',
    //         'Access-Control-Allow-Origin': this.baseUrl,
    //         'Access-Control-Allow-Credentials': 'true',
    //         'Access-Control-Allow-Header': 'Origin, Content-Type, X-Auth-Token, content-type',
    //         'Access-Control-Allow-Methods': 'GET, POST, DELETE, PUT, OPTIONS',
    //         'Strict-Transport-Security': 'max-age=31536000; includeSubdomains',
    //         'Content-Security-Policy': "default-src 'self'",
    //         'Expect-CT': 'max-age=7776000, enforce',
    //         'X-XSS-Protection': '1; mode=block',
    //         'Set-Cookie': 'key=value; SameSite=Strict; httpOnly',
    //         'Referrer-Policy': 'same-origin'
    //     })
    // };

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        if (req.url.includes('demo') || req.url.includes('.json')) return next.handle(req);
        req = req.clone({
            url: this.baseUrl + req.url,
            headers: new HttpHeaders({
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            })
        });
        console.log(req.url);
        return next.handle(req);
    }

    constructor(
        private httpClient: HttpClient,
        private toastr: ToastrService
    ) {
        console.log('am i called');
    }

    // getJokes() {
    //     return this.httpClient.get('https://api.chucknorris.io/jokes/random');
    // }

    getUsers(pagingInfo: PagingInfo) {
        return this.httpClient.post('/user/findAll', pagingInfo);
    }

    getCategories(pagingInfo: PagingInfo) {
        return this.httpClient.post('/category/findAll', pagingInfo);
    }

    getProducts(pagingInfo: PagingInfo) {
        return this.httpClient.post('/product/findAll', pagingInfo);
    }
}
