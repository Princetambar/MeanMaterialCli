import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';

import { AuthService } from '../auth.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {
  isLoading = false;

  constructor(public authService: AuthService) {}

  ngOnInit() {}

  onSignup(signupForm: NgForm) {
    this.isLoading = true;
    if (signupForm.invalid) {
      this.isLoading = false;
      return;
    }
    this.authService.createUser(signupForm.value.emailId, signupForm.value.pwd);
  }
}
