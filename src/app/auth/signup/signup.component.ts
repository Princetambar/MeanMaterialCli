import { Component, OnInit, OnDestroy } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Subscription } from 'rxjs';
import { MatDialog } from '@angular/material';

import { AuthService } from '../auth.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit, OnDestroy {
  isLoading = false;
  private authStatusSub: Subscription;

  constructor(public authService: AuthService, private matDialog: MatDialog) {}

  ngOnInit() {
    this.authStatusSub = this.authService
      .getAuthStatusListener()
      .subscribe(authStatus => {
        this.isLoading = false;
      });
  }

  onSignup(signupForm: NgForm) {
    this.isLoading = true;
    if (signupForm.invalid) {
      this.isLoading = false;
      return;
    }
    this.authService.createUser(signupForm.value.emailId, signupForm.value.pwd);
  }

  ngOnDestroy() {
    this.authStatusSub.unsubscribe();
  }
}
