import {
  HttpEvent,
  HttpHandlerFn,
  HttpInterceptorFn,
  HttpRequest,
} from '@angular/common/http';
import { inject } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';
export const AuthInterceptor: HttpInterceptorFn = (
  req: HttpRequest<any>,
  next: HttpHandlerFn
): Observable<HttpEvent<any>> => {
  const oAuthService = inject(AuthService);
  const token = oAuthService.getAccessToken();
  if (token) {
    const cloned = req.clone({
      setHeaders: {
        authorization: 'Bearer ' + token,
      },
    });
    return next(cloned);
  } else {
    return next(req);
  }
}

