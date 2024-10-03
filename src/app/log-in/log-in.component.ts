import { Component, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { UserService } from '../user.service';
import { FormsModule } from '@angular/forms';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-log-in',
  standalone: true,
  imports: [
    RouterLink,
    FormsModule,
    NgIf
  ],
  templateUrl: './log-in.component.html',
  styleUrl: './log-in.component.scss'
})

export class LogInComponent implements OnInit {
  email: string = "";
  password: string = "";
  userNotExistError: string = "";
  emailError: string = '';
  passwordError: string = '';
  isPageLoaded: boolean = false;

  constructor(private userservice: UserService, private router: Router) { }

  // By loading page, information of users get initialized
  async ngOnInit(): Promise<void> {
    await this.userservice.getAllUsers();
    setTimeout(() => {
      this.isPageLoaded = true;
    }, 600);
  }

  // Handles user logIn
  async logIn(): Promise<void> {
    this.userNotExistError = '';
    this.emailError = '';
    this.passwordError = '';

    if (this.email && this.password) {
      // Checks if email exists
      const userByEmail = await this.userservice.checkUserByEmail(this.email);
      if (userByEmail) {
        // If email exists, checking for password
        const userExists = await this.userservice.checkUserCredentials(this.email, this.password);
        // If user exists, navigation to summary html 
        if (userExists) {
          localStorage.clear(); 
          localStorage.setItem('loggedInUser', userByEmail.name);
          this.router.navigate(['/main/summary']);
        }
        // Else, error messages occur
        else {
          this.passwordError = 'Incorrect password.';
        }
      } else {
        this.emailError = 'Email does not exist.';
      }
    } else {
      if (!this.email) {
        this.emailError = 'Please enter your email.';
      }
      if (!this.password) {
        this.passwordError = 'Please enter your password.';
      }
    }
  }

  // This function handles the guest log in
  guestLogIn(guest: string) {
    if (guest) {
      localStorage.clear(); 
      localStorage.setItem('guestLoggedIn', guest);
      this.router.navigate(['/main/summary']);
    }
  }
}



