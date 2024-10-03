import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditTaskComponent } from './edit-task.component';
import { MatDialogRef } from '@angular/material/dialog';
import { Firestore } from 'firebase/firestore';
import { AngularFirestore } from '@angular/fire/compat/firestore';


describe('EditTaskComponent', () => {
  let component: EditTaskComponent;
  let fixture: ComponentFixture<EditTaskComponent>;
  let mockDialogRef: jasmine.SpyObj<MatDialogRef<any>>;

  beforeEach(async () => {
    mockDialogRef = jasmine.createSpyObj('MatDialogRef', ['close', 'afterClosed']);
    await TestBed.configureTestingModule({
      imports: [EditTaskComponent,
      ],
      providers:[  AngularFirestore, Firestore, { provide: MatDialogRef, useValue: mockDialogRef },]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditTaskComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
