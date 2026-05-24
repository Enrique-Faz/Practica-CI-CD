import { TestBed } from '@angular/core/testing';
import { describe, expect, it, beforeEach } from 'vitest';
import { ModalService } from './modal.service';

describe('ModalService', () => {
  let service: ModalService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ModalService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should set activeModal signal when open is called', () => {
    expect(service.activeModal()).toBeNull();

    service.open('character-form');

    expect(service.activeModal()).toBe('character-form');
  });

  it('should set modalData signal when open is called with data', () => {
    const testData = { characterId: 5, name: 'Gandalf' };

    service.open('edit-modal', testData);

    expect(service.modalData()).toEqual(testData);
  });

  it('should reset activeModal and modalData when close is called', () => {
    service.open('my-modal', { some: 'data' });

    service.close('result-value');

    expect(service.activeModal()).toBeNull();
    expect(service.modalData()).toBeNull();
  });

  it('should emit the result through the observable when close is called', () => {
    let emittedResult: unknown;

    service.open<string>('confirm-modal').subscribe((result) => {
      emittedResult = result;
    });

    service.close('confirmed');

    expect(emittedResult).toBe('confirmed');
  });

  it('should reset state when dismiss is called without emitting a result', () => {
    let emitted = false;

    service.open('my-modal').subscribe(() => {
      emitted = true;
    });

    service.dismiss();

    expect(service.activeModal()).toBeNull();
    expect(service.modalData()).toBeNull();
    expect(emitted).toBe(false);
  });
});
