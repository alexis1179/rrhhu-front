import { Navigate, Outlet } from "react-router-dom";

function RequireAuth({isLogged, children, redirectTo='/'}){
    if(!isLogged){
        console.log("Not logged");
        return <Navigate to={redirectTo}/>
    }
    return children ? children:<Outlet/>
}

export default RequireAuth;