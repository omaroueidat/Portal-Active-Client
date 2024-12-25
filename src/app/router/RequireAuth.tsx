import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useStore } from "../stores/store";

export default function RequireAuth() {
    const {commonStore: {token}} = useStore();
    const location = useLocation();

    if (!token) {
        return <Navigate to='/' state={{from: location}} />
    }

    return <Outlet />
}