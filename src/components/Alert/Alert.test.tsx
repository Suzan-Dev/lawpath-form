import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import Alert from './Alert';

describe('Alert component', () => {
  it('renders a success alert', () => {
    const variant = 'success';
    const message = 'This is a success alert!';

    render(<Alert variant={variant}>{message}</Alert>);

    expect(screen.getByTestId('alert')).toHaveClass(variant);
    expect(screen.getByText(message)).toBeInTheDocument();
  });

  it('renders an error alert', () => {
    const variant = 'error';
    const message = 'This is a error alert!';

    render(<Alert variant={variant}>{message}</Alert>);

    expect(screen.getByTestId('alert')).toHaveClass(variant);
    expect(screen.getByText(message)).toBeInTheDocument();
  });
});
