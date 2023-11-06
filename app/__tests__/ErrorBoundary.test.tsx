import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import ErrorBoundary from '../error';

describe('ErrorBoundary Component', () => {
  it('renders the error message', () => {
    const error = new Error('Test error message');

    render(<ErrorBoundary error={error} />);

    // Assert that the error message is rendered
    expect(screen.getByText('Something went wrong!')).toBeInTheDocument();
    expect(screen.getByText('Please try again later')).toBeInTheDocument();
  });

  it('logs the error to the console', () => {
    const error = new Error('Test error message');

    // Mock the console.error method to spy on it
    console.error = jest.fn();

    render(<ErrorBoundary error={error} />);

    // Expect that console.error was called with the error message
    expect(console.error).toHaveBeenCalledWith(error);
  });
});

