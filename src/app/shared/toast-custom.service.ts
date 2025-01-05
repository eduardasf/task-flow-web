import { Injectable } from '@angular/core';
import { MessageService } from 'primeng/api';

@Injectable({
  providedIn: 'root'
})
export class ToastCustomService {

  constructor(private messageService: MessageService) { }

  showMsg(severity: 'success' | 'info' | 'warn' | 'error' | 'contrast' | 'secondary', summary: string, detail: string) {
    this.messageService.add({
      severity: severity,
      summary: summary,
      detail: detail,
    });
  }
}
