import { Pipe, PipeTransform } from '@angular/core';
import { Player } from './models/tic-tac-toe.model';

@Pipe({
    name: 'availablePlayers',
    standalone: true,
})
export class AppPipe implements PipeTransform {
  transform(players: Player[], currentUserId: string | null): any[] {
    return players.filter(p => p?._id !== currentUserId);
  }
}