import { TestBed } from '@angular/core/testing';

import { UserService } from './user.service';
import { Firestore } from 'firebase/firestore';

describe('UserService', () => {
  let service: UserService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers:[Firestore]
    });
    service = TestBed.inject(UserService);
  
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
