import {Component, OnDestroy, OnInit} from '@angular/core';
import { AuthService } from '../../shared/services/auth.service';
import { Subject, takeUntil } from 'rxjs';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import {FormGroup, FormBuilder, Validators, NonNullableFormBuilder, AbstractControl} from '@angular/forms';
import {LoginRequest} from "../../shared/models/authentication/login-request";
import {SignUpRequest} from "../../shared/models/authentication/sign-up-request";

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.scss'],
})
export class SignUpComponent implements OnDestroy {
  errorMessage = '';
  unsubsribe = new Subject<void>();

  readonly signUpForm = this.fb.group({
    pseudo: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required],
    sex: ['', Validators.required],
  });

  get pseudoController(): AbstractControl<string, string> | null {
    return this.signUpForm.get('pseudo')
  }
  get emailController(): AbstractControl<string, string> | null {
    return this.signUpForm.get('email')
  }

  get passwordController(): AbstractControl<string, string> | null {
    return this.signUpForm.get('password')
  }

  get genreController(): AbstractControl<string, string> | null {
    return this.signUpForm.get('sex')
  }

  constructor(
    public authService: AuthService,
    private router: Router,
    private fb: NonNullableFormBuilder,
  ) {}

  private errorHandler(errorResponse: HttpErrorResponse): void {
    this.errorMessage = `${errorResponse.message}`;
  }

  ngOnDestroy(): void {
    this.unsubsribe.next()
    this.unsubsribe.complete()
  }


  signUp(): void {
    if (this.signUpForm.invalid) {
      return;
    }

    this.authService
      .SignUp(this.signUpRequest).then((user)=>console.log(user))
  }

  get signUpRequest(): SignUpRequest {
    this.errorMessage = ''
    return new SignUpRequest(this.pseudoController?.value ?? '',this.emailController?.value ?? '', this.passwordController?.value ?? '', this.genreController?.value ?? '')
  }

}
