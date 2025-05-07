import './App.css';
import 'materialize-css'; // для всплывабщих сообшений. См.message.hook
import { Route, Switch } from 'react-router-dom';
import { NotesPage } from './pages/NotesPage';
import { RepeatPage } from './pages/RepeatPage';
import WordsPage from './pages/WordsPage';
import AddWord from './pages/AddWordPage';
import AddNote from './pages/AddNotePage';
import CategoryPage from './pages/CategoryPage';
import { FormReg } from './components/FormReg';
import { FormAuth } from './components/FormAuth';
import { Categories } from './components/Categories';
import { MainPage } from './components/MainPage';
import { HomeworkPage } from './pages/HomeworkPage';
import { TaskPage } from './pages/TasksPage';
import { NotFoundPage } from './pages/NotFoundPage';
import { EducationPage } from './pages/EducationPage';
import { NoteForm } from './components/NoteForm';

const Main = () => {
    var pjson = require('../package.json');
    console.log(pjson.version);

    return (
        <Switch>
            <Route exact path='/' component={MainPage} />
            <Route exact path='/notes' component={NotesPage} />
            <Route exact path='/flashcards' component={RepeatPage} />
            <Route exact path='/wordslist' component={WordsPage} />
            <Route exact path='/addword' component={AddWord} />
            <Route exact path='/addnote' component={AddNote} />
            <Route exact path='/category' component={CategoryPage} />
            <Route exact path='/authorization' component={FormAuth} />
            <Route exact path='/registration' component={FormReg} />
            <Route exact path='/categories' component={Categories} />
            <Route exact path='/tasks' component={TaskPage} /> 
            <Route exact path='/homework' component={HomeworkPage} />
            <Route exact path='/education' component={EducationPage} />
            <Route exact path='/notes/new' component={NoteForm} />
            <Route exact path='/*' component={NotFoundPage} statusCode={404} />
        </Switch>
    )
}


export default Main;
