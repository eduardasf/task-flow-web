import { DatePipe, SlicePipe } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Tarefa } from '@models/tarefa';
import { ConfirmationService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { CheckboxChangeEvent, CheckboxModule } from 'primeng/checkbox';
import { ConfirmPopupModule } from 'primeng/confirmpopup';
import { ScrollPanelModule } from 'primeng/scrollpanel';
import { TooltipModule } from 'primeng/tooltip';
import { TarefaService } from '../tarefa.service';

@Component({
  selector: 'app-list',
  imports: [
    DatePipe,
    CheckboxModule,
    FormsModule,
    ButtonModule,
    ScrollPanelModule,
    TooltipModule,
    SlicePipe,
    ConfirmPopupModule
  ],
  templateUrl: './list.component.html',
  styleUrl: './list.component.scss',
  viewProviders: [ConfirmationService]
})
export class ListComponent implements OnInit {
  @Input() tarefas: Tarefa[] = [];
  @Output() notify: EventEmitter<boolean> = new EventEmitter();

  constructor(
    private tarefaService: TarefaService,
    private confirmationService: ConfirmationService
  ) { }

  ngOnInit(): void {
    console.log("klasnkds", this.tarefas)
  }

  private active(id: string, concluido: boolean) {
    if (!id) {
      return;
    }

    this.tarefaService.changeStatusTarefa(id, concluido)
      .subscribe({
        next: res => {
          if (res) {
            this.notify.emit(true);
          }
        },
        error: error => {
          console.error('Erro ao atualizar status:', error);
        }
      }
      );
  }

  confirm(event: CheckboxChangeEvent, id: string, isConcluido: boolean) {
    console.log(event)
    this.confirmationService.confirm({
      target: event.originalEvent?.target as EventTarget,
      message: 'Você tem certeza que deseja prosseguir?',
      icon: 'bi bi-exclamation-triangle-fill',
      rejectButtonProps: {
        label: 'Cancelar',
        severity: 'secondary',
        outlined: true
      },
      acceptButtonProps: {
        label: 'Confirmar'
      },
      accept: () => {
        this.active(id, isConcluido);
      },
      reject: () => {
        const obj = this.tarefas.find((t) => t.id === id);
        if (obj)
          obj.concluido = !isConcluido;
      }
    });
  }

}
