import { describe, expect, it } from 'vitest';
import { convertKeysToSnakeCase, toSnakeCase } from './case-converter.utils';

describe('toSnakeCase', () => {
  it('should convert camelCase to snake_case', () => {
    expect(toSnakeCase('firstName')).toBe('first_name');
    expect(toSnakeCase('backgroundColor')).toBe('background_color');
    expect(toSnakeCase('currentTurnIndex')).toBe('current_turn_index');
  });

  it('should return the same string if already lowercase', () => {
    expect(toSnakeCase('name')).toBe('name');
    expect(toSnakeCase('email')).toBe('email');
  });
});

describe('convertKeysToSnakeCase', () => {
  it('should convert all keys of a flat object to snake_case', () => {
    const input = { firstName: 'Ana', lastName: 'López', userEmail: 'ana@test.com' };
    const result = convertKeysToSnakeCase(input) as Record<string, unknown>;

    expect(result).toEqual({
      first_name: 'Ana',
      last_name: 'López',
      user_email: 'ana@test.com',
    });
  });

  it('should recursively convert keys in nested objects', () => {
    const input = {
      boardName: 'Mi Campaña',
      dmInfo: { firstName: 'Carlos', joinCode: 'ABC123' },
    };
    const result = convertKeysToSnakeCase(input) as Record<string, unknown>;

    expect(result).toEqual({
      board_name: 'Mi Campaña',
      dm_info: { first_name: 'Carlos', join_code: 'ABC123' },
    });
  });

  it('should handle arrays with nested objects', () => {
    const input = [{ characterName: 'Gandalf' }, { characterName: 'Aragorn' }];
    const result = convertKeysToSnakeCase(input);

    expect(result).toEqual([{ character_name: 'Gandalf' }, { character_name: 'Aragorn' }]);
  });

  it('should return primitives unchanged', () => {
    expect(convertKeysToSnakeCase(null)).toBeNull();
    expect(convertKeysToSnakeCase('hello')).toBe('hello');
    expect(convertKeysToSnakeCase(42)).toBe(42);
  });
});
