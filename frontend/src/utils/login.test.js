import { describe, expect, it } from 'vitest';
import { isValidLoginId, LOGIN_INVALIDO_MSG } from './login';

describe('login', () => {
  it('isValidLoginId aceita palavra alfanumérica', () => {
    expect(isValidLoginId('maria123')).toBe(true);
    expect(isValidLoginId('josé')).toBe(true);
  });

  it('isValidLoginId rejeita espaços e símbolos', () => {
    expect(isValidLoginId('a b')).toBe(false);
    expect(isValidLoginId('a@b')).toBe(false);
  });

  it('LOGIN_INVALIDO_MSG existe', () => {
    expect(LOGIN_INVALIDO_MSG).toContain('login');
  });
});
