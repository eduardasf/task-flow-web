import { Component, ViewEncapsulation } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { ToastCustomService } from '../../shared/toast-custom.service';
import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'app-register',
  imports: [
    ReactiveFormsModule,
    InputTextModule,
    PasswordModule,
    RouterLink,
    ButtonModule
  ],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss',
  encapsulation: ViewEncapsulation.None
})
export class RegisterComponent {
  form = new FormGroup({
    name: new FormControl(null, [Validators.required]),
    email: new FormControl(null, [Validators.required]),
    password: new FormControl(null, [Validators.required]),
  })

  constructor(
    private auth: AuthService,
    private alert: ToastCustomService,
    private router: Router
  ) { }

  login() {
    if (!this.form.valid) {
      this.alert.showMsg('error', 'Usuário', 'Por favor, preencha todos os campos obrigatórios para continuar.');
      return;
    }

    const formData = this.form.getRawValue();
    this.auth.addUsuario(formData).subscribe({
      next: (res) => {
        if (res.success) {
          this.alert.showMsg('success', 'Usuário', 'Cadastro realizado com sucesso!');
          this.router.navigate(['auth', 'login'], { queryParams: { email: formData.email } });
        } else {
          this.alert.showMsg('warn', 'Usuário', res.message);
        }
      },
      error: () => {
        this.alert.showMsg('error', 'Usuário', 'Erro ao tentar realizar o cadastro. Por favor, tente novamente.');
      }
    });
  }

}
