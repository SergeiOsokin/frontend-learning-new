import React, { useContext } from 'react';
import { NavLink, useHistory } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';


export const Header = () => {
    const { logout, authorization } = useContext(AuthContext); // получаем контекст в объекте auth
    const history = useHistory();
    const logoutHandler = (event) => {
        event.preventDefault();
        logout();
        history.push('/authorization');
    };

    return (
        <>
            <header className="header">

                <nav className="header__nav">
                    <label className="nav__checkbox-label" htmlFor="checkbox-nav">Меню</label>
                    <input className="nav__checkbox" type="checkbox" id="checkbox-nav" />
                    <ul className="nav__items">
                        {authorization && <li className="nav__item-li"><NavLink className="nav__item-a" to="/flashcards">Повторение</NavLink></li>}
                        {authorization && <li className="nav__item-li"><NavLink className="nav__item-a" to="/addword">Добавить слово</NavLink></li>}
                        {authorization && <li className="nav__item-li"><NavLink className="nav__item-a" to="/category">Мои категории</NavLink></li>}
                        {authorization && <li className="nav__item-li"><NavLink className="nav__item-a" to="/wordslist">Список слов</NavLink></li>}
                        {authorization && <li className="nav__item-li"><NavLink className="nav__item-a" to="/addnote">Добавить заметку</NavLink></li>}
                        {authorization && <li className="nav__item-li"><NavLink className="nav__item-a" to="/notes">Заметки</NavLink></li>}
                        {!authorization && <li className="nav__item-li"><NavLink className="nav__item-a" to="/authorization">Войти</NavLink></li>}
                        {authorization && <li className="nav__item-li"><NavLink className="nav__item-a" to="/authorization" onClick={logoutHandler}>Выйти</NavLink></li>}
                    </ul>
                </nav>
            </header>
        </>
    )
}