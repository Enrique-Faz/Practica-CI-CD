import { Injectable } from '@angular/core';
import { httpResource } from '@angular/common/http';

import { environment } from '../../../../../environments/environment';
import { User } from '../../../auth/shared/interfaces/user.interface';

const API = environment.apiEndpoint;

@Injectable({ providedIn: 'root' })
export class ProfileService {
  readonly userProfile = httpResource<User>(() => ({ url: `${API}/user` }));
}
