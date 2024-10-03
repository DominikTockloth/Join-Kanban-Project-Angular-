import { Component, HostListener } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { SummaryComponent } from '../summary/summary.component';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-main-page',
  standalone: true,
  imports: [
    RouterLink,
    RouterLinkActive,
    RouterOutlet,
    SummaryComponent,
    NgIf

  ],
  templateUrl: './main-page.component.html',
  styleUrl: './main-page.component.scss'
})

export class MainPageComponent {
  constructor(private router: Router) { }
  isMenuOpen: boolean = false;
  guestLoggedIn: string = "";
  loggedInUser: string | null = null;

  // The loggedInUser gets loaded from local storage
  ngOnInit(): void {
    this.loggedInUser = localStorage.getItem('loggedInUser');
  }

  // This function is to extract the initals of the logged in user
  getInitials(name: string): string {
    if (!name) return '';
    const nameParts = name.split(' ');
    if (nameParts.length > 1) {
      return nameParts[0].charAt(0).toUpperCase() + nameParts[1].charAt(0).toUpperCase();
    } else {
      return name.charAt(0).toUpperCase();
    }
  }


  // Event Listener for clicking outside of menu
  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    const target = event.target as HTMLElement;
    // Checks, if clicked element is outside the menu
    if (!target.closest('.drop-menu') && !target.closest('.avatar')) {
      this.isMenuOpen = false; // Close menu
    }
  }

  // Function to open drop menu
  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }

  // This function handles the log out and clears the local storage
  logOut() {
    this.isMenuOpen = false;
    localStorage.clear();
    this.router.navigate(['log-in']);
  }

  toPrivacyPolicy() {
    this.isMenuOpen = false;
    this.router.navigate(['/main/privacy']);
  }

  toLegalNotice() {
    this.isMenuOpen = false;
    this.router.navigate(['/main/legal']);
  }
}
