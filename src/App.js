import './App.css';
// import 'materialize-css'; // для всплывабщих сообшений. См.message.hook
import React from 'react';
import { Header } from './components/Header';
import Main from './Main';
import { AuthContext } from './context/AuthContext';
import { useAuth } from './hooks/auth.hook';
import { Footer } from './components/Footer';
import { MobileMenu } from './components/MobileMenu';

const App = () => {
  const { userId, login, logout, authorization } = useAuth();

  return (
    <AuthContext.Provider value={{userId, login, logout, authorization}}>
      <Main />
      <MobileMenu />
    </AuthContext.Provider>
  )
}

export default App;
