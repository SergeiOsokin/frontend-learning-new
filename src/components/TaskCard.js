import React, { useState, useCallback, useEffect } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { useHttp } from '../hooks/http.hook';
import { Loader } from './Loader';
import { useMessage } from '../hooks/message.hook';
import trashIcon from '../../src/img/trash_icon.png';
import { NoteFormChange } from './NoteFormChange';
import { TaskFormChange } from './TaskFormChange';
import { AppointForm } from './AppointForm';
import { validation } from '../hooks/validation.hook';
import { Aside } from '../components/Aside';
import { autoResize } from '../hooks/autoResize.hook';
// setChanged, change меняем, чтобы заставить navnotetheme вызывать useEffect 
// и обновлять динамично пункты меню после изменения
export const TaskCard = () => {
    const message = useMessage();
    const history = useHistory();
    const { loading, request } = useHttp();
    const { validationInputs } = validation();
    const [taskForm, setTaskFormActive] = useState(false);
    const [appointForm, setAppointFormActive] = useState(false);
    const [deleteModal, setDeleteModal] = useState(false);
    const [task, setTask] = useState({
        id: '',
        theme: '',
        words: '',
        rules: '',
        read: '',
        translate: '',
        other: '',
        users: [],
        date: `${new Date().getFullYear()}-${new Date().getMonth() + 1}-${new Date().getDate()}`
    });
    const [user, setUser] = useState({
        users: ''
    });

    const [userDelete, setUserDelete] = useState({
        user: ''
    });

    const getTask = async function fetchData() {
        try {
            const data = await request(`/task/theme/${parseInt(history.location.pathname.match(/\d+/))}`, 'GET', {});
            if (data === undefined) {
                return
            }
            message(data.message);
            setTask({
                id: data[0].id,
                theme: data[0].theme,
                words: data[0].words,
                rules: data[0].rules,
                read: data[0].read,
                translate: data[0].translate,
                other: data[0].other,
                users: data[0].users,
                date: `${new Date().getFullYear()}-${new Date().getMonth() + 1}-${new Date().getDate()}`
            })
        } catch (e) {
            message(e);
        }
    }

    const handleSubmitDelete = useCallback(async (e) => {
        try {
            const data = await request(`/task/delete/${task.id}`, 'DELETE', {});
            message(data.message);
            console.log(data.message)
            setDeleteModal(false);
            history.push('/education/teacher')
        } catch (e) {
            message(e);
        }
    }, [task]);

    const appointTask = (async (e) => {
        e.preventDefault()
        try {
            const data = await request(`/task/appoint/${task.id}`, 'POST', user);
            if (data === undefined) {
                return
            }
            getTask();
        } catch (err) {
            message(err);
        }
    });

    const handleDeleteUser = useCallback(async (e) => {
        e.preventDefault();
        try {
            const data = await request(`/task/unappoint/${task.id}`, 'POST', {
                user: e.target.closest('.pin').getAttribute('user')
            });
            if (data === undefined) {
                return
            }
            getTask();
        } catch (err) {
            message(err);
        }
    }, [task])

    const changeHandler = (e) => {
        setTask({ ...task, [e.target.name]: e.target.value });
        if (e.target.type === 'textarea') { autoResize(e.target.name) }
        // autoResize(e.target.name)
        // validationInputs(e);
    }

    const changeHandlerUser = (e) => {
        setUser({ ...user, [e.target.name]: e.target.value });
        // if (e.target.type === 'textarea') { autoResize(e.target.name) }
        // autoResize(e.target.name)
        // validationInputs(e);
    }

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
            case 'users':
                document.querySelector('.body_users').classList.toggle('--th-disabled');
                e.target.closest('.task-step').classList.toggle('--th-edited');
                autoResize(e.target.id);
                break;
            default:

        }
    }

    const handleSubmit = (async (e) => {
        console.log(task.id)
        e.preventDefault()
        try {
            const data = await request(`/task/patch/${task.id}`, 'PATCH', task);
            if (data === undefined) {
                return
            }
            message(data.message);
            console.log(data.message)
        } catch (err) {
            message(err);
        }
    });

    const handleCancel = () => {
        history.push('/education/teacher')
    }

    useEffect(() => {
        getTask();
    }, [])

    return (
        <>
            {loading && <Loader />}
            {/* {!loading &&
                <main className="main-content" info={`${task.id}`}>
                    <div className="main-content__control-panel">
                        <button className="control-panel__appoint-button button" onClick={appointTask}>Назначить</button>
                        <button className="control-panel__edit-button button" onClick={patchTask}>Редактировать</button>
                        <button
                            className="control-panel__delete-button"
                            onClick={deleteTask}
                        ><img className="trash-icon" src={trashIcon} alt="Удалить"></img></button>
                    </div>
                    <h1 className="note__title"> <span>{task.theme} </span></h1>

                    <p className="">Грамматика:</p>
                    <div className="note__example">
                        {task.rules}
                    </div>

                    <p className="">Лексика:</p>
                    <div className="note__example">
                        {task.words}
                    </div>

                    <p className="">Чтение и Письмо:</p>
                    <div className="note__example">
                        {task.read}
                    </div>

                    <p className="">Аудирование и Видео:</p>
                    <div className="note__example">
                        {task.translate}
                    </div>

                    <p className="">Дополнительные материалы:</p>
                    <div className="note__example">
                        {task.other}
                    </div>
                    <p className="">Назначено:</p>
                    <div className="note__example">
                        {task.users.join(', ')}
                    </div>

                </main>
            }
            {taskForm && <TaskFormChange props={task} setActive={setTaskFormActive} set={set} chan={chan} />}
            {appointForm && <AppointForm props={task} setActive={setAppointFormActive} />} */}
            <div className="app-inner">
                <Aside />
                {!loading &&
                    <main className="app-main">
                        <header className="app-main__top">
                            <div className="app-main__left">
                                <Link to="/education/teacher" className="app-main__back">
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
                                <h1 className="app-main__title">Задание: {task.theme}</h1>
                            </div>
                            <div className="app-main__right">
                                <div className="app-main__search search" />
                            </div>
                        </header>
                        <main className="app-main__mid">
                            <section className="task-more">
                                <div className="task-more__date date-status">
                                    <span>{task.date}</span>
                                </div>
                                <div className="task-more__title">
                                    <input
                                        className="task-more__area app-area-text --th-bold"
                                        placeholder="Название"
                                        id="theme"
                                        type="text"
                                        name="theme"
                                        onChange={changeHandler}
                                        required maxLength="30"
                                        value={task.theme}
                                        autoComplete="off"
                                        disabled={loading}
                                    />
                                </div>
                                <ul className="task-more__list">
                                    <li className="task-step --th-creator --th-edited" id='users' onClick={handleEdit}>
                                        <div className="task-step__header">
                                            <h4 className="task-step__title">Назначить учеников</h4>
                                            {/* <svg className=" task-step__icon" viewBox="0 0 24 24" fill="none">
                                                    <path
                                                        d="M5 7H19M10 10V18M14 10V18M10 3H14C14.2652 3 14.5196 3.10536 14.7071 3.29289C14.8946 3.48043 15 3.73478 15 4V7H9V4C9 3.73478 9.10536 3.48043 9.29289 3.29289C9.48043 3.10536 9.73478 3 10 3ZM6 7H18V20C18 20.2652 17.8946 20.5196 17.7071 20.7071C17.5196 20.8946 17.2652 21 17 21H7C6.73478 21 6.48043 20.8946 6.29289 20.7071C6.10536 20.5196 6 20.2652 6 20V7Z"
                                                        stroke="currentColor"
                                                        strokeWidth={2}
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                    />
                                                </svg> */}
                                        </div>
                                        {/* --th-disabled */}
                                        <div className="task-step__body body_users ">
                                            <ul className="task-step__pins pins-wrapper">
                                                <li className="pin --th-focus --th-creator">

                                                    <button className="" onClick={appointTask}>
                                                        <svg className="pin__icon" viewBox="0 0 20 20" fill="none">
                                                            <path
                                                                d="M13.332 9.99935H16.6654M14.9987 11.666V8.33268M3.33203 14.9993V14.166C3.33203 13.503 3.59542 12.8671 4.06426 12.3982C4.53311 11.9294 5.16899 11.666 5.83203 11.666H9.16536C9.82841 11.666 10.4643 11.9294 10.9331 12.3982C11.402 12.8671 11.6654 13.503 11.6654 14.166V14.9993C11.6654 15.2204 11.5776 15.4323 11.4213 15.5886C11.265 15.7449 11.053 15.8327 10.832 15.8327H4.16536C3.94435 15.8327 3.73239 15.7449 3.57611 15.5886C3.41983 15.4323 3.33203 15.2204 3.33203 14.9993ZM9.9987 6.66602C9.9987 7.32906 9.73531 7.96494 9.26647 8.43378C8.79762 8.90262 8.16174 9.16602 7.4987 9.16602C6.83566 9.16602 6.19977 8.90262 5.73093 8.43378C5.26209 7.96494 4.9987 7.32906 4.9987 6.66602C4.9987 6.00297 5.26209 5.36709 5.73093 4.89825C6.19977 4.42941 6.83566 4.16602 7.4987 4.16602C8.16174 4.16602 8.79762 4.42941 9.26647 4.89825C9.73531 5.36709 9.9987 6.00297 9.9987 6.66602Z"
                                                                stroke="currentColor"
                                                                strokeWidth={2}
                                                                strokeLinecap="round"
                                                                strokeLinejoin="round"
                                                            />
                                                        </svg>
                                                    </button>

                                                    <input
                                                        className="pin__input"
                                                        placeholder="Введите почту"
                                                        type="text"

                                                        name="users"
                                                        onChange={changeHandlerUser}
                                                        value={user.user}
                                                        autoComplete="off"
                                                        disabled={loading}
                                                        required maxLength="300"
                                                    />
                                                    <button className="pin__delete" onClick={() => { console.log('ksfdjklj'); setUser({ users: '' }) }}>
                                                        <svg className="pin__icon " viewBox="0 0 20 20" fill="none">
                                                            <path
                                                                d="M5.83203 14.1667L12.4654 7.5M12.4987 14.1667L5.86536 7.5"
                                                                stroke="currentColor"
                                                                strokeWidth={2}
                                                                strokeLinecap="round"
                                                                strokeLinejoin="round"
                                                            />
                                                        </svg>
                                                    </button>
                                                </li>
                                                <li className="pin">
                                                    <svg className="pin__icon" viewBox="0 0 20 20" fill="none">
                                                        <path
                                                            d="M4.16797 9.99935H15.8346M10.0013 15.8327V4.16602"
                                                            stroke="#939393"
                                                            strokeWidth={2}
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                        />
                                                    </svg>
                                                    <span className="pin__text">Сергей Соколов</span>
                                                </li>
                                                {task.users.map((user, index) => {
                                                    return (
                                                        <li className="pin --th-new" key={index} user={user} >
                                                            <span className="pin__text">{user}</span>
                                                            <button className="pin__delete" onClick={handleDeleteUser}>
                                                                <svg className="pin__icon" viewBox="0 0 20 20" fill="none">
                                                                    <path
                                                                        d="M5.83203 14.1667L12.4654 7.5M12.4987 14.1667L5.86536 7.5"
                                                                        stroke="currentColor"
                                                                        strokeWidth={2}
                                                                        strokeLinecap="round"
                                                                        strokeLinejoin="round"
                                                                    />
                                                                </svg>
                                                            </button>
                                                        </li>
                                                    )
                                                })}

                                            </ul>
                                        </div>
                                    </li>
                                    <li className="task-step --th-creator" id='rules' onClick={handleEdit}>
                                        <div className="task-step__header">
                                            <h4 className="task-step__title">Грамматика</h4>
                                            <svg className="task-step__icon" viewBox="0 0 24 24" fill="none">
                                                <path
                                                    d="M5 12H19M12 19V5"
                                                    stroke="currentColor"
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
                                                    onChange={changeHandler}
                                                    value={task.rules}
                                                    autoComplete="off"
                                                    disabled={loading}
                                                    required maxLength="2000"
                                                />
                                            </p>
                                        </div>
                                    </li>
                                    <li className="task-step --th-creator" id='words' onClick={handleEdit}>
                                        <div className="task-step__header">
                                            <h4 className="task-step__title">Лексика</h4>
                                            <svg className="task-step__icon" viewBox="0 0 24 24" fill="none" >
                                                <path
                                                    d="M5 12H19M12 19V5"
                                                    stroke="currentColor"
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
                                                    onChange={changeHandler}
                                                    value={task.words}
                                                    autoComplete="off"
                                                    disabled={loading}
                                                    required maxLength="200"
                                                />
                                            </p>
                                        </div>
                                    </li>
                                    <li className="task-step  --th-creator " id='read' onClick={handleEdit}>
                                        <div className="task-step__header">
                                            <h4 className="task-step__title">Чтение и письмо</h4>
                                            <svg className="task-step__icon" viewBox="0 0 24 24" fill="none" >
                                                <path
                                                    d="M5 12H19M12 19V5"
                                                    stroke="currentColor"
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
                                                    onChange={changeHandler}
                                                    value={task.read}
                                                    autoComplete="off"
                                                    disabled={loading}
                                                    required maxLength="500"
                                                />
                                            </p>
                                        </div>
                                    </li>
                                    <li className="task-step --th-creator" id='translate' onClick={handleEdit}>
                                        <div className="task-step__header">
                                            <h4 className="task-step__title">Аудирование и видео</h4>
                                            <svg className="task-step__icon" viewBox="0 0 24 24" fill="none" >
                                                <path
                                                    d="M5 12H19M12 19V5"
                                                    stroke="currentColor"
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
                                                    onChange={changeHandler}
                                                    value={task.translate}
                                                    autoComplete="off"
                                                    disabled={loading}
                                                    required maxLength="500"
                                                />
                                            </p>
                                        </div>
                                    </li>
                                    <li className="task-step --th-creator" id='other' onClick={handleEdit}>
                                        <div className="task-step__header">
                                            <h4 className="task-step__title">Дополнительные материалы</h4>
                                            <svg className="task-step__icon" viewBox="0 0 24 24" fill="none" >
                                                <path
                                                    d="M5 12H19M12 19V5"
                                                    stroke="currentColor"
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
                                                    onChange={changeHandler}
                                                    value={task.other}
                                                    autoComplete="off"
                                                    disabled={loading}
                                                    required maxLength="300"
                                                />
                                            </p>
                                        </div>
                                    </li>
                                </ul>
                                <div className="task-more__actions">
                                    <button className="task-more__remove btn btn-red" onClick={() => { setDeleteModal(true); }}>
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
                                    </button>
                                    <button disabled="" className="btn btn-dark" onClick={handleSubmit}>
                                        <span>Сохранить</span>
                                    </button>
                                </div>


                                {deleteModal &&
                                    <div className="app-modal">
                                        <div className="app-modal__overlay" />
                                        <div className="app-modal__inner">
                                            <button className="app-modal__close btn line-btn-grey" onClick={() => { setDeleteModal(false); }}>
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
                                            <div className="confirm-delete">
                                                <h3 className="confirm-delete__title">
                                                    Вы уверены, что хотите <br /> удалить задание?
                                                </h3>
                                                <p className="confirm-delete__text">Это действие будет нельзя отменить</p>
                                                <div className="confirm-delete__actions">
                                                    <button className="confirm-delete__yes btn btn-red-outline" onClick={handleSubmitDelete}>
                                                        <svg className="icon" viewBox="0 0 24 24" fill="none">
                                                            <path
                                                                d="M5 7H19M10 10V18M14 10V18M10 3H14C14.2652 3 14.5196 3.10536 14.7071 3.29289C14.8946 3.48043 15 3.73478 15 4V7H9V4C9 3.73478 9.10536 3.48043 9.29289 3.29289C9.48043 3.10536 9.73478 3 10 3ZM6 7H18V20C18 20.2652 17.8946 20.5196 17.7071 20.7071C17.5196 20.8946 17.2652 21 17 21H7C6.73478 21 6.48043 20.8946 6.29289 20.7071C6.10536 20.5196 6 20.2652 6 20V7Z"
                                                                stroke="currentColor"
                                                                strokeWidth={2}
                                                                strokeLinecap="round"
                                                                strokeLinejoin="round"
                                                            />
                                                        </svg>
                                                        <span>Удалить</span>
                                                    </button>
                                                    <button className="confirm-delete__no btn btn-dark" onClick={() => { setDeleteModal(false); }}>
                                                        <span>Вернуться назад</span>
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                }
                            </section>
                        </main>
                        <footer className="app-main__bot">
                            <p className="app-main__copyright app-main__text">
                                © 2025 Learnew. <br /> Все права защищены.
                            </p>
                            <ul className="app-main__links">
                                <li className="app-main__link-wrapper">
                                    <a href="#" className="app-main__link app-main__text">
                                        Поддержка
                                    </a>
                                </li>
                                <li className="app-main__link-wrapper">
                                    <a href="#" className="app-main__link app-main__text">
                                        Условия использования
                                    </a>
                                </li>
                                <li className="app-main__link-wrapper">
                                    <a href="#" className="app-main__link app-main__text">
                                        Политика конфиденциальности
                                    </a>
                                </li>
                            </ul>
                        </footer>
                    </main>
                }
            </div>
        </>
    )
}