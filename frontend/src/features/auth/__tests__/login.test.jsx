import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { MemoryRouter } from 'react-router'
import Login from '../pages/login'
import * as AuthHook from '../hooks/useAuth'

describe('Login Component', () => {
    it('shows error message on failed login', async () => {
        vi.spyOn(AuthHook, 'useAuth').mockReturnValue({
            loading: false,
            error: 'Invalid credentials',
            handleLogin: vi.fn()
        })

        render(
            <MemoryRouter>
                <Login />
            </MemoryRouter>
        )

        expect(screen.getByText('Invalid credentials')).toBeInTheDocument()
    })

    it('submits form correctly', async () => {
        const handleLoginMock = vi.fn().mockResolvedValue(true)
        vi.spyOn(AuthHook, 'useAuth').mockReturnValue({
            loading: false,
            error: null,
            handleLogin: handleLoginMock
        })

        render(
            <MemoryRouter>
                <Login />
            </MemoryRouter>
        )

        fireEvent.change(screen.getByLabelText(/Email Address/i), { target: { value: 'test@test.com' } })
        fireEvent.change(screen.getByLabelText(/Password/i), { target: { value: 'password123' } })
        fireEvent.click(screen.getByRole('button', { name: /Sign In/i }))

        expect(handleLoginMock).toHaveBeenCalledWith({ email: 'test@test.com', password: 'password123' })
    })
})
