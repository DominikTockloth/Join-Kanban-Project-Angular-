import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LogInComponent } from './log-in.component';
import { Firestore, getFirestore } from 'firebase/firestore';
import { provideFirestore } from '@angular/fire/firestore';
import { FirebaseApps } from '@angular/fire/app';

describe('LogInComponent', () => {
  let component: LogInComponent;
  let fixture: ComponentFixture<LogInComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LogInComponent,],
      providers: [
        FirebaseApps,
        { provide: Firestore, useValue: jasmine.createSpyObj('Firestore', ['collection', 'doc']) },
        provideFirestore(() => getFirestore()), // falls du Firestore mit provideFirestore nutzt
      ],
    })
    .compileComponents();

    fixture = TestBed.createComponent(LogInComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
