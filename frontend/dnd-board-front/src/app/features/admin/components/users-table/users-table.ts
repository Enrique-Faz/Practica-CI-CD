import { Component, input, output } from '@angular/core';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';

import { AdminUser } from '../../shared/interfaces/admin-stats.interface';

@Component({
  selector: 'app-users-table',
  imports: [FaIconComponent],
  templateUrl: './users-table.html',
})
export class UsersTable {
  users = input.required<AdminUser[]>();
  delete = output<{ id: number; name: string }>();

  readonly faTrash = faTrash;
}
