import { createContext, useState, useEffect } from 'react';

// 1. Create the Context
export const AuthContext = createContext();

// 2. Create the Provider (This wraps our app)
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  // When the app first loads, check if they already have saved data
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      // Parse the string back into an object so Navbar can read user.role!
      setUser(JSON.parse(storedUser));
    }
  }, []);

  // Function to run when they log in (Now accepts the full user data!)
  const login = (userData) => {
    // Save the entire object to localStorage
    localStorage.setItem('user', JSON.stringify(userData));
    setUser(userData);
  };

  // Function to run when they click Logout
  const logout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token'); // Just in case the old token is still floating around
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};