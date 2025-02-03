import React from 'react';
// import React, { useEffect, useCallback, useState } from 'react';
// import { useHttp } from '../hooks/http.hook';
// import { WordFormChange } from './WordFormChange';
// import { useMessage } from '../hooks/message.hook';
// import { Loader } from './Loader';
// import trashIcon from '../../src/img/trash_icon.png';

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
                    <div className="introduction__block introduction__registration">
                        <a>Регистрация</a>
                    </div>
                    <div className="introduction__block introduction__feedback">
                        <a>Обратная связь</a>
                    </div>
                </div>
            </div>
            <div className="introduction__block introduction__tags">
                <p>Храните слова, записывайте грамматику, создавайте задания и проходите квизы. </p>
                <p>Всё необходимое для изучения языка в одном месте.</p>
                <div>
                    <div>Словарь</div>
                    <div>Квиз</div>
                    <div>Грамматика</div>
                    <div>Заметки</div>
                    <div>Задания</div>
                    <div>В своём темпе</div>
                    <div>С учителем</div>
                    <div>Самостоятельно</div>

                </div>
            </div>
        </section>
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