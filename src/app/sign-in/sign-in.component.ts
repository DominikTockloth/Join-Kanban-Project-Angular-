import { Component } from '@angular/core';
import { Router,  RouterLink } from '@angular/router';
import { Firestore, addDoc, collection } from '@angular/fire/firestore';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { NgClass, NgIf } from '@angular/common';

@Component({
  selector: 'app-sign-in',
  standalone: true,
  imports: [
    RouterLink,
    FormsModule,
    ReactiveFormsModule,
    NgIf,
    NgClass,
  ],
  templateUrl: './sign-in.component.html',
  styleUrl: './sign-in.component.scss'
})


export class SignInComponent {
  name: string = "";
  email: string = "";
  password: string = "";
  passwordConfirmed: string = "";
  checkboxChecked: boolean = false;
  signInForm: FormGroup;
  signedIn: boolean = false;

  constructor(
    private firestore: Firestore,
    private fb: FormBuilder,
    private router: Router,
  ) {
    this.signInForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      passwordConfirmed: ['', Validators.required],
      checkboxChecked: [false, Validators.requiredTrue]
    }, { validator: this.passwordMatchValidator });
  }

  // Checks if password and passwordConfirmed match
  passwordMatchValidator(formGroup: FormGroup) {
    const password = formGroup.get('password')?.value;
    const passwordConfirmed = formGroup.get('passwordConfirmed')?.value;
    return password === passwordConfirmed ? null : { mismatch: true };
  }

  // Adds the new created user to the firestore/firebase
  async addUser(): Promise<void> {
    if (this.signInForm.valid) {
      try {
        const formValue = this.signInForm.value;
        const docRef = await addDoc(collection(this.firestore, "user"), {
          name: this.name,
          email: this.email,
          password: this.password,
          passwordConfirmed: this.passwordConfirmed,
        });
        this.signedIn = true;
        setTimeout(() => {
          this.signedIn = false;
          this.router.navigate(['/log-in']);
        }, 3500)

      } catch (e) {
        console.error("Error adding document: ", e);

      }
    }
  }

}