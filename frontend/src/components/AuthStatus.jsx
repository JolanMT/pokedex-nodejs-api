import React from 'react';
import { useAuth } from '../context/AuthContext';

const AuthStatus = () => {
    const { user, logout } = useAuth();
  
    if (!user) {
      return <p>Vous n'êtes pas connecté.</p>;
    }
  
    return (
      <div>
        <p>Bienvenue, {user.username} !</p>
        <button onClick={logout}>Se déconnecter</button>
      </div>
    );
  };
export default AuthStatus;
