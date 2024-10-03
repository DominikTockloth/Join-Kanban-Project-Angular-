import { Injectable } from '@angular/core';
import { collection, query, getDocs, where, doc, getDoc, updateDoc } from "firebase/firestore";
import { Firestore } from '@angular/fire/firestore';

interface Contact {
  id: string;
  name: string;
  email: string;
  phoneNumber: string;
  bgColor: string;
}

@Injectable({
  providedIn: 'root'
})

export class UserService {

  constructor(private firestore: Firestore) { }
  contacts: Record<string, Contact> = {};


  //Get all information of registred users
  async getAllUsers(): Promise<void> {
    const q = query(collection(this.firestore, "user"));
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc: { id: any; data: () => any; }) => {
      // doc.data() is never undefined for query doc snapshots
    });
  }


  // In UserService
  async getAllContacts(): Promise<Record<string, Contact>> {
    const contacts: Record<string, Contact> = {};
    const q = query(collection(this.firestore, "contacts"));
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      const data = doc.data() as Contact;
      const id = doc.id; // Firestore Document ID
      contacts[id] = { ...data, id }; // Include the id in the contact object
    });
    return contacts;
  }


  // This is to get a single contact reference
  async getSingleContact(id: string): Promise<Contact> {
    const docRef = doc(this.firestore, 'contacts', id);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const data = docSnap.data() as Omit<Contact, 'id'>; // Exclude 'id' from the data
      return { id: docSnap.id, ...data }; // Add 'id' manually
    } else {
      throw new Error('No such document!');
    }
  }

  async updateContact(id: string, updatedContact: Contact): Promise<void> {
    if (id) {
      try {
        const contactRef = doc(this.firestore, "contacts", id);
        await updateDoc(contactRef, {
          name: updatedContact.name,
          email: updatedContact.email,
          phoneNumber: updatedContact.phoneNumber,
        });
      } catch (error) {
        console.error('Error updating contact:', error);
        throw new Error(`Could not update contact with id ${id}`);
      }
    } else {
      console.error('No valid ID provided for updating contact');
      throw new Error('Invalid ID');
    }
  }

  async checkUserByEmail(email: string): Promise<any> {
    const q = query(collection(this.firestore, 'user'), where('email', '==', email));
    const querySnapshot = await getDocs(q);
    if (!querySnapshot.empty) {
      const userDoc = querySnapshot.docs[0];
      return userDoc.data(); // returns user object
    } else {
      return null;
    }
  }

  async checkUserCredentials(email: string, password: string): Promise<boolean> {
    const q = query(collection(this.firestore, "user"), where("email", "==", email), where("password", "==", password));
    const querySnapshot = await getDocs(q);
    return !querySnapshot.empty;  // returns true, if doc is found
  }
}



