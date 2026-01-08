// @ts-nocheck
import { useAuth } from "../context/AuthContext";
export const useAuthRole = (requiredRole) => {
  const { user } = useAuth();
  if (!user) {
    return false;
  }
  // Check if user is already an object
  const userObj = typeof user === "string" ? JSON.parse(user) : user;

  return userObj?.role === requiredRole;
};
export const GetAuthRole = () => {
  const { user } = useAuth();
  if (!user) {
    return null;
  }
  // Check if user is already an object
  const userObj = typeof user === "string" ? JSON.parse(user) : user;

  return userObj?.role;
};
