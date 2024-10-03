import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Task } from '../task';
import { TasksService } from '../tasks.service';
import { NgIf, CommonModule } from '@angular/common';
@Component({
  selector: 'app-summary',
  standalone: true,
  imports: [
    RouterLink,
    NgIf,
    CommonModule
  ],
  templateUrl: './summary.component.html',
  styleUrl: './summary.component.scss'
})
export class SummaryComponent implements OnInit {

  constructor(
    private taskservice: TasksService
  ) { }

  statusAwaiting: Task[] = [];
  statusInProgress: Task[] = [];
  statusDone: Task[] = [];
  statusToDo: Task[] = [];
  urgentArray: Task[] = [];
  dateArray: Date[] = [];
  firstPrioDate: Date | undefined;
  tasks: Task[] = [];
  guestLoggedIn: string | null = null;
  loggedInUser: string | null = null;
  currentTime: number = 0;

  ngOnInit(): void {
    this.loggedInUser = localStorage.getItem('loggedInUser');
    this.guestLoggedIn = localStorage.getItem('guestLoggedIn');
    this.getAllTasks();  // Fetch tasks when the component is initialized
    this.getTime();
  }

  // This function is to load all contacts and convert them to an array
  async getAllTasks(): Promise<void> {
    const tasksObj: Record<string, Task> = await this.taskservice.getAllTasks();
    this.tasks = Object.values(tasksObj);  // Convert to an array
    this.sortTasksByStatus(this.tasks);
    this.sortTasksByPriority(this.tasks);
    this.filterTaskDate(this.tasks);
  }

  // This is to sort the tasks by its status,and pushs them into the specific array
  async sortTasksByStatus(tasks: Task[]) {
    tasks.forEach(task => {
      switch (task.status) {
        case 'to do':
          this.statusToDo.push(task);
          break;
        case 'in progress':
          this.statusInProgress.push(task);
          break;
        case 'awaiting feedback':
          this.statusAwaiting.push(task);
          break;
        case 'done':
          this.statusDone.push(task);
          break;
        default:
          console.error(`Unbekannter Status: ${task.status}`);
          break;
      }
    });
  }

  // This function sorts tasks by priority and pushs to urgent array
  async sortTasksByPriority(tasks: Task[]) {
    tasks.forEach(task => {
      switch (task.priority) {
        case 'urgent':
          this.urgentArray.push(task);
          break;
      }
    })
  }

  // This function sorts tasks by priority and pushs to urgent array
  async filterTaskDate(tasks: Task[]) {
    this.dateArray = [];  // Clear array before processing
    // Push task dates into the array
    tasks.forEach(task => {
      if (task.date) {
        this.dateArray.push(new Date(task.date));  // Ensure task.date is pushed as a Date object
      }
    });
    // Sort the dates in ascending order
    this.dateArray.sort((a, b) => a.getTime() - b.getTime());
    // Set the first (oldest) date from the sorted array
    if (this.dateArray.length > 0) {
      this.firstPrioDate = this.dateArray[0];  // This is a single Date, not an array
    }
  }

  getTime() {
    const now = new Date();
    this.currentTime = now.getHours();
  }

  // This function returns the specific greet string by daytime
  greetUserByTime(): string {
    if (this.currentTime >= 0 && this.currentTime < 12) {
      return 'Good morning,';
    } else if (this.currentTime >= 12 && this.currentTime < 18) {
      return 'Good afternoon,';
    } else {
      return 'Good evening,';
    }
  }
}
