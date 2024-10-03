import { Component, Inject } from '@angular/core';
import { Task } from '../task';
import { deleteDoc, doc } from 'firebase/firestore';
import { Firestore } from '@angular/fire/firestore';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { NgClass, NgIf } from '@angular/common';

@Component({
  selector: 'app-delete-task',
  standalone: true,
  imports: [
    NgClass, NgIf
  ],
  templateUrl: './delete-task.component.html',
  styleUrl: './delete-task.component.scss'
})
export class DeleteTaskComponent {
  isTaskDeleted: boolean = false;

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
  };

  constructor(
    private dialogRef: MatDialogRef<DeleteTaskComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { id: string },
    private firestore: Firestore) { }


  async deleteTask(id: string) {
    if (id) {
      try {
        await deleteDoc(doc(this.firestore, "tasks", id));
        this.isTaskDeleted = true;
        setTimeout(() => {
          window.location.reload();
          this.dialogRef.close();
        }, 3000);
        setTimeout(() => {
          this.isTaskDeleted = false;
        }, 3500);

      } catch (e) { }
    }
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}
