import { Component, EventEmitter, Input, OnInit, Output, ViewEncapsulation } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Tarefa } from '@models/tarefa';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { DatePickerModule } from 'primeng/datepicker';
import { DialogModule } from 'primeng/dialog';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';
import { TarefaService } from '../../tarefa.service';

@Component({
  selector: 'app-add-edit-tarefa',
  imports: [
    DialogModule, ButtonModule,
    InputTextModule, TextareaModule,
    ReactiveFormsModule, DatePickerModule,
    CheckboxModule
  ],
  templateUrl: './add-edit-tarefa.component.html',
  styleUrl: './add-edit-tarefa.component.scss',
  encapsulation: ViewEncapsulation.None
})
export class AddEditTarefaComponent implements OnInit {
  @Input() visible: boolean = false;
  @Output() visibleChange = new EventEmitter<boolean>();


  form = new FormGroup({
    id: new FormControl<string | null | undefined>(null),
    nome: new FormControl<string | null>(null, [Validators.required]),
    descricao: new FormControl<string | null>(null),
    dataValidade: new FormControl<Date | string>(new Date(), [Validators.required]),
    concluido: new FormControl<boolean>(false),
  })

  constructor(
    private ref: DynamicDialogConfig,
    private dialog: DynamicDialogRef,
    private service: TarefaService
  ) { }

  ngOnInit(): void {
    const data = this.ref.data as Tarefa;
    if (data) {
      this.form.patchValue({
        ...data,
        dataValidade: data.dataValidade ? new Date(data.dataValidade) : new Date()
      });
    }
  }

  submit() {
    const formData = this.form.getRawValue();
    if (formData.dataValidade) {
      formData.dataValidade = new Date(formData.dataValidade).toISOString();
    }

    if (formData.id === null) {
      delete formData.id;
    }

    const fun = formData.id ?
      this.service.updateTarefa(formData as Tarefa) :
      this.service.addTarefa(formData as Tarefa);

    // Executa a requisição e trata a resposta
    fun.subscribe({
      next: value => {
        this.close(value);
        alert(formData.id ? 'editou' : 'criou');
      },
      error: err => {
        // Tratar erro, se necessário
      }
    });
  }

  close(value?: any) {
    this.dialog.close(value);
  }
}
