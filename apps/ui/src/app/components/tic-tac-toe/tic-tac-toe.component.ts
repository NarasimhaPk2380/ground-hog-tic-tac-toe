import { ChangeDetectorRef, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { io } from "socket.io-client";
import { AppService } from '../../app.service';
import {MatButtonModule} from '@angular/material/button';
import {MatCardModule} from '@angular/material/card';
import { MatListModule} from '@angular/material/list';
import { AppPipe } from '../../app.pipe';
import { catchError, of, tap } from 'rxjs';
import { GameResultI, Player } from '../../models/tic-tac-toe.model';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';
const socket = io('http://localhost:3000');

const winningLines = [
  [0,5,6,7],
  [1,6,7,8],
  [2,7,8,9],
  [5,10,11,12],
  [6, 11, 12,13],
  [7, 12, 13,14],
  [10, 15, 16,17],
  [11, 16, 17,18],
  [12, 17, 18,19],
  [15, 20, 21,22],
  [16, 21, 22,23],
  [17, 22, 23,24],
]

const boardInitialData = {
  "1": [0,1,2,3,4].map((value: number) => ({value, label: ''})),
  "2": [5,6,7,8,9].map((value: number) => ({value, label: ''})),
  "3": [10,11,12,13,14].map((value: number) => ({value, label: ''})),
  "4": [15,16,17,18,19].map((value: number) => ({value, label: ''})),
  "5": [20,21,22,23,24].map((value: number) => ({value, label: ''}))
};

@Component({
  selector: 'app-tic-tac-toe',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatListModule, MatButtonModule,MatIconModule, AppPipe],
  providers: [AppService],
  templateUrl: './tic-tac-toe.component.html',
  styleUrl: './tic-tac-toe.component.scss',
})
export class TicTacToeComponent {
  isGameStarted = false;
  playerAccepted:Player | null = null;
  currentPlayer:Player | null = null;
  onlinePlayers: Player[] = [];
  userId: string | null = null;
  ticToeRows!: { [x: string]: any[]}

  constructor(private appService: AppService, private cdr: ChangeDetectorRef, private router: Router) {
    this.userId = this.appService.getUserId();
    socket.on("connect", () => {
      console.log(socket.id);
      socket.emit("game_start", this.appService.getUserInfo());
      
      socket.emit("request_clients_online");
      
      socket.on("clients_online", (data) => {
        this.onlinePlayers = Object.values(data);
        this.currentPlayer = this.onlinePlayers?.find((o: any) => o?.accept && o?._id === this.appService.getUserId()) ?? null;
        this.playerAccepted = this.onlinePlayers?.find((o: any) => o?.accept && o?._id !== this.appService.getUserId()) ?? null;
        this.cdr.detectChanges();
        if(this.currentPlayer && this.onlinePlayers && !this.isGameStarted) {
          socket.emit("game_started", boardInitialData);
        }
        console.log(this.onlinePlayers);
      });

      socket.on("game_board_data", (data) => {
        this.ticToeRows = data;
        this.cdr.detectChanges();
      });

      socket.on("currentTurn", (data: Player) => {
        (this.currentPlayer as Player).urTurn = data?.symbol !== this.currentPlayer?.symbol;
        (this.playerAccepted as Player).urTurn = !this.currentPlayer?.urTurn;
        this.cdr.detectChanges();
      });

      socket.on("close_the_game", () => {
        socket.emit('reset_the_game',this.appService.getUserInfo())
      });

    });
  }

  goToBoard() {
    this.router.navigate(['/board'])
  }

  onSendPlayRequest(player: Player) {
    if(player?.sent) {
      socket.emit("send_play_request_accepted", {
        fromId: this.appService.getUserId(),
        toId: player?._id
      });
    } else {
      socket.emit("send_play_request", {
        fromId: this.appService.getUserId(),
        toId: player?._id
      });
    }
   
  }

  onSquareClick(data: { value: number, label: string}) {
    data.label = this.currentPlayer?.symbol ?? '';
    socket.emit('updateTurn', { symbol: this.currentPlayer?.symbol });
    const winner = this.checkIfPlayerIsWinner();
    socket.emit("game_started", this.ticToeRows);
    if(winner?.isDone && winner?.player) {
      const winnerId = this.currentPlayer?.symbol === winner.player ? this.currentPlayer?._id : this.playerAccepted?._id;
      const data: GameResultI = { player_1: this.currentPlayer?._id ?? '', player_2: this.playerAccepted?._id ?? '', winnerId: winnerId ?? '', isDraw: false };
      socket.emit("game_result", data);
      this.updateUser(data);
      alert(`${winner?.player} Won`)
    } else if(winner?.isDone && winner?.status === 'DRAW') {
      const data: GameResultI = { player_1: this.currentPlayer?._id ?? '', player_2: this.playerAccepted?._id ?? '', isDraw: true };
      socket.emit("game_result", data);
      this.updateUser(data);
      alert(`ITS DRAWN`);
    }
  }

  checkIfPlayerIsWinner() {
    const allSquares = Object.values(this.ticToeRows).flat()?.reduce((acc, cv) => {
            if(cv.label && !acc[cv.label]){
              acc[cv.label] = [cv.value]
            } else if(cv.label && acc[cv.label]) {
              acc[cv.label].push(cv.value)
            }
            return acc;
    },{});
    const playerXValues = allSquares['X'];
    const playerOValues = allSquares['O'];
    for(const winnerLine of winningLines) {
       if(winnerLine.every(w => playerXValues?.includes(w))) {
         return { player: 'X', isDone: true }
       } else if(winnerLine.every(w => playerOValues?.includes(w))) {
         return { player: 'O', isDone: true }
       }
    }
    console.log(allSquares);
    if((playerXValues?.length + playerOValues?.length) === 25) {
      return { isDone: true, status: 'DRAW' }
    } else {
      return { isDone: false, status: 'NOT COMPLETED' }
    }
  }

  updateUser(data: GameResultI) {
    this.appService.updateUser(data).pipe(
      tap(() => {
          this.appService.openSnackBar('Users updated with the scores');
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
