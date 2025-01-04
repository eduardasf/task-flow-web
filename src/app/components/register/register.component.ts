import { Component, ViewEncapsulation } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { AuthService } from '../auth/auth.service';
import { Usuario } from '@models/usuario';

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
    private auth: AuthService
  ){}

  login() {
    if (!this.form.valid) {
      return;
    }

    const formData = this.form.getRawValue();
    this.auth.addUsuario(formData).subscribe({
      next: res => {
        console.log(res);
      }
    })
  }
}
