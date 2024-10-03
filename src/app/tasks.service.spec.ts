import { TestBed } from '@angular/core/testing';

import { TasksService } from './tasks.service';
import { Firestore } from 'firebase/firestore';

describe('TasksService', () => {
  let service: TasksService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers:[Firestore]
    });
    service = TestBed.inject(TasksService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
