/** Regra: uma palavra — só letras e números (acentos permitidos), sem espaços nem símbolos. */
export const LOGIN_INVALIDO_MSG =
  'O login deve ser uma única palavra: apenas letras e números, sem espaços e sem caracteres especiais.';

/**
 * @param {string} value
 * @returns {boolean}
 */
export function isValidLoginId(value) {
  const s = String(value ?? '').trim();
  if (!s.length) return false;
  return /^[\p{L}0-9]+$/u.test(s);
}
