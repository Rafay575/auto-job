import React, { useEffect, useState } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import axios from 'axios';
import { type RootState } from '../redux/store';
import { loginSuccess, logout } from '../redux/authSlice';
import { baseUrl } from '../api/baseUrl';

interface ProtectedRouteProps {
  allowedRoles?: number[]; // [1] for admin, [0] for user, etc.
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ allowedRoles }) => {
  const dispatch = useDispatch();
  const { token, user } = useSelector((state: RootState) => state.auth);

  const [loading, setLoading] = useState(true);
  const [isValid, setIsValid] = useState(false);

  // Hydrate Redux from localStorage if missing (on refresh, after update, etc.)
  useEffect(() => {
    const localUser = localStorage.getItem('user');
    const localToken = localStorage.getItem('token');
    if ((!user || !token) && localUser && localToken) {
      dispatch(loginSuccess({ user: JSON.parse(localUser), token: localToken }));
    }
    // eslint-disable-next-line
  }, []);

  // Validate token on mount/token change
  useEffect(() => {
    const verifyToken = async () => {
      if (!token) {
        setLoading(false);
        return;
      }
      try {
        const res = await axios.get(`${baseUrl}/auth/verify`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.status === 200) {
          setIsValid(true);
        } else {
          dispatch(logout());
        }
      } catch {
        dispatch(logout());
      } finally {
        setLoading(false);
      }
    };
    verifyToken();
  }, [token, dispatch]);

  // Hydration: If Redux is still undefined, wait for it.
  if (typeof user === "undefined" || typeof token === "undefined") {
    return <div>Loading...</div>;
  }
  if (loading) return <div>Checking credentials...</div>;

  // Not authenticated? Kick to login.
  if (!token || !user || !isValid) {
    return <Navigate to="/sign-in" />;
  }

  // Role restriction? Kick to home if not allowed.
console.log("allowedRoles:", allowedRoles, "user_type:", user?.user_type);
if (allowedRoles && !allowedRoles.includes(user.user_type)) {
  return <Navigate to="/" />;
}


  // All good, render children/outlet.
  return <Outlet />;
};

export default ProtectedRoute;
