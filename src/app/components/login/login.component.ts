import { Component, ViewEncapsulation } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { AuthService } from '../auth/auth.service';
@Component({
  selector: 'app-login',
  imports: [
    ReactiveFormsModule,
    InputTextModule,
    PasswordModule,
    RouterLink,
    ButtonModule
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
  encapsulation: ViewEncapsulation.None
})
export class LoginComponent {
  form = new FormGroup({
    email: new FormControl(null, [Validators.required]),
    password: new FormControl(null, [Validators.required]),
  })
  user: any;

  constructor(
    private auth: AuthService,
    private router: Router
  ) { }

  login() {
    if (!this.form.valid) {
      return;
    }

    const formData = this.form.getRawValue();
    this.auth.login(formData)
      .subscribe({
        next: () => {
          this.auth.user$
            .subscribe(u => {
              if (u) {
                this.router.navigate(['']);
              }
            })
        },
        error: (err) => {
          console.error('Erro ao fazer login:', err);
        },
      });
  }

}
