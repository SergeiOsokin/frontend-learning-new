import './App.css';
import 'materialize-css'; // для всплывабщих сообшений. См.message.hook
import React, { useContext, useEffect } from 'react';
import { AuthContext } from './context/AuthContext';
import { Route, Switch, Redirect } from 'react-router-dom';
import { useHttp } from '../src/hooks/http.hook';
import { NotesPage } from './pages/NotesPage';
import { ArticlesPage } from './pages/ArticlesPage';
import { RepeatPage } from './pages/RepeatPage';
import WordsPage from './pages/WordsPage';
import { FormReg } from './components/FormReg';
import { FormAuth } from './components/FormAuth';
import { Categories } from './components/Categories';
import { MainPage } from './components/MainPage';
import { HomeworkPage } from './pages/HomeworkPage';
import { TaskPage } from './pages/TasksPage';
import { NotFoundPage } from './pages/NotFoundPage';
import { EducationPage } from './pages/EducationPage';
import { NoteForm } from './components/NoteForm';
import { NoteCard } from './components/NoteCard';
import { ArticleForm } from './components/ArticleForm';
import { ArticleCard } from './components/ArticleCard';
import { TaskForm } from './components/TaskForm';
import { TaskCard } from './components/TaskCard';
import { HomeworkCard } from './components/HomeworkCard';
import Privacy from './pages/Privacy';
import Agreement from './pages/Agreement';
import { ProfilePage } from './pages/ProfilePage';
import { ResetForm } from './components/ResetForm';
import { RoomPage } from './pages/RoomPage';
import { Room } from './components/room';
import { BasePage } from './pages/BasePage';
import { AiPage } from './pages/AiPage';
import { Loader } from './components/Loader';
import { FeedPage } from './pages/FeedPage';

const Main = () => {
    const { authorization, logout, login } = useContext(AuthContext); // получаем контекст в объекте auth
    var pjson = require('../package.json');
    console.info(pjson.version);

    function requireAuth(nextState, replace, next) {
        if (!authorization) {
            replace({
                pathname: "/login",
                state: { nextPathname: nextState.location.pathname }
            });
        }
        // component={NotesPage}
        next();
    }

    return (
        <Switch>
            <Route exact path='/' component={MainPage} />
            <Route exact path='/privacy' component={Privacy} />
            <Route exact path='/agreement' component={Agreement} />

            <Route exact path='/notes' component={NotesPage} />
            <Route exact path='/notes/new' component={NoteForm} />
            <Route exact path='/notes/open/:id' component={NoteCard} />

            <Route exact path='/articles' component={ArticlesPage} />
            <Route exact path='/articles/new' component={ArticleForm} />
            <Route exact path='/articles/open/:id' component={ArticleCard} />

            <Route exact path='/flashcards' component={RepeatPage} />
            <Route exact path='/wordslist' component={WordsPage} />
            {/* <Route exact path='/addword' component={AddWord} /> */}
            {/* <Route exact path='/addnote' component={AddNote} /> */}
            {/* <Route exact path='/category' component={CategoryPage} /> */}
            <Route exact path='/authorization' component={FormAuth} />
            <Route exact path='/registration' component={FormReg} />
            <Route exact path='/categories' component={Categories} />
            <Route exact path='/recover' component={ResetForm} />

            <Route exact path='/base' component={BasePage} />

            <Route exact path='/education' component={EducationPage} />

            <Route exact path='/feed' component={FeedPage} />

            <Route exact path='/education/call' component={RoomPage} />
            <Route exact path='/room/:id' component={Room} />

            <Route exact path='/ai' component={AiPage} />

            <Route exact path='/profile' component={ProfilePage} />

            <Route exact path='/education/teacher' component={TaskPage} />
            <Route exact path='/education/teacher/new' component={TaskForm} />
            <Route exact path='/education/teacher/open/:id' component={TaskCard} />

            <Route exact path='/education/student' component={HomeworkPage} />
            <Route exact path='/education/student/open/:id' component={HomeworkCard} />
            <Route exact path='*' component={NotFoundPage} />
        </Switch>
    )
}


export default Main;
