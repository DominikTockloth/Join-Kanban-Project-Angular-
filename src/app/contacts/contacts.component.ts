import { Component, HostListener, OnInit } from '@angular/core';
import { AddContactComponent } from '../add-contact/add-contact.component';
import { MatDialog, MatDialogClose, MatDialogModule } from '@angular/material/dialog';
import { UserService } from '../user.service';
import { CommonModule, NgFor, NgStyle } from '@angular/common';
import { EditContactComponent } from '../edit-contact/edit-contact.component';
import { DeleteContactDialogComponent } from '../delete-contact-dialog/delete-contact-dialog.component';

interface Contact {
  name: string;
  email: string;
  phoneNumber: string;
  bgColor: string;
  id: string;
}

@Component({
  selector: 'app-contacts',
  standalone: true,
  imports: [
    CommonModule,
    AddContactComponent,
    MatDialogModule,
    MatDialogClose,
    NgFor,
    NgStyle
  ],
  templateUrl: './contacts.component.html',
  styleUrls: ['./contacts.component.scss', './contacts-responsive.scss']
})

export class ContactsComponent implements OnInit {
  dialogRef: any;
  contacts: Contact[] = [];
  sortedContacts: { [key: string]: any[] } = {}; // List of contacts , sorted by first letter of firstname
  selectedContact: Contact = {
    id: '',
    name: '',
    email: '',
    phoneNumber: '',
    bgColor: ''
  };

  contactDetailIsOpen: boolean = false;
  selectedContactId: string = '';
  isMobileView: boolean = false;
  isDetailMobileView: boolean = false;
  constructor(public dialog: MatDialog, private userservice: UserService) { }

  // Loads on init all contacts to display
  async ngOnInit(): Promise<void> {
    const contactsRecord = await this.userservice.getAllContacts();
    this.contacts = Object.values(contactsRecord);
    this.sortContacts(this.contacts);
    this.checkScreenSize();
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.checkScreenSize();  // Check screen size on window resize
  }

  checkScreenSize() {
    this.isMobileView = window.innerWidth <= 690;  // Adjust the size threshold as needed
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


  // Gets the initials of all contacts
  getInitials(name: string): string {
    const nameParts = name.split(' ');
    if (nameParts.length > 1) {
      return nameParts[0].charAt(0).toUpperCase() + nameParts[1].charAt(0).toUpperCase();
    } else {
      return name.charAt(0).toUpperCase();
    }
  }

  // Display the specific contact detail
  openContactDetail(id: string) {
    this.contactDetailIsOpen = true;
    this.selectedContactId = id;
    if (this.isMobileView) {
      this.isDetailMobileView = true;  // For mobile view, show detail and hide scroll box
    }
    const foundContact = this.contacts.find(contact => contact.id === id);
    this.selectedContact = foundContact ? foundContact : { id: '', name: '', email: '', phoneNumber: '', bgColor: '' };
  }

  closeContactDetail() {
    if (this.isMobileView) {
      this.isDetailMobileView = false;  // Close detail view on mobile
    }
  }

  // Opens the Add Contact dialog
  openAddContactDialog(): void {
    const dialogRef = this.dialog.open(AddContactComponent, {
      data: {},
    });
  }

  // This function opens the delete-contact-dialog
  openDeleteContactDialog(id: string) {
    if (id && this.selectedContact) {
      const dialogContact: Contact = {
        id: this.selectedContact.id,
        name: this.selectedContact.name,
        email: this.selectedContact.email,
        phoneNumber: this.selectedContact.phoneNumber, // Stellt sicher, dass phoneNumber ein string ist
        bgColor: this.selectedContact.bgColor,
      };
      const dialogRef = this.dialog.open(DeleteContactDialogComponent);
      dialogRef.componentInstance.selectedContact = dialogContact;

    }
  }

  // This function opens the edit-contact-dialog
  openEditContactDialog(id: string): void {
    if (id && this.selectedContact) {
      // Erstelle eine Kopie des selectedContact-Objekts, um sicherzustellen, dass alle Felder vom erwarteten Typ sind
      const dialogContact: Contact = {
        id: this.selectedContact.id,
        name: this.selectedContact.name,
        email: this.selectedContact.email,
        phoneNumber: this.selectedContact.phoneNumber,
        bgColor: this.selectedContact.bgColor,
      };
      const dialogRef = this.dialog.open(EditContactComponent);
      dialogRef.componentInstance.selectedContact = dialogContact;
    }
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

}
