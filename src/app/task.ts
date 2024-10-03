interface Contact {
    name: string;
    email: string;
    phoneNumber: string;
    bgColor: string;
    id: string;
  }

export class Task {
    constructor(
        
        public title: string,            // Required
        public description: string,     // Required
        public date: Date,              // Required
        public priority: string,        // Required
        public category: string,        // Required
        public contacts?: Contact[],     // Optional
        public subtasks?: string[],      // Optional
        public status?: string,          // Optional
        public id?: string,
    ) { }
 
}
