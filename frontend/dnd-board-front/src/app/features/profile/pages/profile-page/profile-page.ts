import { Component, inject } from '@angular/core';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { faShield, faCircleCheck } from '@fortawesome/free-solid-svg-icons';

import { AuthService } from '../../../auth/shared/services/auth.service';
import { ProfileService } from '../../shared/services/profile.service';
import { ModalService } from '../../../../shared/services/modal.service';
import { TwoFaModal } from '../../components/two-fa-modal/two-fa-modal';

@Component({
  selector: 'app-profile-page',
  templateUrl: './profile-page.html',
  imports: [FaIconComponent, TwoFaModal],
})
export class ProfilePage {
  readonly #profileService = inject(ProfileService);
  readonly #authService = inject(AuthService);
  readonly #modalService = inject(ModalService);

  readonly userProfile = this.#profileService.userProfile;
  readonly activeModal = this.#modalService.activeModal;

  readonly faShield = faShield;
  readonly faCircleCheck = faCircleCheck;

  prepare2fa(): void {
    this.#modalService.open('2fa').subscribe((activated) => {
      if (activated) {
        this.#profileService.userProfile.reload();
        this.#authService.refreshCurrentUser();
      }
    });
  }
}
