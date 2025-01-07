import { DatePipe, NgIf, SlicePipe } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output, ViewEncapsulation } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Status, Tarefa } from '@models/tarefa';
import { ConfirmationService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { CheckboxChangeEvent, CheckboxModule } from 'primeng/checkbox';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmPopupModule } from 'primeng/confirmpopup';
import { DialogService, DynamicDialogModule, DynamicDialogRef } from 'primeng/dynamicdialog';
import { ScrollPanelModule } from 'primeng/scrollpanel';
import { TagModule } from 'primeng/tag';
import { TooltipModule } from 'primeng/tooltip';
import { ToastCustomService } from '../../../shared/toast-custom.service';
import { AddEditTarefaComponent } from '../modais/add-edit-tarefa/add-edit-tarefa.component';
import { TarefaService } from '../tarefa.service';

@Component({
  selector: 'app-list',
  imports: [
    DatePipe, CheckboxModule,
    FormsModule, ButtonModule,
    ScrollPanelModule, TooltipModule,
    SlicePipe, ConfirmPopupModule,
    TagModule, DynamicDialogModule,
    ConfirmDialogModule, NgIf
  ],
  templateUrl: './list.component.html',
  styleUrl: './list.component.scss',
  viewProviders: [ConfirmationService, DialogService],
  encapsulation: ViewEncapsulation.None
})
export class ListComponent implements OnInit {
  @Input() tarefas: Tarefa[] = [];
  @Output() notify: EventEmitter<boolean> = new EventEmitter();
  ref: DynamicDialogRef | undefined;
  dell: boolean = false;

  constructor(
    private tarefaService: TarefaService,
    private confirmationService: ConfirmationService,
    private dialogService: DialogService,
    private alert: ToastCustomService
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
            this.reload();
            this.alert.showMsg('success', 'Tarefa', 'Status da tarefa alterado com sucesso!');
          }
        },
        error: error => {
          this.alert.showMsg('success', 'Tarefa', 'Erro ao alterar o status da tarefa!');
        }
      }
      );
  }

  confirm(event: CheckboxChangeEvent, id: string, isConcluido: boolean) {
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

  getSeverity(status: Status): "success" | "secondary" | "info" | "warn" | "danger" | "contrast" | undefined {
    const statusMap: Record<Status, "success" | "warn" | "danger"> = {
      [Status.Pending]: "warn",
      [Status.Completed]: "success",
      [Status.Overdue]: "danger"
    };
    return statusMap[status] ?? "warn";
  }

  normalize(status: Status): string | undefined {
    const statusMap: Record<Status, string> = {
      [Status.Pending]: "Pendente",
      [Status.Completed]: "Concluído",
      [Status.Overdue]: "Atrasado"
    };
    return statusMap[status];
  }

  private reload() {
    this.notify.emit(true);
  }

  del(id: string) {
    this.dell = true;
    setTimeout(() => {
      this.confirmationService.confirm({
        header: 'Excluír Tarefa',
        accept: () => {
          this.handleAccept(id)
        },
        reject: () => {
          this.dell = false;
        },
      });
    }, 100)
  }

  private handleAccept(id: string): void {
    this.dell = false;
    this.tarefaService.delTarefa(id)
      .subscribe({
        next: value => {
          if (value) {
            this.alert.showMsg('success', 'Tarefa', 'Excluida com sucesso!');
            this.reload()
          }
        }, error: err => {
          this.alert.showMsg('error', 'Tarefa', 'Erro ao excluir a tarefa!');
        },
      })
  }

  edit(data?: Tarefa) {
    this.ref = this.dialogService.open(
      AddEditTarefaComponent, {
      data: data
    })

    this.ref.onClose
      .subscribe((p) => {
        if (p) {
          this.reload();
        }
      })
  }
}
