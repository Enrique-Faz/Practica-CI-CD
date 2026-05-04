export function toSnakeCase(str: string): string {
  return str.replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`);
}

export function convertKeysToSnakeCase(obj: unknown): unknown {
  if (typeof obj !== 'object' || obj === null) {
    return obj;
  }

  if (Array.isArray(obj)) {
    return obj.map((item) => convertKeysToSnakeCase(item));
  }

  const newObj: Record<string, unknown> = {};

  Object.keys(obj as Record<string, unknown>).forEach((key) => {
    const newKey = toSnakeCase(key);
    newObj[newKey] = convertKeysToSnakeCase((obj as Record<string, unknown>)[key]);
  });

  return newObj;
}
