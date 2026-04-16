import { describe, expect, it } from 'vitest';
import { isOfflineError, OFFLINE_MSG } from './httpErrors';

describe('httpErrors', () => {
  it('isOfflineError detecta falha de rede Axios', () => {
    expect(isOfflineError({ code: 'ERR_NETWORK', response: undefined })).toBe(true);
    expect(isOfflineError({ message: 'Network Error', response: undefined })).toBe(true);
  });

  it('isOfflineError é falso quando há response HTTP', () => {
    expect(isOfflineError({ response: { status: 500 } })).toBe(false);
  });

  it('OFFLINE_MSG é string não vazia', () => {
    expect(OFFLINE_MSG.length).toBeGreaterThan(10);
  });
});
