import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogActions, MatDialogClose, MatDialogContent, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule, MatLabel } from '@angular/material/form-field';
import { Firestore, addDoc, collection } from '@angular/fire/firestore';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { NgClass, NgIf } from '@angular/common';
import { UserService } from '../user.service';

interface Contact {
  name: string;
  email: string;
  phoneNumber: string;
  bgColor: string;
  id: string;
}

@Component({
  selector: 'app-add-contact',
  standalone: true,
  imports: [
    MatDialogActions,
    MatDialogModule,
    MatDialogContent,
    MatDialogClose,
    MatLabel,
    MatFormFieldModule,
    ReactiveFormsModule,
    FormsModule,
    NgIf,
    NgClass
  ],
  templateUrl: './add-contact.component.html',
  styleUrl: './add-contact.component.scss'
})
export class AddContactComponent {
  name: string = "";
  email: string = "";
  phoneNumber: number | null = null;
  colors: string[] = ['#FF5733', '#33FF57', '#3357FF', '#FF33A6', '#FF8C33'];
  isContactAdded: boolean = false;
  contacts: Contact[] = [];
  sortedContacts: { [key: string]: any[] } = {}; // List of contacts , sorted by first letter of firstname
  signInForm: FormGroup;
  newContact: Contact[] = [];
  constructor(
    private dialogRef: MatDialogRef<AddContactComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private firestore: Firestore,
    private fb: FormBuilder,
  ) {
    this.signInForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phoneNumber: ['', [Validators.required, Validators.minLength(6)]],
    });
  }


  // This function is to add a new contact with its specific values
  async addContact(): Promise<void> {
    if (this.signInForm.valid) {
      try {
        const formValue = this.signInForm.value;
        const newContact = await addDoc(collection(this.firestore, "contacts"), {
          name: this.name,
          email: this.email,
          phoneNumber: this.phoneNumber,
          bgColor: this.getRandomColor(),
        });
        this.isContactAdded = true;
        setTimeout(() => {
          this.dialogRef.close();
        }, 4000);
        setTimeout(() => {
          this.isContactAdded = false;
        }, 4500)
      } catch (e) {
        console.error("Error adding document: ", e);

      }
    } else {
      console.error("Form is not valid");
    }
  }

  // This function is for sorting and grouping the contacts
  sortContacts(contacts: any[]): void {
    // First, all contacts gets sorted alphabetically by firstname 
    contacts.sort((a, b) => a.name.localeCompare(b.name));
    // Then, after sorting by firstname , contacts get grouped by first letter of firstname 
    this.sortedContacts = contacts.reduce((groups, contact) => {
      const firstLetter = contact.name.charAt(0).toUpperCase();
      if (!groups[firstLetter]) {
        groups[firstLetter] = [];
      }
      groups[firstLetter].push(contact);
      return groups;
    }, {});
  }

  // This function is to get a random bgColor for each contact avatar
  getRandomColor(): string {
    const randomIndex = Math.floor(Math.random() * this.colors.length);
    return this.colors[randomIndex];
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}
