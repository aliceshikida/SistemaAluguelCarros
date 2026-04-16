/**
 * Decodifica o payload (2º segmento) de um JWT. Retorna null se inválido.
 * @param {string} token
 * @returns {Record<string, unknown>|null}
 */
export function decodeJwtPayload(token) {
  if (!token || typeof token !== 'string') return null;
  try {
    const parts = token.split('.');
    if (parts.length < 2) return null;
    const base64 = parts[1].replace(/-/g, '+').replace(/_/g, '/');
    const padded = base64.padEnd(base64.length + ((4 - (base64.length % 4)) % 4), '=');
    const json = atob(padded);
    return JSON.parse(json);
  } catch {
    return null;
  }
}

/**
 * Extrai lista de roles do payload Micronaut/JWT (campo `roles`).
 * @param {Record<string, unknown>|null} payload
 * @returns {string[]}
 */
export function rolesFromPayload(payload) {
  if (!payload) return [];
  const r = payload.roles;
  if (Array.isArray(r)) return r.map(String);
  if (typeof r === 'string') return r.split(/[,\s]+/).filter(Boolean);
  return [];
}

/**
 * Mapeia ROLE_* para papel da UI (um único valor para menus e rotas).
 * @param {string[]} roles
 * @returns {'CLIENTE'|'EMPRESA'|'BANCO'|null}
 */
export function primaryUiRole(roles) {
  const set = new Set(roles);
  if (set.has('ROLE_CLIENTE')) return 'CLIENTE';
  if (set.has('ROLE_EMPRESA')) return 'EMPRESA';
  if (set.has('ROLE_BANCO')) return 'BANCO';
  return null;
}
