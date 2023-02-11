import { createContext, useEffect, useState } from 'react';
import { AuthContextType } from './types/contex.type';

import Routes from './Routes';
import { Spinner } from 'react-bootstrap';

export const AuthContext = createContext<AuthContextType>(
  {} as AuthContextType,
);

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [accessToken, setAccessToken] = useState('');
  const [refreshToken, setRefreshToken] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const updateAuthContext = () => {
    const token = localStorage.getItem('accessToken');
    const refreshToken = localStorage.getItem('refreshToken');

    if (token) {
      setIsAuthenticated(true);
      setAccessToken(token);
      refreshToken && setRefreshToken(refreshToken);
    } else {
      setIsAuthenticated(false);
      setAccessToken('');
      setRefreshToken('');
    }
  };

  const storageEventHandler = (e: StorageEvent) => {
    if (e.key === 'accessToken') {
      updateAuthContext();
    }
  };

  useEffect(() => {
    updateAuthContext();
    window.addEventListener('storage', storageEventHandler);
    return () => {
      window.removeEventListener('storage', storageEventHandler);
    };
  }, []);

  return (
    <>
      <AuthContext.Provider
        value={{
          isAuthenticated,
          accessToken,
          refreshToken,
          setIsLoading,
        }}
      >
        <Routes />
        {isLoading && (
          <div
            style={{
              position: 'fixed',
              height: '100vh',
              width: '100%',
              top: 0,
              left: 0,
              zIndex: 9999,
              backgroundColor: 'rgba(0,0,0,0.5)',

              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
            className="spinner-wrapper"
          >
            <Spinner
              style={{
                height: '100px',
                width: '100px',
              }}
              animation="grow"
              variant="primary"
            />
          </div>
        )}
      </AuthContext.Provider>
    </>
  );
}

export default App;
