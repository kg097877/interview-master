import { Navigate } from "react-router";
import { useAuth } from "../hooks/useAuth";
import { AuthLoadingScreen } from "./AuthLayout";

const Protected = ({ children }) => {
    const { loading, user } = useAuth()
    if (loading) {
        return <AuthLoadingScreen />
    }
    if (!user) {
        return <Navigate to="/login" replace />
    }
    return children
}
export default Protected