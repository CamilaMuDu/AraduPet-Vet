
import { createContext, useContext, useState } from "react";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {

    const [usuario, setUsuario] = useState(() => {
        return JSON.parse(
            sessionStorage.getItem("usuario") || "null"
        );
    });

    const [token, setToken] = useState(() => {
        return sessionStorage.getItem("token");
    });

    const login = (datos) => {
        sessionStorage.setItem("token", datos.token);
        sessionStorage.setItem(
            "usuario",
            JSON.stringify(datos.usuario)
        );

        setToken(datos.token);
        setUsuario(datos.usuario);
    };

    const logout = () => {
        sessionStorage.removeItem("token");
        sessionStorage.removeItem("usuario");

        setToken(null);
        setUsuario(null);
    };

    return (
        <AuthContext.Provider
            value={{ usuario, token, login, logout }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    return useContext(AuthContext);
}
