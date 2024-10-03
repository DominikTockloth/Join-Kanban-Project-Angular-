import { Injectable } from '@angular/core';
import { Task } from './task';
import { collection, doc, Firestore, getDocs, query, updateDoc } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root',
})

export class TasksService {
  constructor(
    private firestore: Firestore
  ) { }
  tasks: Record<string, Task> = {};;


  async getAllTasks(): Promise<Record<string, Task>> {
    const tasks: Record<string, Task> = {};
    const q = query(collection(this.firestore, "tasks"));
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      const data = doc.data() as Task;
      const id = doc.id; // Firestore Document ID
      tasks[id] = new Task(
        data.title,
        data.description,
        data.date, // Ensure date is a Date object
        data.priority,
        data.category,
        data.contacts,
        data.subtasks,
        data.status,
        id
      );
    });
    return tasks;
}

async updateTask(id: string, updatedTask: Task): Promise<void> {
  if (id) {
    try {
      const taskRef = doc(this.firestore, "tasks", id);
      await updateDoc(taskRef, {
         title: updatedTask.title,           
         description: updatedTask.description,    
         date: updatedTask.date,              
         priority: updatedTask.priority,        
         category: updatedTask.category,       
         contacts: updatedTask.contacts,     
         subtasks: updatedTask.subtasks,     
         status: updatedTask.status,       
         id: updatedTask.id,
      });
    } catch (error) {
      console.error('Error updating task:', error);
      throw new Error(`Could not update task with id ${id}`);
    }
  } else {
    console.error('No valid ID provided for updating task');
    throw new Error('Invalid ID');
  }
}



}
