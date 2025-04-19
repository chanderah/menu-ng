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
import { ToastService } from '../service/toast.service';
import { StorageService } from '../storage.service';

@Injectable()
export class ApiInterceptor implements HttpInterceptor {
  constructor(
    private router: Router,
    private aes256Service: Aes256Service,
    private toastService: ToastService,
    private storageService: StorageService
  ) {}

  intercept(req: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    if (['cloudinary', '.json'].some((v) => req.url.includes(v))) return next.handle(req);

    const reqTime = new Date().getTime();
    const user = this.storageService.getWithExpiry<User>('user');
    const headers = { ...(user?.token && { Authorization: `Bearer ${user.token}` }) };
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
      map((res) => {
        if (res instanceof HttpResponse) {
          if (res.body?.encryptedData) {
            res = res.clone({
              body: jsonParse(this.aes256Service.decrypt(res.body.encryptedData)),
            });
          }
          this.logResponse(req, res, reqTime);
        }
        return res;
      }),
      catchError((err: HttpErrorResponse) => {
        this.logResponse(req, err, reqTime);

        const isLoggingIn = req.url.includes('/user/login');
        if (isLoggingIn) {
          return of(new HttpResponse({ body: err }));
        } else if (!isLoggingIn && err.status === HttpStatusCode.Unauthorized) {
          this.handleUnathorizedRequest();
        }

        this.toastService.errorToast('Something went wrong.');
        throw new Error('Something went wrong.');
      })
    );
  }

  handleUnathorizedRequest() {
    this.router.navigateByUrl('/login', {
      replaceUrl: true,
      state: { expired: true },
    });

    this.toastService.errorToast('Your session is expired. Please login again');
    throw new Error('Unauthorized');
  }

  logResponse(req: HttpRequest<unknown>, res: HttpResponse<any> | HttpErrorResponse, reqTime: number) {
    if (!isDevelopment) return;

    console.log('REQUEST:', req.method, req.url, req.body);
    const isError = res instanceof HttpErrorResponse;
    if (isError) {
      const err = res.error?.message ? res.error : res;
      err.status = res.status || HttpStatusCode.InternalServerError;
      err.message = res.message ?? 'Something went wrong.';

      console.log('ERROR:', res.status, req.method, req.url, err);
    } else {
      const responseTime = new Date().getTime() - reqTime;
      console.log('RESPONSE:', res.body?.status ?? res.status, req.method, `(${responseTime}ms)`, req.url, res.body);
    }
  }
}
