import { Navigate, Outlet } from "react-router-dom";

function RequireAuth({ isLogged, allowedRoles}) {
    const rol = localStorage.getItem("rol");
    if (!isLogged) {
        return <Navigate to="/" />;
    }

    if(!allowedRoles.includes(rol)){
        return <Navigate to="/dashboard" />;
    }

    return <Outlet />;
}

export default RequireAuth;
