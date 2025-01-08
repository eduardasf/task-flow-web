import { DatePipe, NgClass, NgIf } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { PageEvent } from '@models/primeng';
import { Tarefa } from '@models/tarefa';
import { Usuario } from '@models/usuario';
import { ButtonModule } from 'primeng/button';
import { DividerModule } from 'primeng/divider';
import { DialogService, DynamicDialogModule, DynamicDialogRef } from 'primeng/dynamicdialog';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import { PaginatorModule } from 'primeng/paginator';
import { SkeletonModule } from 'primeng/skeleton';
import { debounceTime, first, Observable, Subject, switchMap } from 'rxjs';
import { AuthService } from '../auth/auth.service';
import { ListSkeletonComponent } from "../tarefas/list-skeleton/list-skeleton.component";
import { ListComponent } from "../tarefas/list/list.component";
import { AddEditTarefaComponent } from "../tarefas/modais/add-edit-tarefa/add-edit-tarefa.component";
import { HomeService } from './home.service';

@Component({
  selector: 'app-home',
  imports: [
    DividerModule, IconFieldModule,
    InputIconModule, InputTextModule,
    FormsModule, NgClass, PaginatorModule,
    ListComponent, ButtonModule,
    DynamicDialogModule, NgIf, SkeletonModule,
    ListSkeletonComponent
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
  encapsulation: ViewEncapsulation.None,
  viewProviders: [HomeService, DialogService],
})
export class HomeComponent implements OnInit {
  selected_f: string = 'All';
  value: string | null | undefined;
  totalRecords!: number;
  tarefas: Tarefa[] = [];
  first: number = 0;
  rows: number = 6;
  ref: DynamicDialogRef | undefined;
  loading = {
    date: true,
    cards: true
  }

  searchSubject: Subject<{ value: string | null, selected_f: string }> = new Subject();
  user$: Observable<Usuario | null>;

  f_status = [
    { type: 'All', title: 'Todas as tarefas' },
    { type: 'Pending', title: 'Pendentes' },
    { type: 'Completed', title: 'Concluídas' },
    { type: 'Overdue', title: 'Atrasadas' },
  ];

  constructor(
    private auth: AuthService,
    private service: HomeService,
    private dialogService: DialogService,
    private cdr: ChangeDetectorRef,
    private datepipe: DatePipe
  ) {
    this.user$ = this.auth.user$;
  }

  ngOnInit(): void {
    this.user$.subscribe((user) => {
      if (!user) return;
      this.searchSubject
        .pipe(
          debounceTime(500),
          switchMap(({ value, selected_f }) => {
            this.loading.cards = true;
            return this.service.getFilteredTarefas(
              this.setEvent(value, selected_f, user.id)
            )
          })
        )
        .subscribe({
          next: (response) => {
            this.tarefas = response.data;
            const events = response.pageEvent as PageEvent;
            this.totalRecords = events.total ?? 0;
            setTimeout(() => {
              this.loading.cards = false;
              this.cdr.detectChanges();
            }, 500);
          },
          error: (err) => {
            this.loading.cards = false;
            console.error('Erro ao buscar tarefas:', err);
          },
        });
    });
    this.search(this.value, this.selected_f);
    setTimeout(() => {
      this.loading.date = false;
    }, 500)
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
    return this.datepipe.transform(today, 'EEEE, dd/MM/yyyy', 'pt-BR');
  }

  search(value: string | null | undefined, selected_f: string): void {
    this.user$
      .pipe(
        first(),
        switchMap((user) => {
          if (!user) {
            console.error('User not found');
            return [];
          }
          this.loading.cards = true;
          const pageEvent = this.setEvent(value, selected_f, user.id);
          return this.service.getFilteredTarefas(pageEvent);
        })
      )
      .subscribe({
        next: (response) => {
          this.tarefas = response.data;
          const events = response.pageEvent as PageEvent;
          this.totalRecords = events.total ?? 0;
          setTimeout(() => {
            this.loading.cards = false
          }, 500);
        },
        error: (err) => {
          this.loading.cards = false;
          console.error('Erro ao buscar tarefas:', err);
        },
      });
  }


  setEvent(value: string | null | undefined, selected_f: string, idUser: string) {
    return new PageEvent({
      first: this.first,
      rows: this.rows,
      page: Math.floor(this.first / this.rows) + 1,
      pageCount: Math.ceil(this.totalRecords / this.rows),
      globalFilter: value,
      status: selected_f,
      userId: idUser
    });
  }

  onPageChange(event: any) {
    this.first = event.first;
    this.rows = event.rows;
    this.search(this.value, this.selected_f);
  }

  showDialog() {
    const ref: DynamicDialogRef = this.dialogService.open(AddEditTarefaComponent, {});

    ref.onClose.subscribe((obj: unknown) => {
      if (obj) {
        this.search(this.value, this.selected_f);
      }
    });
  }

  logout() {
    this.auth.logout();
  }

}
