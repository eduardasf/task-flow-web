import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { GenericResponse, RefreshToken, UpdatePass, UserResponse } from '@models/response';
import { Usuario } from '@models/usuario';
import { BehaviorSubject, catchError, Observable, of, tap, throwError } from 'rxjs';
import { environment } from '../../env/environments';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private api = `${environment.API_URL}`;

  private userSubject = new BehaviorSubject<Usuario | null>(null);
  user$: Observable<Usuario | null> = this.userSubject.asObservable();
  private authInitializedSubject = new BehaviorSubject<boolean>(false);
  isAuthInitialized$ = this.authInitializedSubject.asObservable();
  private isUserInitialized = false;
  private attToken = false;

  constructor(private http_: HttpClient, private router: Router) { }

  addUsuario(usuario: unknown) {
    return this.http_.post<GenericResponse>(`${this.api}/usuario`, usuario);
  }

  private handleError(error: unknown): Observable<never> {
    return throwError(() => error);
  }

  private setSessionStorage(res: UserResponse) {
    this.setToken(res.token);
    sessionStorage.setItem('user_email', res.email);
  }

  private setToken(token: string) {
    sessionStorage.setItem('access_token', token);
  }

  login(usuario: unknown): Observable<UserResponse> {
    return this.http_.post<UserResponse>(`${this.api}/auth/login`, usuario)
      .pipe(
        tap(response => {
          this.setSessionStorage(response);
          this.getUser({ email: response.email, token: response.token })
            .pipe(
              tap(user => {
                this.setUserInSessionStorage(user);
              }),
              catchError(() => {
                this.userSubject.next(null);
                return of(null);
              })
            )
            .subscribe();

        })
      )
  }

  getUser(dados: UserResponse): Observable<GenericResponse> {
    const url = `${environment.API_URL}/usuario/email?email=${encodeURIComponent(dados.email)}`;
    return this.http_.get<GenericResponse>(url).pipe(
      catchError(this.handleError)
    );
  }

  setUserInSessionStorage(dado: GenericResponse): void {
    const user = dado.data as Usuario;
    this.userSubject.next(user);
    sessionStorage.setItem('user', JSON.stringify(user));
  }

  isAuthenticated(): boolean {
    return !!this.getAccessToken();
  }

  getAccessToken(): string | null {
    return typeof window !== 'undefined' ? sessionStorage.getItem('access_token') : null;
  }

  getUserEmail(): string | null {
    return typeof window !== 'undefined' ? sessionStorage.getItem('user_email') : null;
  }

  initUser(): void {
    if (this.isUserInitialized) return;

    const user = this.getUserFromSessionStorage();
    if (user) {
      this.userSubject.next(user);
    } else {
      const userEmail = this.getUserEmail();
      const token = this.getAccessToken();

      if (userEmail && token) {
        this.getUser({ email: userEmail, token })
          .pipe(
            tap(user => {
              this.setUserInSessionStorage(user);
            }),
            catchError(() => {
              this.userSubject.next(null);
              return of(null);
            })
          )
          .subscribe();
      } else {
        this.userSubject.next(null);
      }
    }
    this.isUserInitialized = true;
    this.authInitializedSubject.next(true);
  }

  getUserFromSessionStorage(): Usuario | null {
    const user = typeof window !== 'undefined' ? sessionStorage.getItem('user') : null;
    return user ? JSON.parse(user) as Usuario : null;
  }

  logout(): void {
    sessionStorage.clear();
    this.userSubject.next(null);
    this.isUserInitialized = false;
    this.router.navigate(['auth', 'login']);
  }

  isTokenExpired(): boolean {
    const token = this.getAccessToken();
    if (!token) { return true };

    const payload = this.decodeToken(token);
    const expirationDate = new Date(payload?.exp * 1000);
    return new Date() > expirationDate;
  }

  private decodeToken(token: string) {
    const payload = token.split('.')[1];
    return JSON.parse(atob(payload));
  }

  refreshToken(): Observable<RefreshToken | null> {
    if (!this.attToken) {
      this.attToken = true;
      const email = this.getUserEmail();
      if (!email) {
        this.logout();
        return of(null);
      }
      const url = `${environment.API_URL}/auth/refresh-token?email=${encodeURIComponent(email)}`;
      return this.http_.get<RefreshToken>(url).pipe(
        tap((token: RefreshToken) => {
          if (token) {
            this.setToken(token.refreshToken);
          }
          this.attToken = false;
        }),
        catchError((error) => {
          this.attToken = false;
          this.logout();
          return throwError(() => error);
        })
      );
    } else {
      return of(null);
    }
  }

  updatePass(form: UpdatePass){
    return this.http_.patch<GenericResponse>(`${environment.API_URL}/usuario/update-password`, form);
  }

}
