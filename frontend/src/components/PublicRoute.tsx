import { ReactElement } from 'react';
import { Navigate } from 'react-router-dom';

interface Props {
  children: ReactElement;
  isAuthenticated: boolean;
  role?: string;
}

export default function PublicRoute({ children, isAuthenticated, role }: Props) {
  return isAuthenticated ? <Navigate to={role === 'admin' ? '/dashboard' : '/'} /> : children;
}
