import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatButtonModule} from '@angular/material/button';
import {MatCardModule} from '@angular/material/card';
import {MatInputModule} from '@angular/material/input';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AppService } from '../../app.service';
import { catchError, of, tap } from 'rxjs';




@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatButtonModule, MatCardModule,MatFormFieldModule, MatInputModule],
  providers: [AppService],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  loginForm!: FormGroup;
  constructor(private router: Router, private fb: FormBuilder, private appService: AppService) {
    this.initForm();
  }
  goToRegister(): void {
    this.router.navigate(['/register']);
  }

  initForm() {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required]],
      password: ['', [Validators.required]]
    })
  }

  onLoginSubmit() {
    this.appService.signInUser(this.loginForm.value).pipe(
      tap(() => {
        if(this.appService.userData) {
          this.appService.openSnackBar('Successfully loggedIn..');
          this.router.navigate(['/tic-tac-toe']);
        } 
      }),
      catchError((e) => {
         if(e) {
          this.appService.openSnackBar(e?.message ?? '');
        }
        return of()
      })
    ).subscribe();
  }
  
}
