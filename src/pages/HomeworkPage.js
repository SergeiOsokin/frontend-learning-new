import React, { useEffect, useState } from 'react';

import { useHttp } from '../hooks/http.hook';
import { useMessage } from '../hooks/message.hook';
import { Loader } from '../components/Loader';
import { Aside } from '../components/Aside';
import { useHistory } from 'react-router-dom/cjs/react-router-dom.min';
import { FooterInner } from '../components/Footer';

export const HomeworkPage = () => {
    const { loading, request } = useHttp();
    const [tasks, setTasks] = useState([]);
    const history = useHistory();
    const [inputValue, setInputValue] = useState('');

    const message = useMessage();

    function menuSearch() {
        let phrase = document.querySelector('.app-search__elem');
        let navItemTopics = document.querySelector('.app-cards__inner');
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
    };

    const handleChange = (e) => {
        setInputValue(e.target.value)
        menuSearch();
    };

    const getTasks = async function fetchData() {
        try {
            const data = await request('/homework/themes/all', 'GET', {});
            if (data.hasOwnProperty('error')) {
                message(data.message || data.error, false);
                return;
            }
            setTasks(data);
        } catch (error) {
            message(error, false)
        }
    }

    const handleOpenTask = (e) => {
        history.push(`/education/student/open/${e.target.closest('.app-cards__item').getAttribute('info')}`);
    }

    useEffect(() => {
        getTasks();
    }, []);

    return (
        <>
            <div className="app-inner">
                <Aside />

                <main className="app-main">
                    <header className="app-main__top">
                        <div className="app-main__left">
                            <h1 className="app-main__title">Обучение</h1>
                        </div>
                        <div className="app-main__right">
                            {/*  --th-empty для app-search */}
                            <div className="app-main__search app-search --th-active">
                                <input
                                    type="text"
                                    placeholder="Search text"
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
                        {!tasks.length && !loading &&
                            <section className="tasks-empty">
                                <div
                                    className="tasks-empty__img"
                                    alt="Empty"
                                />
                                <h2 className="tasks-empty__title">Здесь пока пусто</h2>
                            </section>

                        }
                        <section className="app-cards">
                            <ul className="app-cards__inner">
                                {tasks.map((task, index) => {
                                    return (
                                        <li className="app-cards__item" key={task.id} info={task.id}>
                                            <div className="card card-note --th-no-text">
                                                <div className="card-note__top">
                                                    <p className="card-note__date">
                                                        {
                                                            task.finished === true ?
                                                                <span className="tasks-yes__img" /> : <span className="tasks-timer__img" />
                                                        }

                                                        <span>{task.date_appoint ? task.date_appoint.substring(0, 10) : ''}</span>
                                                    </p>
                                                    <div className="card-note__actions">
                                                        <button className="card-note__btn" onClick={handleOpenTask}>
                                                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                                                                <path
                                                                    d="M21 12C21 13.2 16.97 18 12 18C7.03 18 3 13.2 3 12C3 10.8 7.03 6 12 6C16.97 6 21 10.8 21 12Z"
                                                                    stroke="currentColor"
                                                                    strokeWidth="2"
                                                                    strokeLinecap="round"
                                                                    strokeLinejoin="round"
                                                                />
                                                                <path
                                                                    d="M15 12C15 12.7956 14.6839 13.5587 14.1213 14.1213C13.5587 14.6839 12.7956 15 12 15C11.2044 15 10.4413 14.6839 9.87868 14.1213C9.31607 13.5587 9 12.7956 9 12C9 11.2044 9.31607 10.4413 9.87868 9.87868C10.4413 9.31607 11.2044 9 12 9C12.7956 9 13.5587 9.31607 14.1213 9.87868C14.6839 10.4413 15 11.2044 15 12Z"
                                                                    stroke="currentColor"
                                                                    strokeWidth="2"
                                                                    strokeLinecap="round"
                                                                    strokeLinejoin="round"
                                                                />
                                                            </svg>
                                                        </button>
                                                    </div>
                                                </div>
                                                <div className="card-note__content">
                                                    <h3 className="card-note__title">
                                                        {task.theme}
                                                    </h3>
                                                </div>
                                            </div>
                                        </li>
                                    )
                                })}
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