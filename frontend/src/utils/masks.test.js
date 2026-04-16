import { describe, expect, it } from 'vitest';
import { maskCpfInput, maskRgInput } from './masks';

describe('masks', () => {
  it('maskCpfInput formata até 11 dígitos', () => {
    expect(maskCpfInput('12345678909')).toBe('123.456.789-09');
    expect(maskCpfInput('123456')).toBe('123.456');
  });

  it('maskCpfInput ignora letras e limita tamanho', () => {
    expect(maskCpfInput('123.456.789-09abc')).toBe('123.456.789-09');
  });

  it('maskRgInput remove caracteres inválidos e limita tamanho', () => {
    expect(maskRgInput('mg-12.345.678')).toBe('MG-12.345.678');
    expect(maskRgInput('AB@CD')).toBe('ABCD');
  });
});
