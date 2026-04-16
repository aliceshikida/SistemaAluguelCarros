import { describe, expect, it } from 'vitest';
import { cpfDigits, isValidCpf } from './cpf';

describe('cpf', () => {
  it('cpfDigits remove não dígitos', () => {
    expect(cpfDigits('123.456.789-09')).toBe('12345678909');
  });

  it('isValidCpf valida CPF conhecido', () => {
    expect(isValidCpf('12345678909')).toBe(true);
  });

  it('isValidCpf rejeita sequência repetida', () => {
    expect(isValidCpf('11111111111')).toBe(false);
  });
});
