import { Route } from '@angular/router';
import { TicTacToeComponent } from './components/tic-tac-toe/tic-tac-toe.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { GameBoardComponent } from './components/game-board/game-board.component';

export const appRoutes: Route[] = [
  {
    path: 'tic-tac-toe',
    component: TicTacToeComponent
  },
  {
    path: '',
    component: LoginComponent,
  },
  {
    path: 'register',
    component: RegisterComponent,
  },
  {
    path: 'board',
    component: GameBoardComponent,
  },
  {
    path: '**',
    redirectTo: '',
  },
];
