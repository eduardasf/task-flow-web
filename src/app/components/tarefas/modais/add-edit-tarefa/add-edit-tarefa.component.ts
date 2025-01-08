import { NgClass, NgIf } from '@angular/common';
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Tarefa } from '@models/tarefa';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { DatePickerModule } from 'primeng/datepicker';
import { DialogModule } from 'primeng/dialog';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';
import { ToastCustomService } from '../../../../shared/toast-custom.service';
import { AuthService } from '../../../auth/auth.service';
import { TarefaService } from '../../tarefa.service';

@Component({
  selector: 'app-add-edit-tarefa',
  imports: [
    DialogModule, ButtonModule,
    InputTextModule, TextareaModule,
    ReactiveFormsModule, DatePickerModule,
    CheckboxModule, NgIf, NgClass
  ],
  templateUrl: './add-edit-tarefa.component.html',
  styleUrl: './add-edit-tarefa.component.scss',
  encapsulation: ViewEncapsulation.None
})
export class AddEditTarefaComponent implements OnInit {

  loading: boolean = false;
  charCount: number = 0;


  form = new FormGroup({
    id: new FormControl<string | null | undefined>(null),
    nome: new FormControl<string | null>(null, [Validators.required, Validators.maxLength(150)]),
    descricao: new FormControl<string | null>(null, [Validators.maxLength(500)]),
    dataValidade: new FormControl<Date | string | null>(null, [Validators.required]),
    concluido: new FormControl<boolean>(false),
    usuarioId: new FormControl<string | null>(null),
  })

  constructor(
    private ref: DynamicDialogConfig,
    private dialog: DynamicDialogRef,
    private service: TarefaService,
    private toast: ToastCustomService,
    private auth: AuthService
  ) { }

  ngOnInit(): void {
    const data = this.ref.data as Tarefa;
    const user = this.auth.getUserFromSessionStorage();
    if (data) {
      this.form.patchValue({
        ...data,
        dataValidade: data.dataValidade ? new Date(data.dataValidade) : null
      });
    }
    this.form.patchValue({
      usuarioId: user?.id
    })
    this.charCount = this.form.get('descricao')?.value?.length || 0;
  }

  submit() {
    this.loading = true;
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

    fun.subscribe({
      next: value => {
        this.toast.showMsg(
          'success',
          'Tarefa',
          (formData.id ? 'Editada' : 'Criada') + ' com sucesso!'
        );
        this.loading = false;
        setTimeout(() => {
          this.dialog.close(value);
        }, 500);
      },
      error: err => {
        this.loading = false;
        this.toast.showMsg(
          'error',
          'Tarefa',
          'Erro ao ' + (formData.id ? 'editar' : 'criar') + ' a tarefa!'
        );
      }
    });

  }

  close(value?: any) {
    this.dialog.close(value);
  }

  getControl(control: string) {
    return this.form.get(control) as FormControl;
  }

  showError(control: string): boolean {
    return !!(this.getControl(control) && this.getControl(control).invalid && this.getControl(control).touched);
  }

  updateCharacterCount(): void {
    const descricaoControl = this.form.get('descricao');
    this.charCount = descricaoControl?.value?.length || 0;
  }
}
