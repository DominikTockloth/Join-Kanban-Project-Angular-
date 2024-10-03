import { Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import { Task } from '../task';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { UserService } from '../user.service';
import { NgClass, NgFor, NgIf, NgStyle } from '@angular/common';
import { addDoc, collection } from 'firebase/firestore';
import { Firestore } from '@angular/fire/firestore';
import { FormsModule } from '@angular/forms';

interface Contact {
  name: string;
  email: string;
  phoneNumber: string;
  bgColor: string;
  id: string;
}

@Component({
  selector: 'app-add-task-dialog',
  standalone: true,
  imports: [
    NgClass,
    NgIf,
    NgFor,
    NgStyle,
    FormsModule
  ],
  templateUrl: './add-task-dialog.component.html',
  styleUrls: ['./add-task-dialog.component.scss', './add-task-dialog-responsive.scss']
})

export class AddTaskDialogComponent implements OnInit {
  task: Task = {
    title: '',
    description: '',
    date: new Date(),
    priority: '',
    category: '',
    subtasks: [],
    contacts: [],
    status: '',
  }
  contactListOpen: boolean = false;
  categoryListOpen: boolean = false;
  subTaskAdded: boolean = false;
  isCategorySelected: boolean = false;
  isTaskAdded: boolean = false;
  contacts: Contact[] = [];  // To store contacts as an array
  selectedContacts: Contact[] = [];
  selectedCategory: string = '';
  prioSelected: string = 'medium';
  status?: string = '';
  addedSubtasks: string[] = [];
  subTaskInput: string = '';
  currentSubtask: string | null = null; // Actual subtask
  editedSubtaskValue: string = ''; // Value of editing subtask
  title: string = '';
  description: string = '';
  dateValue: string;
  minDate: string;
  formattedDate: string = '';
  isTitleTouched: boolean = false;
  isDescriptionTouched: boolean = false;
  isCategoryTouched: boolean = false;
  isDateTouched: boolean = false;

  constructor(
    private dialogRef: MatDialogRef<AddTaskDialogComponent>,
    private userservice: UserService,
    private firestore: Firestore,
    @Inject(MAT_DIALOG_DATA) public data: Task
  ) {
    this.task = data;
    const today = new Date();
    this.dateValue = this.formatDateToInput(today); // Format für das Datum
    this.minDate = this.formatDateToInput(today); // Mindestdatum für das Datum

  }

  ngOnInit(): void {
    this.getAllContacts();  // Fetch contacts when the component is initialized
  }

  // This function is to load all contacts and convert them to an array
  async getAllContacts(): Promise<void> {
    const contactsObj: Record<string, Contact> = await this.userservice.getAllContacts();
    this.contacts = Object.values(contactsObj);  // Convert to an array
  }

  // This function is to add tasks with the specific values
  async addTask() {
    if (this.isFormValid()) {
      try {
        const docRef = await addDoc(collection(this.firestore, "tasks"), {
          title: this.title,
          description: this.description,
          date: this.dateValue,
          priority: this.prioSelected,
          category: this.selectedCategory,
          subtasks: this.addedSubtasks,
          contacts: this.selectedContacts,
          status: this.task.status,
        });
        this.isTaskAdded = true;
        setTimeout(() => {
          this.isTaskAdded = false;
        }, 3500)
        setTimeout(() => {
          window.location.reload();
          this.isTaskAdded = false;
        }, 3500)
      } catch (e) {
        console.error("Error adding task: ", e);
      }
    }
  }

  // This function is for toggeling the prio buttons
  togglePriority(priority: string) {
    this.prioSelected = priority;
  }

  // This selects the category and sets it to the value of selectedCategory
  selectCategory(category: string) {
    if (category) {
      this.selectedCategory = category;
      this.categoryListOpen = false;
      console.log(this.selectedCategory);
    }
  }

  // Convert Date to yyyy-mm-dd for input value
  formatDateToInput(date: Date): string {
    const year = date.getFullYear();
    const month = ('0' + (date.getMonth() + 1)).slice(-2);
    const day = ('0' + date.getDate()).slice(-2);
    return `${year}-${month}-${day}`;
  }

  // Convert input value yyyy-mm-dd to Date object
  parseDateFromInput(value: string): Date {
    const [year, month, day] = value.split('-').map(Number);
    return new Date(year, month - 1, day);
  }

  // This changes the choosen date of the date picker for the required date
  onDateChange(event: any): void {
    const value = event.target.value;
    const date = this.parseDateFromInput(value);
    const formattedDate = this.formatDateToInput(date);
  }

  // This function toggles the selected contacts and pushs them into selectedContacts array
  toggleContactSelection(contact: Contact, event?: MouseEvent): void {
    if (event) {
      event.stopPropagation();// Prevent the checkbox click from bubbling up and triggering the div click event
    }
    const index = this.selectedContacts.indexOf(contact);
    if (index === -1) {
      this.selectedContacts.push(contact);// Add contact if not already selected

    } else {
      this.selectedContacts.splice(index, 1);// Remove contact if already selected
    }
  }

  // Returns true or false, neither a contact is selected or not
  isSelected(contact: Contact): boolean {
    return this.selectedContacts.includes(contact);
  }

  // This function checks, if required values are filled
  isFormValid(): boolean {
    return !!(this.title?.trim() && this.description?.trim() && this.dateValue?.trim() && this.selectedCategory?.trim());
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

  // Toggles the contact list to close and open
  toggleContactList() {
    if (!this.contactListOpen) {
      this.contactListOpen = true;
    } else {
      this.contactListOpen = false;
    }
  }

  // Toggles the category list to close and open
  toggleCategoryList() {
    if (!this.categoryListOpen) {
      this.categoryListOpen = true;
    } else {
      this.categoryListOpen = false;
    }
  }

  // This function pushes the value of input to the added subtask array
  @ViewChild('subtaskInput') subtaskInput!: ElementRef;
  addSubtask(): void {
    const subtaskValue = this.subtaskInput.nativeElement.value;
    if (subtaskValue) {
      this.addedSubtasks.push(subtaskValue);
      this.subtaskInput.nativeElement.value = ''; // Clears the input
    }
  }

  // This function handles the editing subtask
  editSubtask(subtask: string): void {
    this.currentSubtask = subtask;
    this.editedSubtaskValue = subtask; // Initialisiere den Wert für die Bearbeitung
  }

  // This function saves the edited subtask
  saveEditedSubtask(): void {
    if (this.currentSubtask && this.editedSubtaskValue) {
      const index = this.addedSubtasks.indexOf(this.currentSubtask);
      if (index !== -1) {
        this.addedSubtasks[index] = this.editedSubtaskValue; // Aktualisiere den Subtask
        this.currentSubtask = null; // Setze den aktuellen Subtask zurück
        this.editedSubtaskValue = ''; // Setze den bearbeiteten Wert zurück
      }
    }
  }

  // This function deletes the specific subtask
  deleteSubtask(subtask: string): void {
    const index = this.addedSubtasks.indexOf(subtask);
    if (index !== -1) { // Checks for subtask in array
      this.addedSubtasks.splice(index, 1); // Deletes subtask
    }
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}
