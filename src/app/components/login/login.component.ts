import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
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
export class LoginComponent implements OnInit{
  form = new FormGroup({
    email: new FormControl(null, [Validators.required]),
    password: new FormControl(null, [Validators.required]),
  })
  user: any;

  constructor(
    private auth: AuthService
  ) { }

  ngOnInit() {
    const storedData = sessionStorage.getItem('authData');
  
    if (storedData) {
      const authData = JSON.parse(storedData);
      console.log('Dados recuperados do sessionStorage:', authData);

      this.user = authData.user; 
    } else {
      console.log('Nenhum dado encontrado no sessionStorage.');
    }
  }
  


  login() {
    if (!this.form.valid) {
      return;
    }

    const formData = this.form.getRawValue();
    this.auth.login(formData).subscribe({
      next: res => {
        console.log(res);

        sessionStorage.setItem('authData', JSON.stringify(res));

        alert('Login bem-sucedido!');
      },
      error: (err) => {
        console.error('Erro ao fazer login:', err);
      },
    });
}

}
