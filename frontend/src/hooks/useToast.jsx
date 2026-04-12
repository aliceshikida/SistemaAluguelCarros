import { useState, useCallback, useEffect } from 'react';

/** Notificação fixa estilo toast (sem dependências extras). */
export function useToast(duration = 4500) {
  const [toast, setToast] = useState(null);

  const showToast = useCallback((message) => {
    setToast(message);
  }, []);

  useEffect(() => {
    if (!toast) return undefined;
    const id = setTimeout(() => setToast(null), duration);
    return () => clearTimeout(id);
  }, [toast, duration]);

  function Toast() {
    if (!toast) return null;
    return (
      <div
        role="alert"
        className="fixed bottom-6 left-1/2 z-[100] max-w-md -translate-x-1/2 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-800 shadow-lg"
      >
        {toast}
      </div>
    );
  }

  return { showToast, Toast };
}
