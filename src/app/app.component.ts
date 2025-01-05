import { Component, inject, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ToastModule } from 'primeng/toast';
import { AuthService } from './components/auth/auth.service';

@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet,
    ToastModule
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
  title = 'task-flow-web';
  private auth = inject(AuthService);

  ngOnInit(): void {
    this.auth.initUser();
  }
}


