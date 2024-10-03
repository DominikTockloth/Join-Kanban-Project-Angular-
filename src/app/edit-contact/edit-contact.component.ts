import { NgClass, NgIf, NgStyle } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogActions, MatDialogClose, MatDialogContent, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule, MatLabel } from '@angular/material/form-field';
import { UserService } from '../user.service';

interface Contact {
  name: string;
  email: string;
  phoneNumber: string;
  bgColor: string;
  id: string;
}

@Component({
  selector: 'app-edit-contact',
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
    NgStyle,
    NgClass
  ],
  templateUrl: './edit-contact.component.html',
  styleUrl: './edit-contact.component.scss'
})

export class EditContactComponent implements OnInit {
  contact: Contact = { id: '', name: '', email: '', phoneNumber: '', bgColor: '' };
  selectedContact: Contact = { id: '', name: '', email: '', phoneNumber: '', bgColor: '' };
  sortedContacts: { [key: string]: any[] } = {};
  id: string = '';
  contacts: Contact[] = [];
  isContactEdited: boolean = false;
  editedName: string = '';
  editedEmail: string = '';
  editedPhoneNumber: string = '';

  isValid: boolean = true;
  constructor(
    private dialogRef: MatDialogRef<EditContactComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { id: string },
    private userservice: UserService,
  ) { }

  ngOnInit(): void {
    this.editedName = this.selectedContact.name;
    this.editedEmail = this.selectedContact.email;
    this.editedPhoneNumber = this.selectedContact.phoneNumber;
  }

  // Function to extract the initials from first and lastname
  getInitials(name: string): string {
    const nameParts = name.split(' ');
    if (nameParts.length > 1) {
      return nameParts[0].charAt(0).toUpperCase() + nameParts[1].charAt(0).toUpperCase();
    } else {
      return name.charAt(0).toUpperCase();
    }
  }

  editContact(id: string) {
    if (id) {
      const updatedContact: Contact = {
        id: this.selectedContact.id,  // Die ID bleibt gleich
        name: this.editedName,  // Neue Werte aus dem Formular holen
        email: this.editedEmail,
        phoneNumber: this.editedPhoneNumber,
        bgColor: this.selectedContact.bgColor,
      };
      this.userservice.updateContact(updatedContact.id, updatedContact)
        .then(() => {
          this.isContactEdited = true;
          setTimeout(() => {
            window.location.reload();
            this.dialogRef.close();
          }, 3000);
          setTimeout(() => {
            this.isContactEdited = false;
          }, 3500)

        })
        .catch((error) => {
          console.error('Error updating contact:', error);
        });
    } else {
      console.log('Error updating contact: invalid form, missing id, or no selected contact');
    }
  }

  isFormValid(): boolean {
    return this.editedName.length > 0 && 
           this.editedEmail.length > 0 && 
           this.editedPhoneNumber !== null; // Überprüfe, ob die Telefonnummer gesetzt ist
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

}




