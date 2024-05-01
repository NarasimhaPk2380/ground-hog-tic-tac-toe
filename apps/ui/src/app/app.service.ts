import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Observable, catchError, tap, throwError } from 'rxjs';
import { GameResultI, SignedUserI } from './models/tic-tac-toe.model';

const API_URL = 'http://localhost:3000/api/users';

@Injectable()
export class AppService {
  userData!: SignedUserI;
  constructor(
    private http: HttpClient,
    public snackBar: MatSnackBar
  ) {}

  createUser(userData: any): Observable<any> {
    return this.http
      .post(`${API_URL}/register`, userData)
      .pipe(
        catchError(this.handleError)
      );
  }

  signInUser(userData: any): Observable<SignedUserI> {
    return this.http
      .post<SignedUserI>(`${API_URL}/signin`, userData)
      .pipe(tap((data) => {
        this.userData = data;
        localStorage.setItem('userInfo', JSON.stringify(this.userData));
      }),catchError(this.handleError));
  }

  updateUser(winnerData: GameResultI) {
    return this.http
      .post(`${API_URL}/updateUser`, winnerData)
      .pipe(catchError(this.handleError));
  }

  getUsers() {
    return this.http
      .get(`${API_URL}`)
      .pipe(catchError(this.handleError));
  }

  private handleError(error: HttpErrorResponse) {
    return throwError(
      () =>
        new Error(
          error?.error?.message ?? 'Something bad happened; please try again later.'
        )
    );
  }

  openSnackBar(message: string) {
    this.snackBar.open(message, '', {
      duration: 500,
    });
  }

  checkUserLoggedIn() {
    const user = JSON.parse(localStorage.getItem('userInfo') ?? '{}');
    return user ? true: false;
  }

  getUserInfo() {
    const user = JSON.parse(localStorage.getItem('userInfo') ?? '{}');
    return user?.userData ?? {}; 
  }
  getUserId() {
    const user = JSON.parse(localStorage.getItem('userInfo') ?? '{}');
    return user?.userData?._id ?? ''; 
  }

  getUserToken() {
    const user = JSON.parse(localStorage.getItem('userInfo') ?? '{}');
    return user?.token ?? ''; 
  }
}
