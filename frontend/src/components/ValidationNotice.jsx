/** Aviso imediato abaixo do campo (mesmo estilo visual do toast: borda vermelha clara). */
export default function ValidationNotice({ message }) {
  if (!message) return null;
  return (
    <p
      role="alert"
      className="mt-1.5 rounded-md border border-red-200 bg-red-50 px-2.5 py-1.5 text-xs leading-snug text-red-800"
    >
      {message}
    </p>
  );
}
