import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpResponse,
  HttpErrorResponse,
  HttpStatusCode,
  HttpHeaders,
} from '@angular/common/http';
import { catchError, filter, map, Observable, of } from 'rxjs';
import { isDevelopment, jsonParse } from '../lib/utils';
import { Aes256Service } from '../service/aes256.service';
import { environment } from 'src/environments/environment';
import { User } from '../interface/user';

@Injectable()
export class ApiInterceptor implements HttpInterceptor {
  constructor(private aes256Service: Aes256Service) {}

  intercept(req: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    if (req.url.includes('.json')) return next.handle(req);
    if (isDevelopment) console.log('REQUEST:', req.method, req.url, req.body);

    const headers = req.headers.keys().reduce((acc, key) => {
      acc[key] = req.headers.get(key);
      return acc;
    }, {});

    // const isFormData = req.body instanceof FormData;
    req = req.clone({
      url: environment.apiUrl + req.url,
      headers: this.getDefaultHeaders(headers),
      body: req.body,
      // body: isFormData ? req.body : this.aes256Service.encrypt(jsonStringify(req.body)),
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

  getDefaultHeaders(objHeaders: { [x: string]: string } = {}) {
    const user = jsonParse<User>(localStorage.getItem('user'));
    return new HttpHeaders({
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      ...(user?.id && { User: user.id.toString() }),
      ...objHeaders,
    });
  }
}
