import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import {
  MatDialogModule,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle,
} from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { Task } from '../task';
import { DatePipe, NgClass, NgFor, NgIf, NgStyle } from '@angular/common';
import { UserService } from '../user.service';
import { TasksService } from '../tasks.service';

interface Contact {
  name: string;
  email: string;
  phoneNumber: string;
  bgColor: string;
  id: string;
}

@Component({
  selector: 'app-edit-task',
  standalone: true,
  imports: [
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    MatButtonModule,
    MatInputModule,
    MatDialogTitle,
    MatDialogContent,
    MatDialogActions,
    MatDialogClose,
    MatDialogModule,
    NgIf,
    NgFor,
    NgStyle,
    NgClass,

  ],
  providers: [DatePipe],
  templateUrl: './edit-task.component.html',
  styleUrls: ['./edit-task.component.scss', './edit-task-responsive.scss']
})

export class EditTaskComponent {
  isEditOverlayClosed: boolean = false;
  isTaskEdited: boolean = false;
  isContactListOpen: boolean = false;
  prioSelected: string = '';
  editedTitle: string = '';
  editedDescription: string = '';
  editedPrioSelected: string = '';
  editedDate: Date = new Date();
  contacts: Contact[] = []; // List of all contacts
  subtasks: string[] = [];
  minDate: string;

  selectedTask: Task = {
    title: '',
    description: '',
    date: new Date,
    priority: '',
    category: '',
    contacts: [],
    subtasks: [],
    status: '',
    id: ''
  };
  constructor(
    private dialogRef: MatDialogRef<EditTaskComponent>,
    private userservice: UserService,
    private taskservice: TasksService,
    private datePipe: DatePipe
  ) {
    const today = new Date();
    this.minDate = this.formatDateToInput(today);
  }

  ngOnInit(): void {
    this.getAllContacts();  // Fetch contacts when the component is initialized
    this.prioSelected = this.selectedTask.priority;   // Set priority based on the selected task
    this.editedTitle = this.selectedTask.title;
    this.editedDescription = this.selectedTask.description;
    this.editedDate = this.selectedTask.date;
  }

  // This function is to load all contacts and convert them to an array
  async getAllContacts(): Promise<void> {
    const contactsObj: Record<string, Contact> = await this.userservice.getAllContacts();
    this.contacts = Object.values(contactsObj);  // Convert to an array
  }

  editTask(id: string) {
    if (id) {
      const updatedTask: Task = {
        title: this.editedTitle,
        description: this.editedDescription,
        date: this.editedDate,
        priority: this.editedPrioSelected,
        category: this.selectedTask.category,
        contacts: this.selectedTask.contacts,
        subtasks: this.selectedTask.subtasks,
        status: this.selectedTask.status,
        id: this.selectedTask.id,
      };
      this.taskservice.updateTask(id, updatedTask)
        .then(() => {
          this.isEditOverlayClosed = true;
          this.isTaskEdited = true;
          setTimeout(() => {
            window.location.reload();
            this.dialogRef.close();
          }, 3000);
          setTimeout(() => {
            this.isTaskEdited = false;
          }, 3500)

        })
        .catch((error) => {
          console.error('Error updating contact:', error);
        });
    } else {
      console.log('Error updating contact: invalid form, missing id, or no selected contact');
    }
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  // Returns true or false, neither a contact is selected or not
  isSelected(contact: Contact): boolean {
    return this.selectedTask.contacts?.some(c => c.id === contact.id) ?? false;
  }

  // This function toggles the selected contacts and pushs them into selectedContacts array
  toggleContactSelection(contact: Contact, event?: MouseEvent): void {
    if (event) {
      event.stopPropagation(); // Prevent checkbox click from bubbling up to div click
    }
    // Check if the contact is already in selectedTask.contacts
    const index = this.selectedTask.contacts?.findIndex(c => c.id === contact.id);
    if (index === -1 || index === undefined) {
      // If the contact is not selected, add it to selectedTask.contacts
      this.selectedTask.contacts?.push(contact);
    } else if (index !== undefined) {
      // If the contact is already selected, remove it
      this.selectedTask.contacts?.splice(index, 1);
    }
  }


  // Toggles the contact list to close and open
  toggleContactList() {
    if (!this.isContactListOpen) {
      this.isContactListOpen = true;
    } else {
      this.isContactListOpen = false;
    }
  }

  // This function is for toggeling the prio buttons
  togglePriority(priority: string) {
    this.editedPrioSelected = priority;
    this.prioSelected = priority;
  }

  // This function pushes the value of input to the added subtask array
  @ViewChild('subtaskInput') subtaskInput!: ElementRef;
  addSubtask(): void {
    const subtaskValue = this.subtaskInput.nativeElement.value;
    if (subtaskValue) {
      // Ensure that subtasks array exists before pushing the value
      if (!this.selectedTask.subtasks) {
        this.selectedTask.subtasks = []; // Initialize if undefined
      }
      this.selectedTask.subtasks.push(subtaskValue); // Add to selectedTask.subtasks
      this.subtaskInput.nativeElement.value = ''; // Clears the input
    }
  }

  // This function removes the specific subtask of array
  removeSubtask(subtask: string): void {  // Function declaration: Takes a subtask string as an argument and returns nothing (void).
    if (this.selectedTask.subtasks && this.selectedTask.subtasks.length > 0) {  // Check if subtasks array exists and is not empty.
      this.selectedTask.subtasks = this.selectedTask.subtasks.filter(s => s !== subtask);  // Create a new array excluding the subtask to be removed and assign it back to the subtasks.
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

  capitalizeFirstLetters(contact: string): string {
    return contact
      .split(' ')  // Trenne die Wörter
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))  // Mach den ersten Buchstaben jedes Wortes groß
      .join(' ');  // Füge die Wörter wieder zusammen
  }

  // Convert Date to yyyy-mm-dd for input value
  formatDate(date: Date) {
    if (date) {
      return this.datePipe.transform(new Date(date), 'yyyy-MM-dd') ?? ''; // Format date for input type="date"
    }
    return '';  // Return empty string if no date
  }


  formatDateForEditedTask(date: Date | string): string {
    if (date) {
      const parsedDate = new Date(date);
      if (!isNaN(parsedDate.getTime())) { // Check if date is valid
        return this.datePipe.transform(parsedDate, 'yyyy-MM-dd') ?? '';
      } else {
        console.error('Invalid date provided:', date);
      }
    }
    return ''; // Return empty string if date is invalid or transformation fails
  }
  onDateChange(event: any): void {
    const value = event.target.value;
    this.editedDate = value; // Make sure `parseDateFromInput` returns a `Date`
  }

  // Convert input value yyyy-mm-dd to Date object
  parseDateFromInput(value: string): Date {
    const [year, month, day] = value.split('-').map(Number);
    return new Date(year, month - 1, day); // Returns a `Date` object
  }

  getParsedDate(): Date {
    return new Date(this.editedDate);
  }


  // Formates the date of task to specific format
  formatDateToInput(date: Date): string {
    const year = date.getFullYear();
    const month = ('0' + (date.getMonth() + 1)).slice(-2);
    const day = ('0' + date.getDate()).slice(-2);
    return `${year}-${month}-${day}`; // This returns a `string` in 'yyyy-MM-dd' format
  }








}
