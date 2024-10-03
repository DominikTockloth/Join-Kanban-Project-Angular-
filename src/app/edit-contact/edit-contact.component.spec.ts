import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditContactComponent } from './edit-contact.component';
import { MatDialogRef } from '@angular/material/dialog';

describe('EditContactComponent', () => {
  let component: EditContactComponent;
  let fixture: ComponentFixture<EditContactComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditContactComponent],
      providers:[MatDialogRef]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditContactComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
