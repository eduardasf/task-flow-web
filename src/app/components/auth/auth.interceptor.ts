import {
  HttpEvent,
  HttpHandlerFn,
  HttpInterceptorFn,
  HttpRequest,
} from '@angular/common/http';
import { inject } from '@angular/core';
import { RefreshToken } from '@models/response';
import { Observable, switchMap } from 'rxjs';
import { AuthService } from './auth.service';
export const AuthInterceptor: HttpInterceptorFn = (
  req: HttpRequest<any>,
  next: HttpHandlerFn
): Observable<HttpEvent<any>> => {
  const auth = inject(AuthService);
  const token = auth.getAccessToken();

  const addAuthorizationHeader = (request: HttpRequest<unknown>, token: string | null): HttpRequest<unknown> => {
    return request.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`,
      },
    });
  };
  if (auth.isAuthenticated()) {
    if (auth.isTokenExpired()) {
      return auth.refreshToken().pipe(
        switchMap((newToken: RefreshToken | null) => {
          if (newToken?.refreshToken) {
            return next(addAuthorizationHeader(req, newToken.refreshToken));
          } else {
            console.warn('Token de atualização ausente ou inválido.');
            return next(req);
          }
        })
      );

    } else {
      return next(addAuthorizationHeader(req, token));
    }

  } else {
    return next(req);
  }
}

