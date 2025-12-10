import {Component, inject} from '@angular/core';
import {Task} from '../task';
import {TasksService} from '../TasksService';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';

@Component({
  selector: 'app-tasks',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './tasks.html',
  styleUrl: './tasks.css',
})
export class Tasks {
  tasks: Task[] = [];
  newTask: Task = {};
  private tasksService = inject(TasksService)


  ngOnInit(): void {
    this.tasksService.index().subscribe({
      next: (data: Task[]) => {
        // Sukces: przypis danych do zmiennej i log w konsoli
        this.tasks = data;
        console.log('Pobrano zadania:', data);
      },
      error: (err) => {
        // Błąd: log w konsoli
        console.error('Błąd pobierania danych:', err);
      }
    });
  }
}
