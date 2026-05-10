module.exports = {
  extends: ["@commitlint/config-conventional"],
  rules: {
    // Tipos permitidos
    "type-enum": [
      2,
      "always",
      [
        "feat", // Nueva funcionalidad
        "fix", // Corrección de bug
        "docs", // Solo documentación
        "style", // Formato, espacios, comas (sin cambio de lógica)
        "refactor", // Refactorización sin bug ni feature
        "test", // Añadir o corregir tests
        "chore", // Tareas de mantenimiento (deps, config, CI)
        "perf", // Mejora de rendimiento
        "revert", // Revertir un commit anterior
      ],
    ],
    // El asunto no puede terminar en punto
    "subject-full-stop": [2, "never", "."],
    // Longitud máxima de la cabecera
    "header-max-length": [2, "always", 100],
    // El tipo va siempre en minúsculas
    "type-case": [2, "always", "lower-case"],
    // El scope (opcional) va en minúsculas
    "scope-case": [2, "always", "lower-case"],
  },
};
