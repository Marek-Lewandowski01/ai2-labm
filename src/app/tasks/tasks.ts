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
      }
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
      }
    })
  }




}
