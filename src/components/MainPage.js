import React from 'react';
// import React, { useEffect, useCallback, useState } from 'react';
// import { useHttp } from '../hooks/http.hook';
// import { WordFormChange } from './WordFormChange';
// import { useMessage } from '../hooks/message.hook';
// import { Loader } from './Loader';

import { Link, useHistory } from 'react-router-dom';
import book_black from '../../src/img/book_black.svg';
import bulb_black from '../../src/img/bulb_black.svg';
import letter_black from '../../src/img/letter_black.svg';
import close_book_black from '../../src/img/close_book_black.svg';
import check_black from '../../src/img/check_black.svg';
import check_round_black from '../../src/img/check_round_black.svg';
import two_users_black from '../../src/img/two_users_black.svg';
import user_black from '../../src/img/user_black.svg';
import arrow_black from '../../src/img/arrow_black.svg';

export const MainPage = () => {

    return (
        <section className="introduction">
            <div className="introduction__block introduction__green">
                <p>Словарь, заметки, квизы —</p>
                <p>учите язык легко</p>
                <a>Начать учиться </a>
            </div>
            <div className="introduction introduction_there">
                <div className="introduction__block introduction__image"></div>

                <div className="introduction introduction_two">
                    <div className="introduction__block iintroduction__block_registration">
                        <img className="introduction__arrow" src={arrow_black} alt="Символ стрелки"></img>
                        <Link className="introduction__registration-link" to="/registration">Регистрация</Link>
                    </div>

                    <div className="introduction__block introduction__feedback">
                        <a href="#" className="sdsd-enter" to="/authorization">Обратная связь</a>
                    </div>

                </div>
            </div >
            <div className="introduction__block introduction__block_tags">
                <div>
                    <p className="introduction__paragraph">Храните слова, записывайте грамматику, создавайте задания и проходите квизы. </p>
                    <br></br>
                    <p className="introduction__paragraph">Всё необходимое для изучения языка в одном месте.</p>
                </div>
                <div className="introduction__tags">
                    <div className="introduction__tag">
                        <img className="" src={book_black} alt="Символ книги"></img>
                        Словарь</div>
                    <div className="introduction__tag">
                        <img className="" src={bulb_black} alt="Символ лампочки"></img>
                        Квиз</div>
                    <div className="introduction__tag">
                        <img className="" src={letter_black} alt="Символ букв"></img>
                        Грамматика</div>
                    <div className="introduction__tag">
                        <img className="" src={close_book_black} alt="Символ закрытой книги"></img>
                        Заметки</div>
                    <div className="introduction__tag">
                        <img className="" src={check_black} alt="Символ галочки в шестеренке"></img>
                        Задания</div>
                    <div className="introduction__tag">
                        <img className="" src={check_round_black} alt="Символ галочки в круге"></img>
                        В своём темпе</div>
                    <div className="introduction__tag">
                        <img className="" src={two_users_black} alt="Символ двух пользователей"></img>
                        С учителем</div>
                    <div className="introduction__tag">
                        <img className="" src={user_black} alt="Символ пользователя"></img>
                        Самостоятельно</div>
                </div>
            </div>
        </section >
        // <main className="main-page commonClass">
        //     <section className="title-section">
        //         <h1 className='title-section__title'>То, что ты учишь, всегда с тобой.</h1>
        //         <p className="title-section__paragraph">Сайт позволяет тебе создавать твою собственную библиотеку грамматических правил, определений,
        //             слов, которые тебе хотелось бы знать на иностранном языке, примеров, которые нужны именно тебе и которые будут понятны для тебя.
        //             То, что ты хочешь знать, всегда с тобой.
        //         </p>
        //     </section>

        //     <section className="instrustion-section">
        //         <h2 className='instrustion-section__title'>Так просто учиться:</h2>
        //         <div className='instrustion-section__items'>
        //             <div className='item'>
        //                 <h3 className='item__title'>Регистрируйся</h3>
        //                 <p className='item__paragraph'>Никаких рассылок, только создание аккаунта.</p>
        //             </div >
        //             <div className='item'>
        //                 <h3 className='item__title'>Создавай правила</h3>
        //                 <p className='item__paragraph'>Добавляй название темы, краткое описание правила и примеры.</p>
        //             </div>
        //             <div className='item'>
        //                 <h3 className='item__title'>Добавляй категории</h3>
        //                 <p className='item__paragraph'>Можешь разделять изучаемые слова по категориям или сделать одну - общую</p>
        //             </div>
        //             <div className='item'>
        //                 <h3 className='item__title'>Добавляй слова</h3>
        //                 <p className='item__paragraph'>Добавляй слова или целые выражения</p>
        //             </div>
        //             <div className='item'>
        //                 <h3 className='item__title'>Повторяй</h3>
        //                 <p className='item__paragraph'>Повторяй добавленные слова и запоминай их все лучше</p>
        //             </div>
        //         </div>
        //     </section>
        // </main>
    )
}