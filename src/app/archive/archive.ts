import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { Task } from '../task';
import { TasksService } from '../TasksService';

@Component({
  selector: 'app-archive',
  imports: [CommonModule, MatButtonModule, MatCardModule],
  templateUrl: './archive.html',
  styleUrl: './archive.css',
})
export class Archive implements OnInit {
  tasks: Task[] = [];

  private tasksService = inject(TasksService);

  ngOnInit(): void {
    this.tasksService.index(true).subscribe({
      next: (data: Task[]) => {
        this.tasks = data;
        console.log('Pobrano zarchiwizowane zadania:', data);
      },
      error: (err) => {
        console.error('Błąd:', err);
      },
    });
  }

  delete(task: Task): void {
    this.tasksService.delete(task).subscribe({
      next: () => {
        console.log('Zadanie usunięte:', task.id);
        // Usunięcie zadania z lokalnej listy
        this.tasks = this.tasks.filter((t) => t.id !== task.id);
      },
      error: (err) => {
        console.error('Błąd podczas usuwania:', err);
      },
    });
  }
}
