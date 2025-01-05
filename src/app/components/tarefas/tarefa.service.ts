import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Tarefa } from '@models/tarefa';
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

  delTarefa(id: string) {
    return this.http_.delete(`${this.api}/tarefa/${id}`);
  }

  addTarefa(tarefa: Tarefa) {
    return this.http_.post<any>(`${this.api}/tarefa`, tarefa);
  }

  updateTarefa(tarefa: Tarefa) {
    return this.http_.put<any>(`${this.api}/tarefa`, tarefa);
  }

}
