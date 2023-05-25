import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit, OnDestroy {
  authForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
    repeatedPassword: [''],
  });
  isSignUpPage = false;
  private subscriptions = new Subscription();

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    const userId = localStorage.getItem('currentUser');
    if (userId) {
      this.router.navigate(['profile', userId]);
    }
  }

  submit(): void {
    this.authForm.markAllAsTouched();
    if (this.authForm.invalid) {
      return;
    }
    if (this.isSignUpPage) {
      this.subscriptions.add(
        this.authService
          .signUp(this.authForm.getRawValue())
          .subscribe((user) => {
            if (user && user['_id']) {
              this.isSignUpPage = false;
              this.resetForm();
            }
          })
      );
    } else {
      this.subscriptions.add(
        this.authService
          .logIn(this.authForm.getRawValue())
          .subscribe((user) => {
            if (user && user['_id']) {
              this.router.navigate([user['_id']], { relativeTo: this.route });
            }
          })
      );
    }
  }

  resetForm(): void {
    this.authForm.reset();
  }

  changePages(): void {
    this.authForm.reset();
    this.isSignUpPage = !this.isSignUpPage;
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
}
