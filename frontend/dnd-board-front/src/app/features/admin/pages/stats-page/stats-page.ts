import { Component, inject } from '@angular/core';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { faUsers, faChessBoard } from '@fortawesome/free-solid-svg-icons';

import { AdminService } from '../../shared/services/admin.service';
import { BoardsChart } from '../../components/boards-chart/boards-chart';

@Component({
  selector: 'app-stats-page',
  imports: [BoardsChart, FaIconComponent],
  templateUrl: './stats-page.html',
})
export class StatsPage {
  readonly stats = inject(AdminService).statsResource;
  readonly faUsers = faUsers;
  readonly faChessBoard = faChessBoard;
}
