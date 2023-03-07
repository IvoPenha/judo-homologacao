import { useContext } from 'react';
import { AuthContext } from '../providers/context/AuthContext';

export function useAuthContext() {
  const context = useContext(AuthContext);

  const {
    isAuthenticated,
    user,
    signIn,
    logout,
    registerAgremiacao,
    verifyToken
  } = context;

  return {
    isAuthenticated,
    user,
    signIn,
    logout,
    registerAgremiacao,
    verifyToken
  };
};