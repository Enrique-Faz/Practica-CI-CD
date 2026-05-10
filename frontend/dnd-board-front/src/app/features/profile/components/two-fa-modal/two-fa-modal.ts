import { Component, effect, inject, signal } from '@angular/core';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { faXmark } from '@fortawesome/free-solid-svg-icons';
import { httpResource } from '@angular/common/http';

import { environment } from '../../../../../environments/environment';
import { ModalService } from '../../../../shared/services/modal.service';

const API = environment.apiEndpoint;

@Component({
  selector: 'app-two-fa-modal',
  templateUrl: './two-fa-modal.html',
  imports: [FaIconComponent],
})
export class TwoFaModal {
  readonly #modalService = inject(ModalService);
  readonly faXmark = faXmark;

  readonly #activationData = signal<{ secret: string; code: string } | undefined>(undefined);

  readonly setupResource = httpResource<{ secret: string; qr_code_url: string }>(() => ({
    url: `${API}/2fa/generate`,
    method: 'POST',
  }));

  readonly activationResource = httpResource(() => {
    const data = this.#activationData();
    if (!data) return undefined;
    return { url: `${API}/2fa/enable`, method: 'POST', body: data };
  });

  constructor() {
    effect(() => {
      if (this.activationResource.hasValue()) {
        this.#modalService.close(true);
      }
      if (this.activationResource.error()) {
        this.#activationData.set(undefined);
      }
    });
  }

  confirm(code: string): void {
    const secret = this.setupResource.value()?.secret;
    if (secret && code.length === 6) {
      this.#activationData.set({ secret, code });
    }
  }

  dismiss(): void {
    this.#modalService.dismiss();
  }
}
