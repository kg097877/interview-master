import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../auth.context";
import { login, register, logout, getMe } from "../services/auth.api"
import InterviewContext from "../../interview/interview.context";

export const useAuth = () => {
    const context = useContext(AuthContext)
    const { user, setUser, loading, setLoading } = context
    const interviewCtx = useContext(InterviewContext)
    const [error, setError] = useState(null)

    const handleLogin = async ({ email, password }) => {
        try {
            setLoading(true)
            setError(null)
            const data = await login({ email, password })
            if (data?.user) {
                setUser(data.user)
                interviewCtx?.setReports([])
                interviewCtx?.setReport(null)
                return true
            }
            return false
        } catch (err) {
            console.log("Login failed:", err)
            setError(err?.response?.data?.message || "Something went wrong. Please try again.")
            return false
        } finally {
            setLoading(false)
        }
    }

    const handleRegister = async ({ username, email, password }) => {
        try {
            setLoading(true)
            setError(null)
            const data = await register({ username, email, password })
            if (data?.user) {
                setUser(data.user)
                interviewCtx?.setReports([])
                interviewCtx?.setReport(null)
                return true
            }
            return false
        } catch (err) {
            console.log("Register failed:", err)
            // check for zod errors
            if (err?.response?.data?.errors) {
                const firstError = Object.values(err.response.data.errors)[0]
                setError(Array.isArray(firstError) ? firstError[0] : "Validation failed.")
            } else {
                setError(err?.response?.data?.message || "Something went wrong. Please try again.")
            }
            return false
        } finally {
            setLoading(false)
        }
    }

    const handleLogout = async () => {
        try {
            setLoading(true)
            setError(null)
            await logout()
            setUser(null)
            interviewCtx?.setReports([])
            interviewCtx?.setReport(null)
        } catch (err) {
            console.log("Logout failed:", err)
        } finally {
            setLoading(false)
        }
    }

    const handleGetMe = async () => {
        try {
            setLoading(true)
            const data = await getMe()
            if (data?.user) {
                setUser(data.user)
            }
        } catch (err) {
            console.log("GetMe failed:", err)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        const getAndSetUser = async () => {
            try {
                const data = await getMe()
                if (data?.user) {
                    setUser(data.user)
                }
            } catch (err) {
                console.log("Auth check failed:", err)
            } finally {
                setLoading(false)
            }
        }
        getAndSetUser()
    }, [])

    return {
        user,
        loading,
        error,
        handleLogin,
        handleRegister,
        handleLogout,
        handleGetMe
    }
}
