import {Component, OnDestroy, OnInit} from '@angular/core';
import { AuthService } from '../../shared/services/auth.service';
import {Subject, takeUntil} from "rxjs";
import {AbstractControl, NonNullableFormBuilder, Validators} from "@angular/forms";
import {ActivatedRoute, Router} from "@angular/router";
import {HttpErrorResponse} from "@angular/common/http";
import {LoginRequest} from "../../shared/models/authentication/login-request";
import {UserService} from "../../shared/services/user.service";

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.scss'],
})

export class SignInComponent implements OnDestroy {
  title = 'Authentication'
  errorMessage = ''
  unsubsribe = new Subject<void>()

  readonly authForm = this.fb.group({
    email: ['', Validators.required],
    password: ['', [Validators.required]]
  })

  get emailController(): AbstractControl<string, string> | null {
    return this.authForm.get('email')
  }

  get passwordController(): AbstractControl<string, string> | null {
    return this.authForm.get('password')
  }

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private authenticationService: AuthService,
    private fb: NonNullableFormBuilder,
    private userService: UserService
  ) { }

  ngOnDestroy(): void {
    this.unsubsribe.next()
    this.unsubsribe.complete()
  }

  private errorHandler(errorResponse: HttpErrorResponse): void {
    this.errorMessage =  `${errorResponse.message}`
  }

  login(): void {
    console.log("login")
    this.authenticationService.SignIn(this.loginRequest)
      .pipe(takeUntil(this.unsubsribe))
      .subscribe({
        next: response => {
          response.user?.getIdToken().then(
            (res)=>{
              const userId = response.user?.uid;
              if (userId) {
                this.userService.getUserById(userId).pipe(takeUntil(this.unsubsribe)).subscribe(user => {
                  if (user) {
                    this.userService.setCurrentUser(user);
                  }
                });
              }
              this.authenticationService.token = res
              this.router.navigateByUrl('/')
            }
          )

         this.redirect()
        },
        error: errorResponse => {
          console.log(typeof errorResponse)
          this.errorHandler(errorResponse)
        }
      })
  }

  redirect(): void{
    setTimeout(()=>{ this.router.navigateByUrl('/') } , 1000)
  }


  get loginRequest(): LoginRequest {
    this.errorMessage = ''

    return new LoginRequest(this.emailController?.value ?? '', this.passwordController?.value ?? '')
  }
}
