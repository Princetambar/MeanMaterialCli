import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  isLoading = false;

  constructor(public authService: AuthService) {}

  ngOnInit() {}

  onLogin(loginForm: NgForm) {
    this.isLoading = true;
    if (loginForm.invalid) {
      this.isLoading = false;
      return;
    }
    this.authService.login(loginForm.value.email, loginForm.value.password);
  }
}
