import React from 'react';
import { NavLink, useHistory } from 'react-router-dom';


export const Header = () => {
    return (
        <nav>
            <div className="nav-wrapper">
                <ul id="nav-mobile" className="right hide-on-med-and-down">
                    <li><NavLink to="/home">Главная</NavLink></li>
                    <li><NavLink to="/flashcards">Повторение</NavLink></li>
                    <li><NavLink to="/wordslist">Список слов</NavLink></li>
                </ul>
            </div>
        </nav>
    )
}