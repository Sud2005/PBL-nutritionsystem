import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Register from './Register';
import { describe, it, expect } from 'vitest';

const MockRegister = () => {
    return (
        <BrowserRouter>
            <Register />
        </BrowserRouter>
    );
}

describe('Register Component Validation', () => {

    it('renders the registration form', () => {
        const { container } = render(<MockRegister />);
        expect(container.querySelector('input[name="name"]')).toBeInTheDocument();
        expect(container.querySelector('input[name="email"]')).toBeInTheDocument();
        expect(container.querySelector('input[name="password"]')).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /Sign up/i })).toBeInTheDocument();
    });

    it('enforces required constraints on form inputs', async () => {
        const { container } = render(<MockRegister />);
        const nameInput = container.querySelector('input[name="name"]');
        const emailInput = container.querySelector('input[name="email"]');
        expect(nameInput).toBeRequired();
        expect(emailInput).toBeRequired();
    });
    
});
