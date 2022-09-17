import React, { useContext } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

export const Header = () => {
    const { authorization, logout } = useContext(AuthContext); // получаем контекст в объекте auth
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
                        {authorization && <li className="nav__item-li"><Link className="nav__item-a" to="/flashcards">Повторение</Link></li>}

                        {authorization && <li className="nav__item-li_sub">Добавить:
                            <ul className="nav__add-items">
                                <li className="nav__item-li"><Link className="nav__item-a" to="/addword">Слово</Link></li>
                                <li className="nav__item-li"><Link className="nav__item-a" to="/addnote">Заметку</Link></li>
                                <li className="nav__item-li"><Link className="nav__item-a" to="/category">Категорию</Link></li>
                            </ul>
                        </li>}

                        {authorization && <li className="nav__item-li_sub">Добавленные:
                            <ul className="nav__add-items">
                                <li className="nav__item-li"><Link className="nav__item-a" to="/wordslist">Слова</Link></li>
                                <li className="nav__item-li"><Link className="nav__item-a" to="/notes">Заметки</Link></li>
                                <li className="nav__item-li"><Link className="nav__item-a" to="/categories">Категории</Link></li>
                            </ul>
                        </li>}

                        {!authorization && <li className="nav__item-li"><Link className="nav__item-a" to="/authorization">Войти</Link></li>}
                        {authorization && <li className="nav__item-li"><Link className="nav__item-a" to="/authorization" onClick={logoutHandler}>Выйти</Link></li>}
                    </ul>
                </nav>
            </header>
        </>
    )
}