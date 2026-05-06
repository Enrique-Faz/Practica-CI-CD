import { Injectable, signal } from '@angular/core';
import { Observable, Subject } from 'rxjs';

import { PopupData } from '../interfaces/popup-data.interface';

@Injectable({
  providedIn: 'root',
})
export class PopupService {
  isOpen = signal(false);
  data = signal<PopupData | null>(null);

  #result$ = new Subject<boolean>();

  ask(popupData: PopupData): Observable<boolean> {
    this.data.set(popupData);
    this.isOpen.set(true);
    this.#result$ = new Subject<boolean>();
    return this.#result$.asObservable();
  }

  close(response: boolean): void {
    this.isOpen.set(false);
    this.#result$.next(response);
    this.#result$.complete();
  }
}
