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
            {/* <header className="header">
                <img className="header__logo header__logo_white" src={logoWhite} alt="Логотип белый"></img>
                <nav className="header__menu">
                    {!authorization && <div className="header__menu-in">
                        <img className="header__user-white" src={iconUserWhite} alt="Символ пользователя"></img>
                        <Link className="header__menu-enter" to="/authorization">Войти</Link>
                    </div>}
                    {!authorization && <Link className="header__menu-registration" to="/registration">Зарегистрироваться</Link>}
                </nav>
            </header> */}
            
        </>
    )
}