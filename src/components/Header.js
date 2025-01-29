import React, { useContext } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

import logoWhite from '../../src/img/logo_white.svg';
import iconUserWhite from '../../src/img/Icon_enter_white.svg';

// переделать меню просто на a

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

                <img className="header__logo header__logo_white" src={logoWhite} alt="Логотип белый"></img>

                <nav class="header__menu">
                    {/* {!authorization && <li className="header__enter nav__item-li"><img className="header__logo-white" alt="Символ пользователя"></img><Link className="nav__item-a nav__item-a_enter" to="/authorization">Войти</Link></li>} */}
                    {/* {!authorization && <li className="header__registration nav__item-li"><Link className="nav__item-a nav__item-a_registration" to="/registration">Зарегистрироваться</Link></li>} */}
                    {!authorization && <div class="header__menu-in">
                        <img className="header__user-white" src={iconUserWhite} alt="Символ пользователя"></img>
                        <Link className="header__menu-enter" to="/authorization">Войти</Link>
                    </div>}
                    {!authorization && <Link className="header__menu-registration" to="/registration">Зарегистрироваться</Link>}
                </nav>

                {/* <nav className="header__nav">
                    
                    {authorization && <li className="nav__item-li"><Link className="nav__item-a" to="/">Главная</Link></li>}

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

                        {authorization && <li className="nav__item-li_sub">Обучение:
                            <ul className="nav__add-items">
                                <li className="nav__item-li"><Link className="nav__item-a" to="/homework">Ученик</Link></li>
                                <li className="nav__item-li"><Link className="nav__item-a" to="/tasks">Учитель</Link></li>
                            </ul>
                        </li>}

                        {!authorization && <li className="nav__item-li"><Link className="nav__item-a" to="/authorization">Войти</Link></li>}
                        {!authorization && <li className="nav__item-li"><Link className="nav__item-a" to="/registration">Регистрация</Link></li>}
                        {authorization && <li className="nav__item-li"><Link className="nav__item-a" to="/authorization" onClick={logoutHandler}>Выйти</Link></li>}
                    </ul>
                </nav> */}
            </header>
        </>
    )
}