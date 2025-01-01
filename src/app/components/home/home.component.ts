import { DatePipe, NgClass } from '@angular/common';
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DividerModule } from 'primeng/divider';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import { PaginatorModule } from 'primeng/paginator';
import { debounceTime, Subject, switchMap } from 'rxjs';

import { PageEvent } from '@models/primeng';
import { Tarefa } from '@models/tarefa';
import { ButtonModule } from 'primeng/button';
import { ListComponent } from "../tarefas/list/list.component";
import { HomeService } from './home.service';

@Component({
  selector: 'app-home',
  imports: [
    DividerModule,
    IconFieldModule,
    InputIconModule,
    InputTextModule,
    FormsModule,
    NgClass,
    PaginatorModule,
    ListComponent,
    ButtonModule
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
  encapsulation: ViewEncapsulation.None,
  viewProviders: [HomeService]
})
export class HomeComponent implements OnInit {
  selected_f: string = 'All';
  value: string | null | undefined;
  totalRecords!: number;
  tarefas: Tarefa[] = [];
  first: number = 0;
  rows: number = 6;

  searchSubject: Subject<{ value: string | null, selected_f: string }> = new Subject();

  f_status = [
    { type: 'All', title: 'Todas as tarefas' },
    { type: 'Pending', title: 'Pendentes' },
    { type: 'Completed', title: 'Concluídas' },
    { type: 'Overdue', title: 'Atrasadas' },
  ];


  constructor(
    private dataPipe: DatePipe,
    private service: HomeService
  ) { }

  ngOnInit(): void {
    this.search(this.value, this.selected_f);

    this.searchSubject.pipe(
      debounceTime(500),
      switchMap(({ value, selected_f }) => {
        const pageEvent = new PageEvent({
          first: this.first,
          rows: this.rows,
          page: Math.floor(this.first / this.rows) + 1,
          pageCount: Math.ceil(this.totalRecords / this.rows),
          globalFilter: value,
          status: selected_f
        });

        return this.service.getFilteredTarefas(pageEvent);
      })
    ).subscribe((response) => {
      this.tarefas = response.data;
      const events = response.pageEvent as PageEvent;
      this.totalRecords = events.total ?? 0;
      console.log(response);
    });
  }

  setFilter(f: string) {
    this.selected_f = f;
    this.search(this.value, f);
  }

  changeInput($event: Event) {
    const inputElement = $event.target as HTMLInputElement;
    this.value = inputElement.value ?? null;
    this.searchSubject.next({ value: this.value, selected_f: this.selected_f });
  }

  getDate() {
    const today = new Date();
    return this.dataPipe.transform(today, 'EEEE, dd/MM/yyyy', 'pt-BR');
  }

  search(value: string | null | undefined, selected_f: string) {
    const pageEvent = new PageEvent({
      first: this.first,
      rows: this.rows,
      page: Math.floor(this.first / this.rows) + 1,
      pageCount: Math.ceil(this.totalRecords / this.rows),
      globalFilter: value,
      status: selected_f
    });

    this.service.getFilteredTarefas(pageEvent).subscribe((response) => {
      this.tarefas = response.data;
      const events = response.pageEvent as PageEvent;
      this.totalRecords = events.total ?? 0;
      console.log(response);
    });
  }

  onPageChange(event: any) {
    this.first = event.first;
    this.rows = event.rows;
    this.search(this.value, this.selected_f);
  }
}
