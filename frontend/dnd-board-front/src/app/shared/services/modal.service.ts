import { Injectable, signal } from '@angular/core';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ModalService {
  activeModal = signal<string | null>(null);
  modalData = signal<unknown>(null);

  #result$ = new Subject<unknown>();

  open<T = unknown>(modalId: string, data?: unknown): Observable<T> {
    this.activeModal.set(modalId);
    this.modalData.set(data ?? null);
    this.#result$ = new Subject<unknown>();
    return this.#result$.asObservable() as Observable<T>;
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
