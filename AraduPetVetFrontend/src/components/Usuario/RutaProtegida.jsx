
import { Navigate, Outlet } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { useAuth } from "../../context/AuthContext";

export default function RutaProtegida() {

  const { token } = useAuth();

  if (!token) {
    return <Navigate to="/user/login" replace />;
  }

  try {
    const datos = jwtDecode(token);

    if (!datos.exp || datos.exp * 1000 <= Date.now()) {
      return <Navigate to="/user/login" replace />;
    }

  } catch {
    return <Navigate to="/user/login" replace />;
  }

  return <Outlet />;
}
