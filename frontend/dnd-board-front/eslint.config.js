// @ts-check
const eslint = require('@eslint/js');
const { defineConfig } = require('eslint/config');
const tseslint = require('typescript-eslint');
const angular = require('angular-eslint');

module.exports = defineConfig([
  {
    files: ['**/*.ts'],
    extends: [
      eslint.configs.recommended,
      tseslint.configs.recommended,
      tseslint.configs.stylistic,
      angular.configs.tsRecommended,
    ],
    processor: angular.processInlineTemplates,
    rules: {
      '@angular-eslint/directive-selector': [
        'error',
        { type: 'attribute', prefix: 'app', style: 'camelCase' },
      ],
      '@angular-eslint/component-selector': [
        'error',
        { type: 'element', prefix: 'app', style: 'kebab-case' },
      ],
      // Los outputs con prefijo 'on' son un patrón extendido en este proyecto.
      // Renombrarlos requeriría refactorizar todos los templates. Se trata como aviso.
      '@angular-eslint/no-output-on-prefix': 'warn',
      // Los effects de Angular deben almacenarse como miembro de clase aunque no se
      // lean directamente; de lo contrario el GC los eliminaría.
      'no-unused-private-class-members': 'off',
      // Expresiones como `this.signal();` dentro de httpResource factories son el
      // mecanismo de Angular para registrar dependencias reactivas. No son bugs.
      '@typescript-eslint/no-unused-expressions': 'off',
    },
  },
  {
    files: ['**/*.html'],
    extends: [angular.configs.templateRecommended, angular.configs.templateAccessibility],
    rules: {
      // El grid del tablero es un canvas de juego con interacción por ratón;
      // los eventos de teclado y foco no aplican a esta interfaz de juego.
      '@angular-eslint/template/click-events-have-key-events': 'off',
      '@angular-eslint/template/interactive-supports-focus': 'off',
      // Las etiquetas de los mini-paneles del juego son puramente decorativas;
      // se trata como aviso para no bloquear el lint en paneles de control táctil.
      '@angular-eslint/template/label-has-associated-control': 'warn',
    },
  },
]);
