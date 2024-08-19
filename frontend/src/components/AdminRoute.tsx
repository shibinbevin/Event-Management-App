import { ReactElement } from 'react';
import { Navigate } from 'react-router-dom';

interface Props {
  children: ReactElement;
  isAuthenticated: boolean;
  role?: string;
}

export default function AdminRoute({ children, isAuthenticated, role }: Props) {
  return isAuthenticated && role === 'admin' ? (
    children
  ) : (
    <Navigate to={role === 'user' ? '/private' : '/login'} />
  );
}
