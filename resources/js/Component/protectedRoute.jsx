import React from "react";
import { Navigate, Outlet } from "react-router-dom";
const ProtectedRoute = ({ isAllowed }) => {
    if (!isAllowed) {
        return <Navigate to="/login" replace />
    }
    return <Outlet />;
}
export default ProtectedRoute;
