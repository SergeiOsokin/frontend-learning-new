import './App.css';
import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom';
import MainPage from './pages/MainPage';
import RepeatPage from './pages/RepeatPage';
import WordsPage from './pages/WordsPage';


function App() {
  return (
    <Router>
      <Switch>
        <Route path='/home'>
          <MainPage />
        </Route>
        <Route path='/flashcards'>
          <RepeatPage />
        </Route>
        <Route path='/wordslist'>
          <WordsPage />
        </Route>
        <Redirect to='/home' />
      </Switch>
    </Router>
  );
}

export default App;
