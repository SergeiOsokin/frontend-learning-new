import './App.css';
import { HashRouter as Router, Route, Switch, Redirect } from 'react-router-dom';
import MainPage from './pages/MainPage';
import RepeatPage from './pages/RepeatPage';
import WordsPage from './pages/WordsPage';


function App() {
  return (
    <Router>
      <Switch>
        <Route path='/english-cards/home'>
          <MainPage />
        </Route>
        <Route path='/english-cards/flashcards'>
          <RepeatPage />
        </Route>
        <Route path='/english-cards/wordslist'>
          <WordsPage />
        </Route>
        <Redirect to='/english-cards/home' />
      </Switch>
    </Router>
  );
}

export default App;
