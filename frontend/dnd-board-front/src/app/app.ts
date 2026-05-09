import { Component, inject } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { filter, map } from 'rxjs';

import { ConfirmPopup } from './shared/components/confirm-popup/confirm-popup';
import { Footer } from './shared/components/footer/footer';
import { Header } from './shared/components/header/header';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Header, Footer, ConfirmPopup],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  readonly #router = inject(Router);
  readonly #route = inject(ActivatedRoute);

  readonly hideFooter = toSignal(
    this.#router.events.pipe(
      filter((e) => e instanceof NavigationEnd),
      map(() => {
        let route = this.#route;
        while (route.firstChild) route = route.firstChild;
        return !!route.snapshot.data['hideFooter'];
      }),
    ),
    { initialValue: false },
  );
}
