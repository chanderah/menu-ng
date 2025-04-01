import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpResponse,
  HttpErrorResponse,
  HttpStatusCode,
} from '@angular/common/http';
import { catchError, filter, map, Observable, of } from 'rxjs';
import { isDevelopment, jsonParse } from '../lib/utils';
import { Aes256Service } from '../service/aes256.service';
import { environment } from 'src/environments/environment';
import { User } from '../interface/user';
import { Router } from '@angular/router';

@Injectable()
export class ApiInterceptor implements HttpInterceptor {
  constructor(
    private router: Router,
    private aes256Service: Aes256Service
  ) {}

  intercept(req: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    if (req.url.includes('.json')) return next.handle(req);
    if (isDevelopment) console.log('REQUEST:', req.method, req.url, req.body);

    const user = jsonParse<User>(localStorage.getItem('user'));
    const headers = { ...(user?.id && { User: user.id.toString() }) };
    const isFormData = req.body instanceof FormData;
    if (!isFormData) {
      headers['Accept'] = 'application/json';
      headers['Content-Type'] = 'application/json';
    }

    req = req.clone({
      url: environment.apiUrl + req.url,
      setHeaders: headers,
      // ...(!isFormData && { body: this.aes256Service.encrypt(jsonStringify(req.body)) }),
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
              status: err.status || HttpStatusCode.InternalServerError,
              message: err.message ?? 'Something went wrong.',
            };

        const isLoggingIn = req.url.includes('/user/login');
        if (!isLoggingIn && err.status === HttpStatusCode.Unauthorized) {
          this.handleUnathorizedRequest();
        }

        if (isDevelopment) console.error('ERROR:', req.method, req.url, err, req.body);
        return of(new HttpResponse({ body: err }));
      })
    );
  }

  handleUnathorizedRequest() {
    this.router.navigateByUrl('/login', {
      state: { expired: true },
    });
  }
}
