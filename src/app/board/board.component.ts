import { Component, OnInit, ChangeDetectorRef, HostListener } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TasksService } from '../tasks.service';
import { DatePipe, NgClass, NgFor, NgIf, NgStyle } from '@angular/common';
import { Task } from '../task';
import { EditTaskComponent } from '../edit-task/edit-task.component';
import { MatDialog } from '@angular/material/dialog';
import { DeleteTaskComponent } from '../delete-task/delete-task.component';
import { AddTaskDialogComponent } from '../add-task-dialog/add-task-dialog.component';
import { CdkDrag, CdkDragDrop, CdkDragPlaceholder, CdkDragPreview, DragDropModule } from '@angular/cdk/drag-drop';


interface Contact {
  name: string;
  email: string;
  phoneNumber: string;
  bgColor: string;
  id: string;
}

@Component({
  selector: 'app-board',
  standalone: true,
  imports: [
    RouterLink,
    NgFor,
    NgIf,
    NgClass,
    NgStyle,
    DragDropModule,
    CdkDragPlaceholder,
    CdkDrag,
    CdkDragPreview
  ],
  providers: [DatePipe],
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.scss', './board-overlay.scss'],
})

export class BoardComponent implements OnInit {
  status: string = '';
  statusAwaiting: Task[] = [];
  statusInProgress: Task[] = [];
  statusDone: Task[] = [];
  statusToDo: Task[] = [];
  statusGroups = [this.statusToDo, this.statusInProgress, this.statusAwaiting, this.statusDone];
  isMobileView: boolean = false;
  isTaskDetailCardOpen: boolean = false;
  tasks: Task[] = [];
  filteredTasks: Task[] = [];
  contacts: Contact[] = [];
  dateObject: Date = new Date();
  selectedTaskId: string = '';
  currentTask: Task | null = null;

  task: Task = {
    title: '',
    description: '',
    date: new Date(),
    priority: '',
    category: '',
    contacts: [],
    subtasks: [],
    status: '',
    id: ''
  };
  updatedTask: Task = {
    title: '',
    description: '',
    date: new Date(),
    priority: '',
    category: '',
    contacts: [],
    subtasks: [],
    status: '',
    id: ''
  }

  selectedTask: Task = {
    title: '',
    description: '',
    date: new Date(),
    priority: '',
    category: '',
    contacts: [],
    subtasks: [],
    status: '',
    id: ''
  }


  constructor(
    private taskservice: TasksService,
    public dialog: MatDialog,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.getAllTasks();
    this.checkScreenSize();
  };


