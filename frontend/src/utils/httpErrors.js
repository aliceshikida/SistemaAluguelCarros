/** Axios sem resposta (backend parado, CORS, DNS, etc.) */
export function isOfflineError(err) {
  return !err?.response && (err?.code === 'ERR_NETWORK' || err?.message === 'Network Error');
}

export const OFFLINE_MSG =
  'Não foi possível conectar ao servidor. Inicie o backend na porta 8080 (na pasta backend: ./mvnw mn:run) e o frontend (npm run dev).';
