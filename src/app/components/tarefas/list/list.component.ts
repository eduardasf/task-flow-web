import { DatePipe, SlicePipe } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Tarefa } from '@models/tarefa';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { ScrollPanelModule } from 'primeng/scrollpanel';
import { TooltipModule } from 'primeng/tooltip';

@Component({
  selector: 'app-list',
  imports: [
    DatePipe,
    CheckboxModule,
    FormsModule,
    ButtonModule,
    ScrollPanelModule,
    TooltipModule,
    SlicePipe
  ],
  templateUrl: './list.component.html',
  styleUrl: './list.component.scss'
})
export class ListComponent implements OnInit {
  @Input() tarefas: Tarefa[] = [];

  ngOnInit(): void {
    console.log("klasnkds", this.tarefas)
  }

  active(id: string) {
    console.log(id)
  }
}
