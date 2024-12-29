import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../env/environments';
import { PageEvent } from '../../interfaces/primeng';
import { Tarefa } from '../../interfaces/tarefa';

@Injectable({
  providedIn: 'root'
})
export class HomeService {
  private api = `${environment.API_URL}`;

  constructor(private http_: HttpClient) { }

  getAll() {
    return this.http_.get<Tarefa[]>(`${this.api}/tarefa`);
  }

  getFilteredTarefas(pageEvent: PageEvent) {
    return this.http_.post<any>(`${this.api}/tarefa/pagination`, pageEvent);
  }

}
