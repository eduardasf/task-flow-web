import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { GenericResponse, UserResponse } from '@models/response';
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

  constructor(private http_: HttpClient) { }

  addUsuario(usuario: unknown) {
    return this.http_.post(`${this.api}/usuario`, usuario);
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

  logout() {
    sessionStorage.clear();
    this.userSubject.next(null);
  }

}
