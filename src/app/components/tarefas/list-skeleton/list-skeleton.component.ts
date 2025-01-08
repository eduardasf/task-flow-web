import { NgFor } from '@angular/common';
import { Component } from '@angular/core';
import { SkeletonModule } from 'primeng/skeleton';

@Component({
  selector: 'app-list-skeleton',
  imports: [SkeletonModule, NgFor],
  templateUrl: './list-skeleton.component.html',
  styleUrl: './list-skeleton.component.scss'
})
export class ListSkeletonComponent {

}
