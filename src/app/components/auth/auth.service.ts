import { Injectable } from '@angular/core';
import { environment } from '../../env/environments';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private api = `${environment.API_URL}`;

  constructor(private http_: HttpClient) { }

  addUsuario(usuario: unknown){
    return this.http_.post(`${this.api}/usuario`, usuario);
  }

  login(usuario: unknown){
    return this.http_.post(`${this.api}/auth/login`, usuario);
  }
}
