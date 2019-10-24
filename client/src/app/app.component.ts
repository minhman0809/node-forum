import { Component } from '@angular/core';

import { AuthService } from './core/services/auth/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  constructor(private authService: AuthService) {}

  isLoggedIn$ = this.authService.isLoggedIn;
  authUser$ = this.authService.authUser;

  logout() {
    this.authService.clear();
  }
}
