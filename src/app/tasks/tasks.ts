import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatCardModule } from '@angular/material/card';
import { provideNativeDateAdapter } from '@angular/material/core';
import { Task } from '../task';
import { TasksService } from '../TasksService';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-tasks',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatButtonModule,
    MatCheckboxModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatCardModule
  ],
  providers: [provideNativeDateAdapter()],
  templateUrl: './tasks.html',
  styleUrl: './tasks.css',
})
export class Tasks implements OnInit {
  tasks: Task[] = [];
  newTask: Task = {};
  errorMessage = '';

  private tasksService = inject(TasksService);
  ngOnInit(): void {
    this.tasksService.index().subscribe({
      next: (data: Task[]) => {
        this.tasks = data;
        console.log('Pobrano zadania:', data);
      },
      error: (err) => {
        console.error('Błąd:', err);
      },
    });
  }

  addTask(): void {
    this.errorMessage = '';

    if (!this.newTask.title || this.newTask.title.trim() === '') {
      this.errorMessage = 'Tytuł zadania nie może być pusty.';
      return;
    }

    this.newTask.completed = false;
    this.newTask.archived = false;

    this.tasksService.post(this.newTask).subscribe({
      next: (createdTask: Task) => {
        this.tasks.push(createdTask);
        this.newTask = {};
        this.errorMessage = '';
      },
      error: (err) => {
        this.errorMessage = 'Błąd serwera!';
        console.error('Błąd:', err);
      },
    });
  }

  handleChange(task: Task): void {
    this.tasksService.put(task).subscribe({
      next: () => {
        console.log('Zadanie zaktualizowane:', task.id);
      },
      error: (err) => {
        console.error('Błąd:', err);
        this.errorMessage = 'Nie udało się zapisać zmiany statusu.';
      },
    });
  }

  archiveCompleted(): void {
    // Znalezienie zadań do archiwizacji
    const tasksToArchive = this.tasks.filter((t) => t.completed);

    if (tasksToArchive.length === 0) {
      return;
    }

    // Lokalne przygotowanie zadań do archiwizacji (zawiera obiekty Observable)
    const requests = tasksToArchive.map((task) => {
      task.archived = true;
      return this.tasksService.put(task);
    });

    // Wysłanie wszystkich żądań archiwizacji
    forkJoin(requests).subscribe({
      next: () => {
        console.log('Zarchiwizowano zadania');
        this.ngOnInit(); // Odświeżenie listy zadań
      },
      error: (err) => {
        console.error('Błąd:', err);
      },
    });
  }

  canAddTask(): boolean {
    return !!this.newTask.title && this.newTask.title.trim() !== '';
  }

  canArchiveCompleted(): boolean {
    return this.tasks.some((t) => t.completed);
  }


}
