import { ReactElement } from 'react';
import { Navigate } from 'react-router-dom';

interface Props {
  children: ReactElement;
  isAuthenticated: boolean;
  role?: string;
}

export default function PrivateRoute({ children, isAuthenticated, role }: Props) {
  return isAuthenticated && role === "user" ? children : <Navigate to={role === 'admin' ? '/dashboard' : '/login'} />;
}
