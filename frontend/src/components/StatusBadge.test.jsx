import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import StatusBadge from './StatusBadge';

describe('StatusBadge', () => {
  it('renderiza rótulo do status', () => {
    render(<StatusBadge status="SOLICITADO" />);
    expect(screen.getByText('SOLICITADO')).toBeInTheDocument();
  });

  it('mostra traço quando status vazio', () => {
    render(<StatusBadge status="" />);
    expect(screen.getByText('—')).toBeInTheDocument();
  });
});
