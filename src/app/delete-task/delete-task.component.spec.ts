import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteTaskComponent } from './delete-task.component';
import { MatDialogRef } from '@angular/material/dialog';

describe('DeleteTaskComponent', () => {
  let component: DeleteTaskComponent;
  let fixture: ComponentFixture<DeleteTaskComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DeleteTaskComponent],
      providers:[MatDialogRef]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DeleteTaskComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
