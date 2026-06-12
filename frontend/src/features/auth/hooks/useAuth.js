import { useContext,useEffect } from "react";
import { AuthContext } from "../auth.context";
import { login, register, logout, getMe } from "../services/auth.api"



export const useAuth = () => {
    const context = useContext(AuthContext)
    const { user, setUser, loading, setLoading } = context
    const handleLogin = async ({ email, password }) => {
        try {
            setLoading(true)
            const data = await login({ email, password })
            if (data?.user) {
                setUser(data.user)
                return true
            }
            return false
        } catch (err) {
            console.log("Login failed:", err)
            return false
        } finally {
            setLoading(false)
        }
    }
    const handleRegister = async ({ username, email, password }) => {
        try {
            setLoading(true)
            const data = await register({ username, email, password })
            if (data?.user) {
                setUser(data.user)
                return true
            }
            return false
        } catch (err) {
            console.log("Register failed:", err)
            return false
        } finally {
            setLoading(false)
        }
    }
    const handleLogout = async () => {
        try {
            setLoading(true)
            await logout()
            setUser(null)
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
        handleLogin,
        handleRegister,
        handleLogout,
        handleGetMe
    }
}