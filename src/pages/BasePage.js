import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom/cjs/react-router-dom.min';

import { useHttp } from '../hooks/http.hook';
import { useMessage } from '../hooks/message.hook';
import { Loader } from '../components/Loader';
import { Aside } from '../components/Aside';
import { autoResize } from '../hooks/autoResize.hook';
import { FooterInner } from '../components/Footer';
import { Header } from '../components/Header';

export const BasePage = () => {
    const { loading, request } = useHttp();
    const [inputValue, setInputValue] = useState('')

    // --th-opened --th-opened
    const handleEdit = (e) => {
        const target = e.target.closest('.task-step');
        // открыть / закрыть
        e.target.closest('.task-step').children[1].classList.toggle('--th-disabled')
        // черная рамка вокруг
        target.classList.toggle('--th-edited');
        // автоматическая высота
        target.querySelector('.app-area-text').style.height = target.querySelector('.app-area-text').scrollHeight + 'px';
    }

    function menuSearch() {
        let phrase = document.querySelector('.app-search__elem');
        let navItemTopics = document.querySelector('.task-more__list');
        let regPhrase = new RegExp(phrase.value, 'i');
        let flag = false;
        for (let i = 0; i < navItemTopics.children.length; i++) {
            flag = false;
            // проверяем, есть ли введенные символы в элемементах меню
            flag = regPhrase.test(navItemTopics.children[i].innerHTML);
            if (flag) {
                navItemTopics.children[i].style.display = "";
            } else {
                navItemTopics.children[i].style.display = "none";
            }
        }
    }

    const handleChange = (e) => {
        setInputValue(e.target.value)
        menuSearch();
    }

    return (
        <>
            <div className="app-inner">
                <Aside />

                <main className="app-main">
                    <header className="app-main__top base">
                        <div className="app-main__left">
                            <h1 className="app-main__title">Это база</h1>
                        </div>
                        <div className="app-main__right">
                            {/*  --th-empty для app-search */}
                            <div className="app-main__search app-search --th-active">
                                <input
                                    type="text"
                                    placeholder="Text"
                                    className="app-search__elem"
                                    id="search"
                                    autoComplete="off"
                                    onChange={handleChange}
                                    value={inputValue}
                                />
                                <button className="app-search__delete line-btn-dark" onClick={menuSearch}>
                                    <svg className="icon" viewBox="0 0 24 24" fill="none">
                                        <path
                                            d="M5 19L18.93 5M19 19L5.07 5"
                                            stroke="currentColor"
                                            strokeWidth={2}
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                        />
                                    </svg>
                                </button>
                                <div className="app-search__icon">
                                    <svg className="icon" viewBox="0 0 24 24" fill="none">
                                        <path
                                            d="M20 20L16.8889 16.8889M16.4444 10.2222C16.4444 11.0393 16.2835 11.8484 15.9708 12.6034C15.6581 13.3583 15.1998 14.0442 14.622 14.622C14.0442 15.1998 13.3583 15.6581 12.6034 15.9708C11.8484 16.2835 11.0393 16.4444 10.2222 16.4444C9.40511 16.4444 8.596 16.2835 7.84108 15.9708C7.08617 15.6581 6.40023 15.1998 5.82245 14.622C5.24466 14.0442 4.78633 13.3583 4.47364 12.6034C4.16094 11.8484 4 11.0393 4 10.2222C4 8.57199 4.65555 6.98934 5.82245 5.82245C6.98934 4.65555 8.57199 4 10.2222 4C11.8725 4 13.4551 4.65555 14.622 5.82245C15.7889 6.98934 16.4444 8.57199 16.4444 10.2222Z"
                                            stroke="currentColor"
                                            strokeWidth={2}
                                            strokeLinecap="round"
                                        />
                                    </svg>
                                </div>
                            </div>
                        </div>
                    </header>

                    {loading && <Loader />}

                    {!loading && <main className="app-main__mid">
                        <section className="task-more">
                            <h3 className="task-more__title">{ }</h3>
                            <ul className="task-more__list">
                                <li className="task-step" id='rules' onClick={handleEdit}>
                                    <div className="task-step__header">
                                        <h4 className="task-step__title">Артикли</h4>
                                        <svg className="task-step__icon" viewBox="0 0 16 9" fill="none">
                                            <path
                                                d="M15 1L8 8L1 1"
                                                stroke="#CDCDCD"
                                                strokeWidth={2}
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                            />
                                        </svg>
                                    </div>
                                    <div className="task-step__body body_rules --th-disabled">
                                        <p className="task-step__text">
                                            <textarea
                                                className=" app-area-text rules"
                                                placeholder="Название"

                                                type="text"
                                                name="rules"
                                                defaultValue={`Артикль a/an (an используется перед гласными) может употребляться только с существительными в единственном числе.
A/an указывает на то, что речь идет о предмете впервые, а the ― на то, что предмет нам уже знаком.
📝 Если вместо a/an можно сказать "один из" или "какой-то", то используйте a/an, если вместо the можно сказать "тот самый" или "те самые", то используйте the.
`
                                                }
                                                autoComplete="off"
                                                disabled={true}
                                                required maxLength="2000"
                                            />
                                        </p>
                                    </div>
                                </li>
                                <li className="task-step" id='words' onClick={handleEdit}>
                                    <div className="task-step__header">
                                        <h4 className="task-step__title">Present Simple</h4>
                                        <svg className="task-step__icon" viewBox="0 0 16 9" fill="none">
                                            <path
                                                d="M15 1L8 8L1 1"
                                                stroke="#CDCDCD"
                                                strokeWidth={2}
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                            />
                                        </svg>
                                    </div>
                                    <div className="task-step__body body_words --th-disabled">
                                        <p className="task-step__text">
                                            <textarea
                                                className=" app-area-text words"
                                                placeholder="Название"

                                                type="text"
                                                name="words"
                                                defaultValue={`Используется для: 
●	описания регулярного, повторяющегося действия. 
👉 Пример: I drink coffee every day. — Я пью кофе каждый день.
●	рассказа о каком-то факте. 
👉 Пример: The sea is salty — Море соленое.
●	будущее время, если речь идёт о чем-то по расписанию 
👉 Пример: The film starts at 10. — Фильм начинается в 10.
📝 Маркеры: usually (обычно), often (часто), never (никогда), always (всегда), sometimes (иногда), every day (каждый день), rarely (редко).
Форма образования: Основная форма глагола V1`}
                                                autoComplete="off"
                                                disabled={true}
                                                required maxLength="200"
                                            />
                                        </p>
                                    </div>
                                </li>
                                <li className="task-step" id='read' onClick={handleEdit}>
                                    <div className="task-step__header">
                                        <h4 className="task-step__title">Past Simple</h4>
                                        <svg className="task-step__icon" viewBox="0 0 16 9" fill="none">
                                            <path
                                                d="M15 1L8 8L1 1"
                                                stroke="#CDCDCD"
                                                strokeWidth={2}
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                            />
                                        </svg>
                                    </div>
                                    <div className="task-step__body body_read --th-disabled">
                                        <p className="task-step__text">
                                            <textarea
                                                className=" app-area-text read"
                                                placeholder="Название"

                                                type="text"
                                                name="read"
                                                defaultValue={`Используется для:  
●	рассказа о прошлом действии, когда известно когда это произошло.  
👉 Пример: I bought this book yesterday. — Я купила эту книгу вчера. 
●	рассказ о действии, которое повторялось в прошлом. Например, привычки.
👉 Пример: I rode my bike to work every day. — Каждый день я ездил на работу на своём велосипеде.
●	рассказа историй.  
👉 Пример: He viewed my profile on LinkedIn. Soon afterwards, I received a message with an invitation for an interview. — Он просмотрел мой профиль на LinkedIn. Вскоре после этого я получил сообщение с приглашением на собеседование.
📝 Маркеры: yesterday (вчера), an hour ago (час назад), last week (на прошлой неделе), the other (day на днях), in 2023 (в 2023 году). 
Форма образования: V2 (-ed) `}
                                                autoComplete="off"
                                                disabled={true}
                                                required maxLength="500"
                                            />
                                        </p>
                                    </div>
                                </li>
                                <li className="task-step" id='translate' onClick={handleEdit}>
                                    <div className="task-step__header">
                                        <h4 className="task-step__title">Future Simple</h4>
                                        <svg className="task-step__icon" viewBox="0 0 16 9" fill="none">
                                            <path
                                                d="M15 1L8 8L1 1"
                                                stroke="#CDCDCD"
                                                strokeWidth={2}
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                            />
                                        </svg>
                                    </div>
                                    <div className="task-step__body body_translate --th-disabled">
                                        <p className="task-step__text">
                                            <textarea
                                                className=" app-area-text translate"
                                                placeholder="Название"

                                                type="text"
                                                name="translate"
                                                defaultValue={`Используется для:  
●	описания событий, которые будут происходить в будущем.   
👉 Пример: : I will probably go to Europe next year. — В следующем году я возможно отправлюсь в Европу. 
●	описания будущего факта.  
👉 Пример: The sun will rise at 6 a.m. tomorrow. — Солнце взойдёт завтра в 6 утра.
●	описания предположения или прогнозов.   
👉 Пример: I think she will win the competition . — Я думаю, она победит в соревновании.
●	описания намерения возникшее в момент речи (спонтанное решение).   
👉 Пример: I’m thirsty. I will buy some water - Я хочу пить. Куплю воды.
📝 Маркеры: tomorrow (завтра), tonight (сегодня вечером), soon (скоро), next time (в следующий раз), in five years (через пять лет), in 2025 (в 2025 году). 
Форма образования: will + V1 `}
                                                autoComplete="off"
                                                disabled={true}
                                                required maxLength="500"
                                            />
                                        </p>
                                    </div>
                                </li>
                                <li className="task-step" id='other' onClick={handleEdit}>
                                    <div className="task-step__header">
                                        <h4 className="task-step__title">Present Continuous</h4>
                                        <svg className="task-step__icon" viewBox="0 0 16 9" fill="none">
                                            <path
                                                d="M15 1L8 8L1 1"
                                                stroke="#CDCDCD"
                                                strokeWidth={2}
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                            />
                                        </svg>
                                    </div>
                                    <div className="task-step__body body_other --th-disabled">
                                        <p className="task-step__text">
                                            <textarea
                                                className=" app-area-text other"
                                                placeholder="Название"

                                                type="text"
                                                name="other"
                                                defaultValue={`Используется для:  
● описания действий, происходящих в настоящий момент или в текущий период времени. 
👉 Пример: I'm covering for Lana this week because she's sick. — Я подменяю Лану на неделе, потому что она болеет.
● сообщить о заранее намеченных планах или твёрдых намерениях на будущее.. 
👉Пример: I am going on vacation in September. — Я поеду в отпуск в сентябре.
● обозначения процессов, которые развиваются или меняются прямо сейчас.
👉 Пример: The edtech market is growing rapidly — EdTech-рынок растёт стремительно.
● выразить недовольство или раздражение по поводу чьих‑либо повторяющихся действий.. 
👉 Пример: She's always trying to make me do her job for her. — Она всегда пытается заставить меня делать за неё её работу. 
📝 Маркеры: all day (весь день), this week (на этой неделе), all the time (всё время), always (всегда), constantly (постоянно). 
Форма образования: to be + Ving.`}
                                                autoComplete="off"
                                                disabled={true}
                                                required maxLength="300"
                                            />
                                        </p>
                                    </div>
                                </li>
                                <li className="task-step" id='other' onClick={handleEdit}>
                                    <div className="task-step__header">
                                        <h4 className="task-step__title">Past Continuous</h4>
                                        <svg className="task-step__icon" viewBox="0 0 16 9" fill="none">
                                            <path
                                                d="M15 1L8 8L1 1"
                                                stroke="#CDCDCD"
                                                strokeWidth={2}
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                            />
                                        </svg>
                                    </div>
                                    <div className="task-step__body body_other --th-disabled">
                                        <p className="task-step__text">
                                            <textarea
                                                className=" app-area-text other"
                                                placeholder="Название"

                                                type="text"
                                                name="other"
                                                defaultValue={`Используется для: 
●	описания действия, которое продолжалось в течение определённого периода в прошлом.  
👉 Пример: I was reading this book all day yesterday. — Я вчера целый день читала эту книгу. 
●	подчеркнуть, что действие находилось в процессе выполнения в конкретный момент в прошлом.  
👉  Пример: I was eating yesterday at 7 p.m. — Вчера в 7 часов вечера я ел.
📝 Маркеры: all day (весь день), all the time (всё время). 
Форма образования: was/were + Ving. `}
                                                autoComplete="off"
                                                disabled={true}
                                                required maxLength="300"
                                            />
                                        </p>
                                    </div>
                                </li>
                                <li className="task-step" id='other' onClick={handleEdit}>
                                    <div className="task-step__header">
                                        <h4 className="task-step__title">Future Continuous</h4>
                                        <svg className="task-step__icon" viewBox="0 0 16 9" fill="none">
                                            <path
                                                d="M15 1L8 8L1 1"
                                                stroke="#CDCDCD"
                                                strokeWidth={2}
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                            />
                                        </svg>
                                    </div>
                                    <div className="task-step__body body_other --th-disabled">
                                        <p className="task-step__text">
                                            <textarea
                                                className=" app-area-text other"
                                                placeholder="Название"

                                                type="text"
                                                name="other"
                                                defaultValue={`Используется для:
●	рассказа о действии, которое будет длиться в определённый момент в будущем. 
👉 Пример: Tomorrow morning I will be taking the English exam. — Завтра утром я буду сдавать экзамен по английскому языку. 
📝 Маркеры: tomorrow morning (завтра утром), all day tomorrow (целый день завтра), next week (на следующей неделе).
Форма образования: will be + Ving.`}
                                                autoComplete="off"
                                                disabled={true}
                                                required maxLength="300"
                                            />
                                        </p>
                                    </div>
                                </li>
                                <li className="task-step" id='other' onClick={handleEdit}>
                                    <div className="task-step__header">
                                        <h4 className="task-step__title">Present Perfect</h4>
                                        <svg className="task-step__icon" viewBox="0 0 16 9" fill="none">
                                            <path
                                                d="M15 1L8 8L1 1"
                                                stroke="#CDCDCD"
                                                strokeWidth={2}
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                            />
                                        </svg>
                                    </div>
                                    <div className="task-step__body body_other --th-disabled">
                                        <p className="task-step__text">
                                            <textarea
                                                className=" app-area-text other"
                                                placeholder="Название"

                                                type="text"
                                                name="other"
                                                defaultValue={`Используется для: 
●	описания личного опыта.   
👉 Пример: I have been to Italy twice. — Я два раза была в Италии.
●	рассказа о результате.   
👉 Пример: My car has broken down. — Моя машина сломалась.
●	описания достижений.   
👉 Пример: He has won 15 gold medals. — Он завоевал 15 золотых медалей.
●	описания действия или состояния, которое началось в прошлом и не закончилось до сих пор.   
👉 Пример: I've lived here since 2015 — Я живу здесь с 2015 года. 
📝 Маркеры: never (никогда), yet (ещё), already (уже), recently (недавно).
Форма образования: have/has + V3 (-ed)`}
                                                autoComplete="off"
                                                disabled={true}
                                                required maxLength="300"
                                            />
                                        </p>
                                    </div>
                                </li>
                                <li className="task-step" id='other' onClick={handleEdit}>
                                    <div className="task-step__header">
                                        <h4 className="task-step__title">Past Perfect</h4>
                                        <svg className="task-step__icon" viewBox="0 0 16 9" fill="none">
                                            <path
                                                d="M15 1L8 8L1 1"
                                                stroke="#CDCDCD"
                                                strokeWidth={2}
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                            />
                                        </svg>
                                    </div>
                                    <div className="task-step__body body_other --th-disabled">
                                        <p className="task-step__text">
                                            <textarea
                                                className=" app-area-text other"
                                                placeholder="Название"

                                                type="text"
                                                name="other"
                                                defaultValue={`Используется для:
●	рассказа о действии, которое закончилось к определённому моменту в прошлом или перед началом другого действия в прошлом.  
👉 Пример: She had returned home before they woke up. — Она вернулась домой к моменту, когда они проснулись. 
📝 Маркеры: before (до), by that time (к тому времени), by August (к августу).
Форма образования: had + V3 (-ed)`}
                                                autoComplete="off"
                                                disabled={true}
                                                required maxLength="300"
                                            />
                                        </p>
                                    </div>
                                </li>
                                <li className="task-step" id='other' onClick={handleEdit}>
                                    <div className="task-step__header">
                                        <h4 className="task-step__title">Future Perfect</h4>
                                        <svg className="task-step__icon" viewBox="0 0 16 9" fill="none">
                                            <path
                                                d="M15 1L8 8L1 1"
                                                stroke="#CDCDCD"
                                                strokeWidth={2}
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                            />
                                        </svg>
                                    </div>
                                    <div className="task-step__body body_other --th-disabled">
                                        <p className="task-step__text">
                                            <textarea
                                                className=" app-area-text other"
                                                placeholder="Название"

                                                type="text"
                                                name="other"
                                                defaultValue={`Используется для: 
● описание действия, которое завершится к определённому моменту в будущем.
👉 Пример: I will have finished my essay by tomorrow. — Я завершу своё эссе к завтрашнему дню. 
📝 Маркеры: by tomorrow / tuesday и т.д (к завтрашнему дню, вторнику), by August (к августу)
Форма образования: will have + V3 (-ed)`}
                                                autoComplete="off"
                                                disabled={true}
                                                required maxLength="300"
                                            />
                                        </p>
                                    </div>
                                </li>
                                <li className="task-step" id='other' onClick={handleEdit}>
                                    <div className="task-step__header">
                                        <h4 className="task-step__title">Present Perfect Continuous</h4>
                                        <svg className="task-step__icon" viewBox="0 0 16 9" fill="none">
                                            <path
                                                d="M15 1L8 8L1 1"
                                                stroke="#CDCDCD"
                                                strokeWidth={2}
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                            />
                                        </svg>
                                    </div>
                                    <div className="task-step__body body_other --th-disabled">
                                        <p className="task-step__text">
                                            <textarea
                                                className=" app-area-text other"
                                                placeholder="Название"

                                                type="text"
                                                name="other"
                                                defaultValue={`Используется для: 
● описания действия, которое началось и длилось какое-то время в прошлом и всё ещё длится в настоящем, или если действие закончилось недавно — и виден результат.
👉 Пример: He has been working since early morning. — Он работает с раннего утра (работает до сих пор, ещё не закончил). 
● Указывает на повторяющееся действие — оно началось в прошлом и всё ещё продолжается в момент речи.
👉 Пример: Alice has been attending yoga classes every Wednesday for the past year. — Весь прошлый год Элис ходила на занятия йогой каждую среду. 
📝 Маркеры: for (в течение) и since (с тех пор). 
Форма образования: have/has been + Ving`}
                                                autoComplete="off"
                                                disabled={true}
                                                required maxLength="300"
                                            />
                                        </p>
                                    </div>
                                </li>
                                <li className="task-step" id='other' onClick={handleEdit}>
                                    <div className="task-step__header">
                                        <h4 className="task-step__title">Past Perfect Continuous</h4>
                                        <svg className="task-step__icon" viewBox="0 0 16 9" fill="none">
                                            <path
                                                d="M15 1L8 8L1 1"
                                                stroke="#CDCDCD"
                                                strokeWidth={2}
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                            />
                                        </svg>
                                    </div>
                                    <div className="task-step__body body_other --th-disabled">
                                        <p className="task-step__text">
                                            <textarea
                                                className=" app-area-text other"
                                                placeholder="Название"
                                                type="text"
                                                name="other"
                                                defaultValue={`Используется для: 
● описания действия, которое началось в прошлом, продолжалось какое-то время и закончилось перед неким моментом в прошлом.
👉  Пример: I had been waiting for two hours when he called me. — Я ждала уже два часа, когда он позвонил мне.
📝 Маркеры:  for (в течение) и since (с тех пор).
Форма образования: had been + Ving`}
                                                autoComplete="off"
                                                disabled={true}
                                                required maxLength="300"
                                            />
                                        </p>
                                    </div>
                                </li>
                                <li className="task-step" id='other' onClick={handleEdit}>
                                    <div className="task-step__header">
                                        <h4 className="task-step__title">Базовая структура предложений</h4>
                                        <svg className="task-step__icon" viewBox="0 0 16 9" fill="none">
                                            <path
                                                d="M15 1L8 8L1 1"
                                                stroke="#CDCDCD"
                                                strokeWidth={2}
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                            />
                                        </svg>
                                    </div>
                                    <div className="task-step__body body_other --th-disabled">
                                        <p className="task-step__text">
                                            <textarea
                                                className=" app-area-text other"
                                                placeholder="Название"

                                                type="text"
                                                name="other"
                                                defaultValue={`Базовый порядок в английском: субъект (С) – глагол (Г) – объект/дополнение (О/Д)
                                                    👉 Пример: Простое утвердительное С + Г + О/Д — I read books
                                                    👉 Пример: Вопросительное Do/Does/Did + С + Г + О/Д — Do you read books?
                                                    👉 Пример: Отрицательное С + do/does/did not + Г + О/Д — I don't read books
                                                    👉 Пример: С модальным глаголом С + Modal + Г + С/Д — I can read books
                                                    `}
                                                autoComplete="off"
                                                disabled={true}
                                                required maxLength="300"
                                            />
                                        </p>
                                    </div>
                                </li>
                                <li className="task-step" id='other' onClick={handleEdit}>
                                    <div className="task-step__header">
                                        <h4 className="task-step__title">Множественное число</h4>
                                        <svg className="task-step__icon" viewBox="0 0 16 9" fill="none">
                                            <path
                                                d="M15 1L8 8L1 1"
                                                stroke="#CDCDCD"
                                                strokeWidth={2}
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                            />
                                        </svg>
                                    </div>
                                    <div className="task-step__body body_other --th-disabled">
                                        <p className="task-step__text">
                                            <textarea
                                                className=" app-area-text other"
                                                placeholder="Название"
                                                type="text"
                                                name="other"
                                                defaultValue={`Есть несколько вариантов образования множественного числа: 
● Базовое правило, добавить к существительному -s
👉 Пример: cat -> catS
● Если слово заканчивается на -s, -ss, -sh, -ch, -x, -o, добавляется окончание -es
👉 Пример: box -> boxes
● Если слово заканчивается на согласную + y, y меняется на i и добавляется -es
👉 Пример: country -> countries
● Если слово оканчивается на -f или -fe, f меняется на v и добавляется -es
👉 Пример: knife -> knives
● Исключения
👉 Пример: man -> men; child -> children; woman -> women; foot -> feet; tooth -> teeth`}
                                                autoComplete="off"
                                                disabled={true}
                                                required maxLength="300"
                                            />
                                        </p>
                                    </div>
                                </li>
                                <li className="task-step" id='other' onClick={handleEdit}>
                                    <div className="task-step__header">
                                        <h4 className="task-step__title">Модальные глаголы</h4>
                                        <svg className="task-step__icon" viewBox="0 0 16 9" fill="none">
                                            <path
                                                d="M15 1L8 8L1 1"
                                                stroke="#CDCDCD"
                                                strokeWidth={2}
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                            />
                                        </svg>
                                    </div>
                                    <div className="task-step__body body_other --th-disabled">
                                        <p className="task-step__text">
                                            <textarea
                                                className=" app-area-text other"
                                                placeholder="Название"
                                                type="text"
                                                name="other"
                                                defaultValue={`Modal verbs (модальные глаголы) в английском — вспомогательные глаголы, передающие отношение к действию (возможность, необходимость, способность, вероятность, разрешение/запрет). 
●	Основные модальные глаголы:
Can/Could — возможность, способность, разрешение
May/Might — разрешение, вероятность
Must — необходимость, обязанность, строгий запрет
Should — совет, рекомендация, мягкое обязательство
Would — вежливая просьба, предпочтение, условие.   
👉 Пример: 
"I can speak English" (способность)
"You should see a doctor" (совет)
"Students must wear uniforms" (обязанность)
"May I come in?" (просьба о разрешении)
"It might rain tomorrow" (вероятность)
📝 Особенности: 
- После модального глагола всегда используется базовая (начальная) форма глагола без  to: She can swim (не "to swim").
- Модальные глаголы не изменяются от местоимений: I/You/He/She/We/They must go.
- Вопросительные и отрицательные формы образуются без вспомогательных глаголов: Can you help me? I cannot help you.. (не "Do can you help me")
`}
                                                autoComplete="off"
                                                disabled={true}
                                                required maxLength="300"
                                            />
                                        </p>
                                    </div>
                                </li>
                            </ul>
                        </section>
                    </main>
                    }
                    <FooterInner />
                </main>
            </div>
        </>
    )
};