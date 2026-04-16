import { cpfDigits } from './cpf';

/** Formata dígitos de CPF enquanto o usuário digita: `000.000.000-00` (máx. 11 dígitos). */
export function maskCpfInput(value) {
  const d = cpfDigits(value).slice(0, 11);
  if (d.length <= 3) return d;
  if (d.length <= 6) return `${d.slice(0, 3)}.${d.slice(3)}`;
  if (d.length <= 9) return `${d.slice(0, 3)}.${d.slice(3, 6)}.${d.slice(6)}`;
  return `${d.slice(0, 3)}.${d.slice(3, 6)}.${d.slice(6, 9)}-${d.slice(9)}`;
}

/**
 * RG: mantém só caracteres plausíveis, maiúsculas, tamanho máximo alinhado ao backend.
 */
export function maskRgInput(value) {
  return String(value ?? '')
      .toUpperCase()
      .replace(/[^\p{L}0-9.\-\s]/gu, '')
      .slice(0, 32);
}
