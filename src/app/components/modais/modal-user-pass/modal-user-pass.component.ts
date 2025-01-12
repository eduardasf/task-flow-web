import { NgClass, NgIf } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { UpdatePass } from '@models/response';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { DatePickerModule } from 'primeng/datepicker';
import { DialogModule } from 'primeng/dialog';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { TextareaModule } from 'primeng/textarea';
import { ToastCustomService } from '../../../shared/toast-custom.service';
import { AuthService } from '../../auth/auth.service';

@Component({
  selector: 'app-modal-user-pass',
  imports: [
    DialogModule, ButtonModule,
    InputTextModule, TextareaModule,
    ReactiveFormsModule, DatePickerModule,
    CheckboxModule, NgIf, NgClass, PasswordModule
  ],
  templateUrl: './modal-user-pass.component.html',
  styleUrl: './modal-user-pass.component.scss'
})
export class ModalUserPassComponent implements OnInit {
  loading: boolean = false;

  form = new FormGroup({
    email: new FormControl<string | null>({ value: null, disabled: true }, [Validators.requiredTrue]),
    senhaAtual: new FormControl<string | null>(null, [Validators.required]),
    senhaNova: new FormControl<string | null>(null, [Validators.required]),
  })

  constructor(
    private ref: DynamicDialogConfig,
    private dialog: DynamicDialogRef,
    private service: AuthService,
    private toast: ToastCustomService,
    private auth: AuthService
  ) { }

  ngOnInit(): void {
    this.auth.user$.subscribe((u) => {
      if (u)
        this.form.patchValue({
          email: u.email
        })
    })
  }

  submit() {
    this.loading = true;
    if (this.form.invalid) {
      return;
    }
    const f = this.form.getRawValue() as UpdatePass;
    this.service.updatePass(f).subscribe({
      next: value => {
        if (!value.success) {
          this.toast.showMsg('error', 'Senha', value.message);
          this.loading = false;
        } else {
          this.toast.showMsg('success', 'Senha', value.message);
          this.auth.setUserInSessionStorage(value);
          this.loading = false;
          this.close(value.data);
        }
      },
      error: err => {
        this.loading = false;
        this.toast.showMsg('error', 'Senha', err.message);
      },
    })
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
}
