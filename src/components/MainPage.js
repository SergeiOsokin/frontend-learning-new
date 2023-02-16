import React, { useEffect, useCallback, useState } from 'react';
import { useHttp } from '../hooks/http.hook';
import { WordFormChange } from './WordFormChange';
import { useMessage } from '../hooks/message.hook';
import { Loader } from './Loader';
import trashIcon from '../../src/img/trash_icon.png';

export const MainPage = () => {

    return (
        <main className="main-page commonClass">
            <section className="title-section">
                <h1 className='title-section__title'>То, что ты учишь, всегда с тобой.</h1>
                <p className="title-section__paragraph">Сайт позволяет тебе создавать твою собственную библиотеку грамматических правил, определений,
                    слов, которые тебе хотелось бы знать на иностранном языке, примеров, которые нужны именно тебе и которые будут понятны для тебя.
                    То, что ты хочешь знать, всегда с тобой.
                </p>
            </section>

            <section className="instrustion-section">
                <h2 className='instrustion-section__title'>Так просто учиться:</h2>
                <div className='instrustion-section__items'>
                    <div className='item'>
                        <h3 className='item__title'>Регистрируйся</h3>
                        <p className='item__paragraph'>Никаких рассылок, только создание аккаунта.</p>
                    </div >
                    <div className='item'>
                        <h3 className='item__title'>Создавай правила</h3>
                        <p className='item__paragraph'>Добавляй название темы, краткое описание правила и примеры.</p>
                    </div>
                    <div className='item'>
                        <h3 className='item__title'>Добавляй категории</h3>
                        <p className='item__paragraph'>Можешь разделять изучаемые слова по категориям или сделать одну - общую</p>
                    </div>
                    <div className='item'>
                        <h3 className='item__title'>Добавляй слова</h3>
                        <p className='item__paragraph'>Добавляй слова или целые выражения</p>
                    </div>
                    <div className='item'>
                        <h3 className='item__title'>Повторяй</h3>
                        <p className='item__paragraph'>Повторяй добавленные слова и запоминай их все лучше</p>
                    </div>
                </div>
            </section>
        </main>
    )
}