import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import ValidationNotice from './ValidationNotice';

describe('ValidationNotice', () => {
  it('não renderiza sem mensagem', () => {
    const { container } = render(<ValidationNotice message={null} />);
    expect(container.firstChild).toBeNull();
  });

  it('renderiza alerta com mensagem', () => {
    render(<ValidationNotice message="Campo inválido" />);
    expect(screen.getByRole('alert')).toHaveTextContent('Campo inválido');
  });
});
