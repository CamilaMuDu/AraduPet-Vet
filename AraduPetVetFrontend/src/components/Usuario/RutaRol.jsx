
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function RutaRol({ rolesPermitidos }) {

    const { usuario } = useAuth();

    if (!usuario) {
        return <Navigate to="/user/login" replace />;
    }

    if (!rolesPermitidos.includes(usuario.rol)) {
        return <Navigate to="/" replace />;
    }

    return <Outlet />;
}
