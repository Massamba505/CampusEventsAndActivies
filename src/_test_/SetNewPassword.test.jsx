import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import SetNewPassword from '../pages/FogotPassword/SetNewPassword'; // Corrected the path
import { myConstant } from '../const/const'; // Adjust the import according to your structure
import toast from 'react-hot-toast';
import { vi } from 'vitest';
import '@testing-library/jest-dom';

vi.mock('react-hot-toast'); // Mock toast notifications
global.fetch = vi.fn(); // Mock global fetch

describe('SetNewPassword Component', () => {
    beforeEach(() => {
        // Clear all mocks before each test
        vi.clearAllMocks();
    });

    test('renders the password input fields', () => {
        render(
            <MemoryRouter initialEntries={['/set-new-password/123']}>
                <Routes>
                    <Route path="/set-new-password/:userId" element={<SetNewPassword />} />
                    
                </Routes>
            </MemoryRouter>
        );

        expect(screen.getByTestId(/newpassword/i)).toBeInTheDocument();
        expect(screen.getByTestId(/confirmPassword/i)).toBeInTheDocument();
    });

    test('shows error when passwords do not match', async () => {
        render(
            <MemoryRouter initialEntries={['/set-new-password/123']}>
                <Routes>
                    <Route path="/set-new-password/:userId" element={<SetNewPassword />} />
                </Routes>
            </MemoryRouter>
        );

        fireEvent.change(screen.getByTestId(/newpassword/i), { target: { value: 'Password1!' } });
        fireEvent.change(screen.getByTestId(/confirmPassword/i), { target: { value: 'Password2!' } });

        fireEvent.click(screen.getByRole('button', { name: /set new password/i }));

        await waitFor(() => {
            expect(toast.error).toHaveBeenCalledWith('Passwords do not match');
        });
    });

    test('shows error for weak password', async () => {
        render(
            <MemoryRouter initialEntries={['/set-new-password/123']}>
                <Routes>
                    <Route path="/set-new-password/:userId" element={<SetNewPassword />} />
                </Routes>
            </MemoryRouter>
        );

        fireEvent.change(screen.getByTestId(/newpassword/i), { target: { value: '123' } });
        fireEvent.change(screen.getByTestId(/confirmPassword/i), { target: { value: '123' } });

        fireEvent.click(screen.getByRole('button', { name: /set new password/i }));

        await waitFor(() => {
            expect(toast.error).toHaveBeenCalledWith('Password should be at least 4 characters long.');
        });
    });

    test('submits successfully with valid passwords', async () => {
        fetch.mockResolvedValueOnce({
            ok: true,
            json: async () => ({ message: 'Password updated successfully!' }),
        });

        render(
            <MemoryRouter initialEntries={['/set-new-password/123']}>
                <Routes>
                <Route path="/login" element={<div>Login Page</div>} />
                <Route path="/set-new-password/:userId" element={<SetNewPassword />} />
                </Routes>
            </MemoryRouter>
        );

        fireEvent.change(screen.getByTestId(/newpassword/i), { target: { value: 'Password1!' } });
        fireEvent.change(screen.getByTestId(/confirmPassword/i), { target: { value: 'Password1!' } });

        fireEvent.click(screen.getByRole('button', { name: /set new password/i }));

        await waitFor(() => {
            expect(toast.success).toHaveBeenCalledWith('Password updated successfully!');
            expect(fetch).toHaveBeenCalledWith(myConstant + '/api/auth/set-new-password', expect.any(Object));
        });
    });

    afterAll(() => {
        vi.restoreAllMocks(); // Restore original implementations after tests are done
    });
});
