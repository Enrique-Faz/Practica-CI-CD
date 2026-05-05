import { Component } from '@angular/core';

@Component({
  selector: 'app-footer',
  imports: [],
  template: `
    <footer class="bg-stone-900 border-t border-amber-900/40 text-stone-500 py-10">
      <div class="max-w-full mx-auto px-8">
        <div class="flex justify-center items-center mb-8">
          <div
            class="flex flex-col items-center gap-2 opacity-70 hover:opacity-100 transition-opacity"
          >
            <img
              src="logo.png"
              alt="Beers & Dragons"
              class="h-20 w-auto object-contain grayscale hover:grayscale-0 transition-all"
            />
            <p class="text-[10px] font-bold text-stone-500 tracking-[0.3em] uppercase">
              Virtual Board
            </p>
          </div>
        </div>

        <div class="pt-6 border-t border-stone-800 flex flex-col items-center gap-4 text-center">
          <p class="text-[10px] text-stone-600 max-w-2xl leading-relaxed">
            Dungeons & Dragons es una marca registrada de Wizards of the Coast LLC. Este proyecto es
            de uso educativo y no tiene fines comerciales.
          </p>
          <p class="text-xs font-bold text-stone-500">
            © 2026 Beers &amp; Dragons —
            <span class="text-amber-600 uppercase tracking-wider"
              >Enrique Faz Dionisio — Proyecto Intermodular DAW</span
            >
          </p>
        </div>
      </div>
    </footer>
  `,
})
export class Footer {}
