import { Component, inject } from '@angular/core';

import { PopupService } from '../../services/popup.service';

@Component({
  selector: 'app-confirm-popup',
  imports: [],
  template: `
    @if (popupService.isOpen()) {
      <div
        class="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-stone-950/70 backdrop-blur-md transition-all duration-300"
      >
        <div
          class="w-full max-w-sm bg-stone-900 border border-amber-900/40 p-8 rounded-2xl shadow-2xl shadow-black/50"
        >
          <div class="text-center mb-8">
            <h3 class="text-2xl font-black text-amber-400 tracking-wider uppercase">
              {{ popupService.data()?.title }}
            </h3>
            <p class="text-sm text-stone-400 mt-3 font-medium leading-relaxed">
              {{ popupService.data()?.message }}
            </p>
          </div>

          <div class="grid grid-cols-2 gap-4">
            <button
              (click)="popupService.close(false)"
              class="w-full py-3 bg-stone-800 border border-stone-700 text-stone-300 hover:bg-stone-700 hover:text-stone-100 font-bold rounded-lg transition-all uppercase tracking-widest text-xs"
            >
              {{ popupService.data()?.cancelText || 'Cancelar' }}
            </button>

            <button
              (click)="popupService.close(true)"
              class="w-full py-3 bg-amber-600 hover:bg-amber-500 text-stone-900 font-black rounded-lg shadow-lg shadow-amber-900/30 transition-all uppercase tracking-wide text-xs active:scale-95"
            >
              {{ popupService.data()?.confirmText || 'Confirmar' }}
            </button>
          </div>
        </div>
      </div>
    }
  `,
})
export class ConfirmPopup {
  protected popupService = inject(PopupService);
}
