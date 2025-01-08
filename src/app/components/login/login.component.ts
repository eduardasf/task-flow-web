import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { ToastCustomService } from '../../shared/toast-custom.service';
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
export class LoginComponent implements OnInit {
  loading: boolean = false;
  form = new FormGroup({
    email: new FormControl(null, [Validators.required]),
    password: new FormControl(null, [Validators.required]),
  })
  user: any;

  constructor(
    private auth: AuthService,
    private router: Router,
    private route: ActivatedRoute,
    private alert: ToastCustomService
  ) { }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      const email = params['email'];
      console.log('Username recebido:', params);
      if (email) {
        this.form.get('email')?.setValue(email);
        this.form.get('email')?.disable();
      }
    });
  }

  login() {
    this.loading = true;
    if (!this.form.valid) {
      this.loading = false;
      return;
    }

    const formData = this.form.getRawValue();
    this.auth.login(formData)
      .subscribe({
        next: () => {
          this.auth.user$
            .subscribe(u => {
              if (u) {
                this.loading = false;
                setTimeout(() => {
                  this.router.navigate(['']);
                }, 500)
              }
            })
        },
        error: (err) => {
          this.loading = false;
          this.alert.showMsg('warn', 'Login', 'Erro ao realizar o login!' + err);
        },
      });
  }

}
