import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteContactDialogComponent } from './delete-contact-dialog.component';
import { MatDialogRef } from '@angular/material/dialog';

describe('DeleteContactDialogComponent', () => {
  let component: DeleteContactDialogComponent;
  let fixture: ComponentFixture<DeleteContactDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DeleteContactDialogComponent],
      providers:[MatDialogRef]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DeleteContactDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
