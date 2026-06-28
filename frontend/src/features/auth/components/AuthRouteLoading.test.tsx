import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { AuthRouteLoading } from './AuthRouteLoading';

describe('AuthRouteLoading', () => {
  it('renders session loading message', () => {
    // Arrange + Act
    render(<AuthRouteLoading />);

    // Assert
    expect(screen.getByText(/checking your session/i)).toBeInTheDocument();
    expect(
      screen.getByText(/please wait while we restore your account/i),
    ).toBeInTheDocument();
  });
});
