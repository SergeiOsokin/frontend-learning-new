import './App.css';
import 'materialize-css'; // для всплывабщих сообшений. См.message.hook
import React from 'react';
import { Header } from './components/Header';
import Main from './Main';
import { AuthContext } from './context/AuthContext';
import { useAuth } from './hooks/auth.hook';
import { Footer } from './components/Footer';

const App = () => {
  const { login, logout, authorization } = useAuth();

  return (
    <AuthContext.Provider value={{login, logout, authorization}}>
      <Header />
      <Main />
      <Footer />
    </AuthContext.Provider>
  )
}

export default App;
