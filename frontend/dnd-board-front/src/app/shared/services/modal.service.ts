import { Injectable, signal } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { take } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class ModalService {
  activeModal = signal<string | null>(null);
  modalData = signal<unknown>(null);

  #result$ = new Subject<unknown>();

  open<T = unknown, D = unknown>(modalId: string, data?: D): Observable<T> {
    this.activeModal.set(modalId);
    this.modalData.set((data ?? null) as unknown);
    this.#result$ = new Subject<unknown>();
    return (this.#result$ as Subject<T>).asObservable().pipe(take(1));
  }

  close(result?: unknown): void {
    this.activeModal.set(null);
    this.modalData.set(null);
    this.#result$.next(result);
    this.#result$.complete();
  }

  dismiss(): void {
    this.activeModal.set(null);
    this.modalData.set(null);
    this.#result$.complete();
  }
}
