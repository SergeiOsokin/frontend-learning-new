import './App.css';
import 'materialize-css'; // для всплывабщих сообшений. См.message.hook
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import { NotesPage } from './pages/NotesPage';
import { RepeatPage } from './pages/RepeatPage';
import WordsPage from './pages/WordsPage';
import AuthtorizationPage from './pages/AuthtorizationPage';
import AddWord from './pages/AddWordPage';
import { AuthContext } from './context/AuthContext';
import { useAuth } from './hooks/auth.hook';
import AddNote from './pages/AddNotePage';
import { useHttp } from './hooks/http.hook';
import CategoryPage from './pages/CategoryPage';

const PrivateRoute = () => {
  const { request } = useHttp();
  const [authorization, setAuthorization] = useState(null);
  const [loading, setLoading] = useState(null);
  useEffect(() => {
    async function fetchData() {
      try {
        const req = await request('/words/wordslist', 'GET');
        if (req.message === 'Не авторизованы') {
          setLoading(true);
          return setAuthorization(true);
        }
        setLoading(true);
        setAuthorization(true);
      } catch (err) {

      }
    }
    fetchData();
  }, [])
  return (
    <>
      {(loading && authorization) && <App />}
    </>
  )
}

function App() {
  const { login, logout, authorization, userId } = useAuth();
  const { loading } = useHttp();

  return (
    <AuthContext.Provider value={{ login, logout, authorization, userId, loading }}>
      <Router>
        <Switch>
          <Route exact path='/' component={CategoryPage} />
          <Route exact path='/notes' component={NotesPage} />
          <Route exact path='/flashcards' component={RepeatPage} />
          <Route exact path='/wordslist' component={WordsPage} />
          <Route exact path='/authorization' component={AuthtorizationPage} />
          <Route exact path='/addword' component={AddWord} />
          <Route exact path='/addnote' component={AddNote} />
          <Route exact path='/category' component={CategoryPage} />

        </Switch>
      </Router>
    </ AuthContext.Provider>
  );
}

export default PrivateRoute;
