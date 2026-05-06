import { inject } from '@angular/core';
import { CanDeactivateFn } from '@angular/router';

import { HasUnsavedChanges } from '../../shared/interfaces/has-unsaved-changes.interface';
import { PopupService } from '../../shared/services/popup.service';

export const preventUnsavedGuard: CanDeactivateFn<HasUnsavedChanges> = (component) => {
  const popupService = inject(PopupService);

  if (component.hasUnsavedChanges()) {
    return popupService.ask({
      title: 'Cambios sin guardar',
      message: 'Si sales ahora, perderás los cambios que has realizado. ¿Estás seguro?',
      confirmText: 'Salir sin guardar',
      cancelText: 'Seguir editando',
    });
  }

  return true;
};
