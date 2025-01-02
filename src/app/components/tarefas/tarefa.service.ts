import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../env/environments';

@Injectable({
  providedIn: 'root'
})
export class TarefaService {
  private api = `${environment.API_URL}`;

  constructor(private http_: HttpClient) { }

  changeStatusTarefa(id: string, concluido: boolean) {
    return this.http_.patch(`${this.api}/tarefa/status/${id}`, concluido);
  }

}