  // This function is to load all contacts and convert them to an array
  async getAllTasks(): Promise<void> {
    const tasksObj: Record<string, Task> = await this.taskservice.getAllTasks();
    this.tasks = Object.values(tasksObj);  // Convert to an array
    this.sortTasksByStatus(this.tasks);
  }

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

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.checkScreenSize();  // Check screen size on window resize
  }
  // Checks screensize to adjust the mobile view
  checkScreenSize() {
    this.isMobileView = window.innerWidth <= 570;  // Adjust the size threshold as needed
  }

  // Moves task to next status list, when in mobile view by clicking arrow buttons
  moveToNextList(task: any) {
    let currentList: any[];
    let newList: any[];

    switch (task.status) {
      case 'to do':
        currentList = this.statusToDo;
        newList = this.statusInProgress;
        task.status = 'in progress';
        break;
      case 'in progress':
        currentList = this.statusInProgress;
        newList = this.statusAwaiting;
        task.status = 'awaiting feedback';
        break;
      case 'awaiting feedback':
        currentList = this.statusAwaiting;
        newList = this.statusDone;
        task.status = 'done';
        break;
      default:
        console.log('Task is already in the Done list');
        return;
    }

    // Remove the task from the current list
    this.removeTaskFromList(task, currentList);

    // Push the task into the new list
    newList.push(task);

    // Update the task status in the backend or wherever necessary
    this.updateTaskStatus(task, task.status);
  }


  // Moves task to previous status list, when in mobile view by clicking arrow buttons
  moveToPreviousList(task: any) {
    let currentList: any[];
    let newList: any[];

    switch (task.status) {
      case 'done':
        currentList = this.statusDone;
        newList = this.statusAwaiting;
        task.status = 'awaiting feedback';
        break;
      case 'awaiting feedback':
        currentList = this.statusAwaiting;
        newList = this.statusInProgress;
        task.status = 'in progress';
        break;
      case 'in progress':
        currentList = this.statusInProgress;
        newList = this.statusToDo;
        task.status = 'to do';
        break;
      default:
        console.log('Task is already in the ToDo list');
        return;
    }

    // Remove the task from the current list
    this.removeTaskFromList(task, currentList);

    // Push the task into the new list
    newList.push(task);

    // Update the task status in the backend or wherever necessary
    this.updateTaskStatus(task, task.status);
  }

  // Utility function to remove a task from its current list
  removeTaskFromList(task: any, list: any[]) {
    const index = list.indexOf(task);
    if (index > -1) {
      list.splice(index, 1); // Remove the task from the current list
    }
  }


  // This function handles the drag and drop event and updates the status
  drop(event: CdkDragDrop<Task[]>) {
    let previousIndex = event.previousIndex;
    let currentIndex = event.currentIndex;

    if (event.previousContainer.id === event.container.id) {
      // Same container: reorder task
      const task = event.previousContainer.data[previousIndex];
      event.previousContainer.data.splice(previousIndex, 1);
      event.container.data.splice(currentIndex, 0, task);
    } else {
      // Different containers: move task and update status
      const task = event.previousContainer.data[previousIndex];
      event.previousContainer.data.splice(previousIndex, 1);
      event.container.data.splice(currentIndex, 0, task);

      // Update task status
      const newStatus = this.getStatusFromContainerId(event.container.id);
      this.updateTaskStatus(task, newStatus);  // Call the updateTaskStatus method
    }
  }

  // This function updates the status of task
  updateTaskStatus(task: Task, newStatus: string) {
    if (task) {
      const updatedTask: Task = {
        title: task.title,
        description: task.description,
        date: task.date,
        priority: task.priority,
        category: task.category,
        contacts: task.contacts,
        subtasks: task.subtasks,
        status: newStatus,
        id: task.id,
      };
      this.taskservice.updateTask(task.id!, updatedTask)
        .then(() => {
        })
        .catch((error) => {
          console.error('Error updating task:', error);
        });
    } else {
      console.log('Error updating contact: invalid form, missing id, or no selected task');
    }
  }

  // This function returns status by the container id
  getStatusFromContainerId(containerId: string): string {
    switch (containerId) {
      case 'doneList':
        return 'done';
      case 'inProgressList':
        return 'in progress';
      case 'awaitingFeedbackList':
        return 'awaiting feedback';
      case 'toDoList':
        return 'to do';
      default:
        return 'unknown';
    }
  }

  // Filters tasks by a keydown event
  filterTasks(event: Event) {
    const input = (event.target as HTMLInputElement).value.toLowerCase();
    if (input) {
      // Tasks gets filtered by input value, and get displayed in html
      this.filteredTasks = this.tasks.filter(task =>
        task.title.toLowerCase().includes(input) 
      );
    } else {
      // If input is cleared, all tasks get displayed again
      this.filteredTasks = [];
    }
  }
  
  

  // This function displays the card detail
  openCardDetail(id: string | undefined) {
    if (id) {
      this.selectedTaskId = id;
      const foundTask = this.tasks.find(task => task.id === id);
      if (foundTask) {
        this.selectedTask = foundTask;
        this.isTaskDetailCardOpen = true;
      }
    }
  }
  // This function closes the card detail view
  closeCardDetail() {
    this.isTaskDetailCardOpen = false;
  }

  // Sets the first letters of the inputed value to uppercase
  capitalizeFirstLetter(string: string): string {
    return string
      .split(' ')  // Split words 
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))  // Capitalize first letter of each word
      .join(' ');  // Puts words back together
  }

  // Sets the task category bg-color
  getBgColorCategory(category: string): string {
    switch (category) {
      case 'User Story':
        return '#00BEE7';
      case 'Technical Task':
        return '#FF4647';
      default:
        return 'transparent';
    }
  }

  // Gets the initials of all contacts
  getInitials(name: string): string {
    const nameParts = name.split(' ');
    if (nameParts.length > 1) {
      return nameParts[0].charAt(0).toUpperCase() + nameParts[1].charAt(0).toUpperCase();
    } else {
      return name.charAt(0).toUpperCase();
    }
  }

  // This function opens the edit-contact-dialog
  openEditTaskDialog(id: string): void {
    if (id && this.selectedTaskId) {
      this.isTaskDetailCardOpen = true;
      // Erstelle eine Kopie des selectedContact-Objekts, um sicherzustellen, dass alle Felder vom erwarteten Typ sind
      const dialogTask: Task = {
        title: this.selectedTask.title,
        description: this.selectedTask.description,
        date: this.selectedTask.date,
        priority: this.selectedTask.priority,
        category: this.selectedTask.category,
        contacts: this.selectedTask.contacts,
        subtasks: this.selectedTask.subtasks,
        status: this.selectedTask.status,
        id: this.selectedTask.id
      };
      const dialogRef = this.dialog.open(EditTaskComponent);
      dialogRef.componentInstance.selectedTask = dialogTask;
      this.isTaskDetailCardOpen = false;
    }
  }

  // This function opens the delete-contact-dialog
  openDeleteTaskDialog(id: string) {
    if (id && this.selectedTask) {
      const dialogTask: Task = {
        title: this.selectedTask.title,
        description: this.selectedTask.description,
        date: new Date(),
        priority: this.selectedTask.priority,
        category: this.selectedTask.category,
        contacts: this.selectedTask.contacts,
        subtasks: this.selectedTask.subtasks,
        status: this.selectedTask.status,
        id: this.selectedTask.id
      };
      const dialogRef = this.dialog.open(DeleteTaskComponent);
      dialogRef.componentInstance.selectedTask = dialogTask;
    }
  }

  // This function opens the add task overlay
  openAddTaskDialog(status: string) {
    if (status) {
      this.status = status;
      const dialogTask: Task = {
        title: '',
        description: '',
        date: new Date(),
        priority: '',
        category: '',
        contacts: [],
        subtasks: [],
        status: this.status,
        id: ''
      };
      const dialogRef = this.dialog.open(AddTaskDialogComponent, {
        data: dialogTask  // Pass the dialogTask object with the status
      });
      dialogRef.componentInstance.task = dialogTask;
    }

  }

  // Converts the date-object to the specific format
  convertToDateString(date: Date | string): string {
    const dateObject = typeof date === 'string' ? new Date(date) : date;
    if (!isNaN(dateObject.getTime())) { // Checks for a valid date
      const year = dateObject.getFullYear();
      const month = ('0' + (dateObject.getMonth() + 1)).slice(-2);  // Month-index is 0
      const day = ('0' + dateObject.getDate()).slice(-2);
      return `${day}-${month}-${year}`;  // Convert to dd-MM-yyyy
    } else {
      return ''; // Returns empty string, if date is not valid
    }
  }

}
