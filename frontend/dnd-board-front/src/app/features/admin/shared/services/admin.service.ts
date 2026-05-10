import { Injectable, signal } from '@angular/core';
import { HttpResourceRef, httpResource } from '@angular/common/http';
import { WritableSignal } from '@angular/core';

import { environment } from '../../../../../environments/environment';
import { AdminStats, AdminUser, AdminBoard } from '../interfaces/admin-stats.interface';

const API = environment.apiEndpoint;

@Injectable({ providedIn: 'root' })
export class AdminService {
  readonly statsResource = httpResource<AdminStats>(() => `${API}/admin/stats`);

  loadUsers(): HttpResourceRef<{ data: AdminUser[] } | undefined> {
    return httpResource<{ data: AdminUser[] } | undefined>(() => `${API}/admin/users`);
  }

  loadBoards(): HttpResourceRef<{ data: AdminBoard[] } | undefined> {
    return httpResource<{ data: AdminBoard[] } | undefined>(() => `${API}/admin/boards`);
  }

  deleteUser(idSignal: WritableSignal<number | undefined>): HttpResourceRef<unknown> {
    return httpResource(() => {
      const id = idSignal();
      if (!id) return undefined;
      return { url: `${API}/admin/users/${id}`, method: 'DELETE' };
    });
  }

  deleteBoard(idSignal: WritableSignal<number | undefined>): HttpResourceRef<unknown> {
    return httpResource(() => {
      const id = idSignal();
      if (!id) return undefined;
      return { url: `${API}/admin/boards/${id}`, method: 'DELETE' };
    });
  }
}
