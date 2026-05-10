import { Component, input, output } from '@angular/core';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';

import { AdminBoard } from '../../shared/interfaces/admin-stats.interface';

@Component({
  selector: 'app-boards-table',
  imports: [FaIconComponent],
  templateUrl: './boards-table.html',
})
export class BoardsTable {
  boards = input.required<AdminBoard[]>();
  delete = output<{ id: number; name: string }>();

  readonly faTrash = faTrash;
}
