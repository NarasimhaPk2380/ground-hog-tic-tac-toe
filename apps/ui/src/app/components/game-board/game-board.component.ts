import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

import {MatTableModule} from '@angular/material/table';
import { AppService } from '../../app.service';
import { catchError, of, tap } from 'rxjs';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-game-board',
  standalone: true,
  imports: [CommonModule,MatButtonModule, MatTableModule],
  templateUrl: './game-board.component.html',
  styleUrl: './game-board.component.scss',
})
export class GameBoardComponent {
  displayedColumns: string[] = ['userName', 'email', 'noOfGamesPlayed', 'noOfGamesWins','noOfGamesLost'];
  dataSource = [];

  constructor(private appService: AppService) {
    this.getUsers();
  }

  goToGame() {
    window.location.href = "/tic-tac-toe";
  }
  getUsers() {
    this.appService.getUsers().pipe(
      tap((data: any) => {
        this.dataSource = data?.users;
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
