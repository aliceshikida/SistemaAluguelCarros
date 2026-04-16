import { describe, expect, it } from 'vitest';
import { decodeJwtPayload, primaryUiRole, rolesFromPayload } from './jwt';

function makeToken(payloadObj) {
  const json = JSON.stringify(payloadObj);
  const b64 = btoa(json).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/g, '');
  return `hdr.${b64}.sig`;
}

describe('jwt utils', () => {
  it('decodeJwtPayload extrai claims', () => {
    const token = makeToken({ sub: 'maria', roles: ['ROLE_CLIENTE'] });
    const p = decodeJwtPayload(token);
    expect(p?.sub).toBe('maria');
    expect(p?.roles).toEqual(['ROLE_CLIENTE']);
  });

  it('decodeJwtPayload retorna null para token inválido', () => {
    expect(decodeJwtPayload('')).toBeNull();
    expect(decodeJwtPayload('abc')).toBeNull();
  });

  it('rolesFromPayload aceita array ou string', () => {
    expect(rolesFromPayload({ roles: ['ROLE_BANCO'] })).toEqual(['ROLE_BANCO']);
    expect(rolesFromPayload({ roles: 'ROLE_EMPRESA ROLE_BANCO' })).toContain('ROLE_EMPRESA');
  });

  it('primaryUiRole prioriza CLIENTE, depois EMPRESA, depois BANCO', () => {
    expect(primaryUiRole(['ROLE_EMPRESA', 'ROLE_CLIENTE'])).toBe('CLIENTE');
    expect(primaryUiRole(['ROLE_BANCO', 'ROLE_EMPRESA'])).toBe('EMPRESA');
    expect(primaryUiRole(['ROLE_BANCO'])).toBe('BANCO');
    expect(primaryUiRole([])).toBeNull();
  });
});
