import React from 'react';
import { NavLink, useHistory } from 'react-router-dom';


export const Header = () => {
    // document.addEventListener('DOMContentLoaded', function () {
    //     var elems = document.querySelectorAll('.sidenav');
    //     var instances = M.Sidenav.init(elems, options);
    // });

    return (
        <>
            <nav>
                <div className="nav-wrapper">
                    <input type="checkbox" className="checkbox" />
                    <ul  className="right nav-menu">
                        <li><NavLink to="/english-cards/home">Главная</NavLink></li>
                        <li><NavLink to="/english-cards/flashcards">Повторение</NavLink></li>
                        <li><NavLink to="/english-cards/wordslist">Список слов</NavLink></li>
                    </ul>
                </div>
            </nav>
        </>
    )
}