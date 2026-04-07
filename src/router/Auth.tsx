import React from 'react';
import { Navigate } from 'react-router-dom';

interface AuthProps {
    children: React.ReactNode;
    accessBY: 'authed' | 'non-authed';
}

/**
 * Auth component to handle route protection.
 * @param {AuthProps} props - Component props
 */
const Auth: React.FC<AuthProps> = ({ children, accessBY }) => {
    const token = localStorage.getItem('token');

    if (accessBY === 'authed') {
        // If route requires authentication but no token is present, redirect to login
        if (!token) {
            return <Navigate to="/login" replace />;
        }
        // Otherwise, allow access to children
        return <>{children}</>;
    }

    if (accessBY === 'non-authed') {
        // If route is for non-authenticated users (like login) but token is present, redirect to home
        if (token) {
            return <Navigate to="/" replace />;
        }
        // Otherwise, allow access to children (e.g., show login page)
        return <>{children}</>;
    }

    // Default fallback (should not be reached if props are correct)
    return <>{children}</>;
};

export default Auth;