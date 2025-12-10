import { Component, inject, OnInit} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Task } from '../task';
import { TasksService } from '../TasksService';

@Component({
  selector: 'app-tasks',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './tasks.html',
})
export class Tasks implements OnInit {
  tasks: Task[] = [];
  newTask: Task = {};

  private tasksService = inject(TasksService);
  ngOnInit(): void {
    this.tasksService.index().subscribe({
      next: (data: Task[]) => {
        this.tasks = data;
        console.log('Pobrano zadania:', data);
      },
      error: (err) => {
        console.error('Błąd:', err);
      }
    });
  }
}
