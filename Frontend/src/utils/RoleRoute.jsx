import { Navigate, Outlet } from "react-router-dom";

const RoleRoute = ({ roles, children }) => {
  const storedUser = localStorage.getItem("user");
  const user = storedUser ? JSON.parse(storedUser) : null;

  if (!user) return <Navigate to="/login" replace />;
  if (!roles.includes(user.role)) return <Navigate to="/" replace />;

  return children || <Outlet />;
};

export default RoleRoute;
