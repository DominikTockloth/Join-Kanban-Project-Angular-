import { NgClass, NgIf } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { deleteDoc, doc, Firestore } from '@angular/fire/firestore';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

interface Contact {
  name: string;
  email: string;
  phoneNumber: string;
  bgColor: string;
  id: string;
}

@Component({
  selector: 'app-delete-contact-dialog',
  standalone: true,
  imports: [NgIf, NgClass],
  templateUrl: './delete-contact-dialog.component.html',
  styleUrl: './delete-contact-dialog.component.scss'
})

export class DeleteContactDialogComponent {
  constructor(
    private dialogRef: MatDialogRef<DeleteContactDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { id: string },
    private firestore: Firestore,
  ) { }

  contacts: Contact[] = [];
  sortedContacts: { [key: string]: any[] } = {}; // List of contacts , sorted by first letter of firstname
  selectedContact: Contact = {
    id: '',
    name: '',
    email: '',
    phoneNumber: '',
    bgColor: ''
  };

  isContactDeleted: boolean = false;

  async deleteContact(id: string) {
    if (id) {
      try {
        await deleteDoc(doc(this.firestore, "contacts", id));
        this.isContactDeleted = true;
        setTimeout(() => {
          this.dialogRef.close();
          this.sortContacts(this.contacts);
        }, 3000);
        setTimeout(() => {
          this.isContactDeleted = false;
        }, 3500);

      } catch (e) { }
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

  onNoClick(): void {
    this.dialogRef.close();
  }
}
