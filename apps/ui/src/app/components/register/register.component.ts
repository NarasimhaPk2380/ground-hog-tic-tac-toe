import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatButtonModule} from '@angular/material/button';
import {MatCardModule} from '@angular/material/card';
import {MatInputModule} from '@angular/material/input';
import {MatSnackBarModule} from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AppService } from '../../app.service';
import { catchError, of, tap } from 'rxjs';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule,MatSnackBarModule, MatButtonModule, MatCardModule,MatFormFieldModule, MatInputModule],
  providers: [AppService],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss',
})
export class RegisterComponent {
  registerForm!: FormGroup;
  constructor(private router: Router, private fb: FormBuilder, private appService: AppService) {
    this.initForm();
  }
  goToLogin(): void {
    this.router.navigate(['/']);
  }

  initForm() {
    this.registerForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      userName: ['', [Validators.required]],
      password: ['', [Validators.required]]
    })
  }

  onRegisterSubmit() {
    this.appService.createUser(this.registerForm.value).pipe(
      tap(() => {
          this.appService.openSnackBar('User has been created, Please login');
          this.router.navigate(['/']); 
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
