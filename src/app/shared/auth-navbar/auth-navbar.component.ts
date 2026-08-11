import { Component } from '@angular/core';
import { AuthenticationService } from './../../_services';

@Component({ selector: 'app-auth-navbar', templateUrl: 'auth-navbar.component.html' })
export class AuthNavbarComponent {
    currentUser;
    constructor(private authService$: AuthenticationService) {
        this.currentUser = this.authService$.currentUserValue;
    }

    onSignOut() {
        this.authService$.logout(); 
    }
}
