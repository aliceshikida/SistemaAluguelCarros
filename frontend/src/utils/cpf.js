/** Remove não dígitos */
export function cpfDigits(value) {
  return String(value ?? '').replace(/\D/g, '');
}

/**
 * Valida CPF brasileiro (11 dígitos, dígitos verificadores).
 * @param {string} value — com ou sem máscara
 */
export function isValidCpf(value) {
  const d = cpfDigits(value);
  if (d.length !== 11) return false;
  if (/^(\d)\1{10}$/.test(d)) return false;

  let sum = 0;
  for (let i = 0; i < 9; i++) sum += Number(d[i]) * (10 - i);
  let rest = (sum * 10) % 11;
  if (rest === 10 || rest === 11) rest = 0;
  if (rest !== Number(d[9])) return false;

  sum = 0;
  for (let i = 0; i < 10; i++) sum += Number(d[i]) * (11 - i);
  rest = (sum * 10) % 11;
  if (rest === 10 || rest === 11) rest = 0;
  return rest === Number(d[10]);
}
