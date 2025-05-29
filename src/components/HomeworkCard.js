import React, { useState, useCallback, useEffect } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { useHttp } from '../hooks/http.hook';
import { Loader } from './Loader';
import { useMessage } from '../hooks/message.hook';
import timerImg from '../images/statuses/timer.webp';
import yesImg from "../images/statuses/yes.webp"

import linkifyHtml from 'linkify-html';
import { Aside } from './Aside';
import { autoResize } from '../hooks/autoResize.hook';
import { FooterInner } from './Footer';
import { MobileMenu } from './MobileMenu';

// setChanged, change меняем, чтобы заставить navnotetheme вызывать useEffect 
// и обновлять динамично пункты меню после изменения
export const HomeworkCard = () => {

    const history = useHistory();
    const message = useMessage();
    const { loading, request } = useHttp();
    const [task, setTask] = useState({
        id: '',
        theme: '',
        words: '',
        rules: '',
        read: '',
        translate: '',
        other: '',
        date: '',
        finished: ''
    });
    //  

    // --th-opened --th-opened
    const handleEdit = (e) => {
        switch (e.target.id) {
            case 'rules':
                document.querySelector('.body_rules').classList.toggle('--th-disabled');
                e.target.closest('.task-step').classList.toggle('--th-edited');
                autoResize(e.target.id);
                break;
            case 'words':
                document.querySelector('.body_words').classList.toggle('--th-disabled');
                e.target.closest('.task-step').classList.toggle('--th-edited');
                autoResize(e.target.id);
                break;
            case 'read':
                document.querySelector('.body_read').classList.toggle('--th-disabled');
                e.target.closest('.task-step').classList.toggle('--th-edited');
                autoResize(e.target.id);
                break;
            case 'translate':
                document.querySelector('.body_translate').classList.toggle('--th-disabled');
                e.target.closest('.task-step').classList.toggle('--th-edited');
                autoResize(e.target.id);
                break;
            case 'other':
                document.querySelector('.body_other').classList.toggle('--th-disabled');
                e.target.closest('.task-step').classList.toggle('--th-edited');
                autoResize(e.target.id);
                break;
            default:

        }
    }

    const handleFinished = (async (e) => {
        console.log(task.id)
        e.preventDefault();
        try {
            const data = await request(`/homework/finised/${task.id}`, 'POST');
            if (data.hasOwnProperty('error')) {
                message(data.message || data.error, false);
                return;
            }
            message(data.message, true);
            setTask({ ...task, finished: true })
        } catch (err) {
            message(err, false);
        }
    });

    function searchLink() {
        document.querySelectorAll('.task-step__text').forEach((el, ind) => {
            // el.textContent);
            let beforeEl = linkifyHtml(el.textContent)
            let afterEl = el

            afterEl.innerHTML = beforeEl;
        });

        // const beforeEl = linkifyHtml(document.querySelector('.task-step__text').textContent)
        // const afterEl = document.querySelector('.task-step__text')

        // afterEl.innerHTML = beforeEl;
    };

    const getTask = async function fetchData() {
        try {
            const data = await request(`/homework/theme/${parseInt(history.location.pathname.match(/\d+/))}`, 'GET', {});
            if (data.hasOwnProperty('error')) {
                message(data.message || data.error, false);
                return;
            }
            setTask({
                id: data[0].id,
                theme: data[0].theme,
                words: data[0].words,
                rules: data[0].rules,
                read: data[0].read,
                translate: data[0].translate,
                other: data[0].other,
                date: data[0].date_appoint,
                finished: data[0].finished,
            });
        } catch (error) {
            message(error, false);
        }
    }

    useEffect(() => {
        getTask();
    }, [])

    return (
        <>
            {loading && <Loader />}
            <>
                <div className="app-inner">
                    <Aside />

                    <main className="app-main">
                        <header className="app-main__top">
                            <div className="app-main__left">
                                <Link to="/education/student" className="app-main__back">
                                    <svg viewBox="0 0 6 10" fill="none">
                                        <path
                                            d="M5 9L1 5L5 1"
                                            stroke="#939393"
                                            strokeWidth={2}
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                        />
                                    </svg>
                                    <span>Все задания</span>
                                </Link>
                                <h1 className="app-main__title">Обучение - {task.theme}</h1>
                            </div>
                            <div className="app-main__right">
                                <div className="app-main__search search" />
                            </div>
                        </header>
                        <main className="app-main__mid">
                            <section className="task-more">
                                <div className="task-more__date date-status">
                                    <img src={task.finished === true ? yesImg : timerImg} alt="" />
                                    <span>{task.date}</span>
                                </div>
                                <h3 className="task-more__title">{task.theme}</h3>
                                <ul className="task-more__list">
                                    <li className="task-step" id='rules' onClick={handleEdit}>
                                        <div className="task-step__header">
                                            <h4 className="task-step__title">Грамматика</h4>
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
                                                    defaultValue={task.rules}
                                                    autoComplete="off"
                                                    disabled={loading}
                                                    required maxLength="2000"
                                                />
                                            </p>
                                        </div>
                                    </li>
                                    <li className="task-step" id='words' onClick={handleEdit}>
                                        <div className="task-step__header">
                                            <h4 className="task-step__title">Лексика</h4>
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
                                                    defaultValue={task.words}
                                                    autoComplete="off"
                                                    disabled={loading}
                                                    required maxLength="200"
                                                />
                                            </p>
                                        </div>
                                    </li>
                                    <li className="task-step" id='read' onClick={handleEdit}>
                                        <div className="task-step__header">
                                            <h4 className="task-step__title">Чтение и письмо</h4>
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
                                                    defaultValue={task.read}
                                                    autoComplete="off"
                                                    disabled={loading}
                                                    required maxLength="500"
                                                />
                                            </p>
                                        </div>
                                    </li>
                                    <li className="task-step" id='translate' onClick={handleEdit}>
                                        <div className="task-step__header">
                                            <h4 className="task-step__title">Аудирование и видео</h4>
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
                                                    defaultValue={task.translate}
                                                    autoComplete="off"
                                                    disabled={loading}
                                                    required maxLength="500"
                                                />
                                            </p>
                                        </div>
                                    </li>
                                    <li className="task-step" id='other' onClick={handleEdit}>
                                        <div className="task-step__header">
                                            <h4 className="task-step__title">Дополнительные материалы</h4>
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
                                                    defaultValue={task.other}
                                                    autoComplete="off"
                                                    disabled={loading}
                                                    required maxLength="300"
                                                />
                                            </p>
                                        </div>
                                    </li>
                                </ul>
                                <div className="task-more__actions">
                                    {/* <button className="task-more__remove btn btn-red">
                                        <svg className="icon" viewBox="0 0 24 24">
                                            <path
                                                d="M5 7H19M10 10V18M14 10V18M10 3H14C14.2652 3 14.5196 3.10536 14.7071 3.29289C14.8946 3.48043 15 3.73478 15 4V7H9V4C9 3.73478 9.10536 3.48043 9.29289 3.29289C9.48043 3.10536 9.73478 3 10 3ZM6 7H18V20C18 20.2652 17.8946 20.5196 17.7071 20.7071C17.5196 20.8946 17.2652 21 17 21H7C6.73478 21 6.48043 20.8946 6.29289 20.7071C6.10536 20.5196 6 20.2652 6 20V7Z"
                                                stroke="currentColor"
                                                fill="none"
                                                strokeWidth={2}
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                            />
                                        </svg>
                                        <span>Удалить</span>
                                    </button> */}
                                    <div className="app-toggle-wrapper">
                                        <div className="app-toggle">
                                            <input
                                                id="checkbox"
                                                type="checkbox"
                                                className="app-toggle__input"
                                                onClick={handleFinished}
                                                disabled={task.finished}
                                                checked={task.finished}
                                            />
                                            <div className="app-toggle__elem" />
                                        </div>
                                        <label className="app-toggle-label" htmlFor="checkbox">
                                            Выполнено
                                        </label>
                                    </div>
                                    <div className="app-toggle-wrapper" onClick={searchLink}>
                                        <div className="app-toggle">
                                            <input
                                                id="checkbox"
                                                type="checkbox"
                                                className="app-toggle__input"
                                            />
                                            <div className="app-toggle__elem" />
                                        </div>
                                        <label className="app-toggle-label" htmlFor="checkbox">
                                            Показать ссылки
                                        </label>
                                    </div>
                                </div>
                                {/* <button className="task-more__remove btn btn-red">
                                    <svg className="icon" viewBox="0 0 24 24">
                                        <path
                                            d="M5 7H19M10 10V18M14 10V18M10 3H14C14.2652 3 14.5196 3.10536 14.7071 3.29289C14.8946 3.48043 15 3.73478 15 4V7H9V4C9 3.73478 9.10536 3.48043 9.29289 3.29289C9.48043 3.10536 9.73478 3 10 3ZM6 7H18V20C18 20.2652 17.8946 20.5196 17.7071 20.7071C17.5196 20.8946 17.2652 21 17 21H7C6.73478 21 6.48043 20.8946 6.29289 20.7071C6.10536 20.5196 6 20.2652 6 20V7Z"
                                            stroke="currentColor"
                                            fill="none"
                                            strokeWidth={2}
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                        />
                                    </svg>
                                    <span>Удалить</span>
                                </button> */}
                            </section>
                        </main>
                        <FooterInner />
                    </main>
                </div>
                {/* <MobileMenu /> */}
            </>

        </>
    )
}