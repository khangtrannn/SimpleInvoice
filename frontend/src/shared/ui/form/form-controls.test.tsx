import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';

import { PasswordInput, SelectInput, TextareaInput, TextInput } from './index';

describe('shared form controls', () => {
  it('renders text input label and error message', () => {
    // Arrange + Act
    render(
      <TextInput
        label="Customer Name"
        error="Customer name is required"
        requiredMark
      />,
    );

    // Assert
    expect(screen.getByLabelText(/customer name/i)).toBeInTheDocument();
    expect(screen.getByText('Customer name is required')).toBeInTheDocument();
    expect(screen.getByText('*')).toBeInTheDocument();
  });

  it('renders select input options', () => {
    // Arrange + Act
    render(
      <SelectInput label="Currency">
        <option value="AUD">AUD</option>
        <option value="USD">USD</option>
      </SelectInput>,
    );

    // Assert
    expect(screen.getByLabelText(/currency/i)).toBeInTheDocument();
    expect(screen.getByRole('option', { name: 'AUD' })).toBeInTheDocument();
    expect(screen.getByRole('option', { name: 'USD' })).toBeInTheDocument();
  });

  it('renders textarea input', () => {
    // Arrange + Act
    render(<TextareaInput label="Description" />);

    // Assert
    expect(screen.getByLabelText(/description/i)).toBeInTheDocument();
  });

  it('toggles password visibility', async () => {
    // Arrange
    const user = userEvent.setup();

    const { container } = render(<PasswordInput label="Password" />);

    const input = container.querySelector('input[type="password"]') as HTMLInputElement;
    const toggleButton = screen.getByRole('button', {
      name: /show password/i,
    });

    // Act
    await user.click(toggleButton);

    // Assert
    expect(input).toHaveAttribute('type', 'text');
    expect(
      screen.getByRole('button', {
        name: /hide password/i,
      }),
    ).toBeInTheDocument();
  });
});
