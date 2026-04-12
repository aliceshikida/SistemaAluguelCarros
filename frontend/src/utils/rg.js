/**
 * RG brasileiro — não há dígito verificador único nacional; valida formato plausível.
 * Vazio é aceito (campo opcional no cadastro).
 */
export const RG_INVALIDO_MSG =
  'RG inválido. Use o formato do seu estado (ex.: MG-12.345.678), só letras, números, pontos e hífen.';

/**
 * @param {string} value
 * @returns {boolean}
 */
export function isValidRg(value) {
  const s = String(value ?? '').trim();
  if (!s.length) return true;

  if (s.length < 5 || s.length > 32) return false;
  // Caracteres usuais em RG (UF opcional, separadores)
  if (!/^[\p{L}0-9.\-\s]+$/u.test(s)) return false;

  const digits = s.replace(/\D/g, '');
  if (digits.length < 5 || digits.length > 14) return false;

  return true;
}
