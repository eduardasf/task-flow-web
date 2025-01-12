import { Component, OnInit } from '@angular/core';
import { Usuario } from '@models/usuario';
import { ButtonModule } from 'primeng/button';
import { DialogService, DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { AuthService } from '../../auth/auth.service';

@Component({
  selector: 'app-modal-user',
  imports: [ButtonModule],
  templateUrl: './modal-user.component.html',
  styleUrl: './modal-user.component.scss'
})
export class ModalUserComponent implements OnInit {

  usr!: Usuario;

  constructor(
    private ref: DynamicDialogConfig,
    private dialog: DynamicDialogRef,
    private auth: AuthService,
    private dialogService: DialogService,
  ) { }

  ngOnInit(): void {
    this.auth.user$.subscribe((u) => {
      if (u)
        this.usr = u;
    })
  }

  close() {
    this.dialog.close(false);
  }

  editPass() {
    this.dialog.close(true);
  }

}
