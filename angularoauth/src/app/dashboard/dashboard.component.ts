import { Component, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthGoogleService } from '../services/auth-google.service';
import { CommonModule } from '@angular/common';

const MODULES = [CommonModule];

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [MODULES],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent implements OnInit {
  private authService = inject(AuthGoogleService);
  private router = inject(Router);
  profile: { name: string; email: string } | null = null;

  ngOnInit(): void {
    this.authService.loginStatus$.subscribe((loggedIn) => {
      if (loggedIn) {
        this.showData();
        this.authService.saveUserData();
      }
    });
  }

  showData() {
    this.profile = this.authService.getProfile();
    console.log('User Name:', this.profile?.name);
    console.log('User Email:', this.profile?.email);
  }

  logOut() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
