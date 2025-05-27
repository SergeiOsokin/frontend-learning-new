import React, { useEffect, useState, useLayoutEffect, useCallback } from 'react';

import { useHttp } from '../hooks/http.hook';
import { useMessage } from '../hooks/message.hook';
import { Loader } from '../components/Loader';
import { TaskFormNew } from '../components/TaskForm';
import { TaskFormOld } from '../components/TaskFormChange';
import { TaskCard } from '../components/TaskCard';
import { Aside } from '../components/Aside';
import { useHistory } from 'react-router-dom/cjs/react-router-dom.min';

export const TaskPage = () => {
    const { loading, request } = useHttp();
    const [tasks, setTasks] = useState([]);
    const history = useHistory();

    const [taskId, setTaskId] = useState(false);
    const [taskCard, setTaskCardActive] = useState(false);
    const [taskForm, setTaskFormActive] = useState(false);
    const [change, setChanged] = useState(false);
    const [deleteModal, setDeleteModal] = useState(false);
    const [appointModal, setAppointModal] = useState(false);
    const [currentTask, setCurrentTask] = useState();
    const [user, setUser] = useState({
        users: ''
    });


    const getTasks = async function fetchData() {
        try {
            const data = await request('/task/all', 'GET', {});
            if (data.hasOwnProperty('error')) {
                message(data.message || data.error, false);
                return;
            }
            setTasks(data);
        } catch (error) {
            message(error, false)
        }
    }

    const getTask = async function fetchData() {
        try {
            const data = await request(`/task/theme/${parseInt(history.location.pathname.match(/\d+/))}`, 'GET', {});
            if (data.hasOwnProperty('error')) {
                message(data.message || data.error, false);
                return;
            }
            message(data.message, true);
            setUser({
                id: data[0].id,
                users: data[0].users,
            })
        } catch (error) {
            message(error, false);
        }
    }

    const message = useMessage();

    const handleMoreBtn = (e) => {
        e.target.closest(".more-btn").classList.toggle('--th-active');
    }

    const handleAppoint = (e) => {
        setCurrentTask(e.target.closest('.app-cards__item').getAttribute('info'))
        // getTask()
        setAppointModal(true);
    };

    const appointTask = (async (e) => {
        e.preventDefault()
        // try {
        //     const data = await request(`/task/appoint/${task.id}`, 'POST', user);
        //     if (data === undefined) {
        //         return
        //     }
        //     getTask();
        // } catch (err) {
        //     message(err, false);
        // }
    });

    const changeHandlerUser = (e) => {
        setUser({ ...user, [e.target.name]: e.target.value });
        // if (e.target.type === 'textarea') { autoResize(e.target.name) }
        // autoResize(e.target.name)
        // validationInputs(e);
    }

    const handleDelele = (e) => {
        setTaskId(e.target.closest('.app-cards__item').getAttribute('info'));
        setDeleteModal(true);
    }

    const handleSubmitDelete = useCallback(async (e) => {
        try {
            const data = await request(`/task/delete/${taskId}`, 'DELETE', {});
            setDeleteModal(false);
            getTasks();
            message(data.message, true);
        } catch (error) {
            message(error, false);
        }
    }, [taskId]);

    const handleEdit = (e) => {
        history.push(`/education/teacher/open/${e.target.closest('.app-cards__item').getAttribute('info')}`);
    }



    useEffect(() => {
        getTasks();
    }, []);

    // const handleClickGet = (e) => {
    //     const taskId = e.target.getAttribute('info');
    //     setTaskId({
    //         id: taskId,
    //     });
    //     setTaskCardActive(true);
    // }

    // const openTaskForm = () => {
    //     setTaskFormActive(true)
    // }

    function menuSearch() {
        let phrase = document.querySelector('.input_tasks');
        let navItemTopics = document.querySelector('.nav__items_tasks');
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

    return (
        // <div className="section-tasks">
        //     <input id="section-tasks-menu__toggle" type="checkbox" />
        //     <label className="section-tasks-menu__btn" htmlFor="section-tasks-menu__toggle">
        //         <span></span>
        //     </label>
        //     <section className="section-nav-tasks">
        //         <button
        //             className="button button_new-task"
        //             onClick={openTaskForm}
        //         >Новое задание</button>

        //         <input
        //             className="input input_tasks"
        //             type="input"
        //             placeholder="поиск задания"
        //             onChange={menuSearch}
        //         />
        //         <nav className="nav-tasks">
        //             <ul className="nav__items_tasks nav__items_tasks">
        //                 {tasks.sort((a, b) => a.id - b.id).map((task, index) => {
        //                     return (
        //                         <li className="nav__item-li_tasks nav__item-li_tasks" key={index + task.id}>
        //                             <button
        //                                 className="nav__item-button_tasks"
        //                                 info={task.id}
        //                                 onClick={handleClickGet}
        //                             >{task.theme}</button>
        //                         </li>
        //                     )
        //                 })}
        //             </ul>
        //         </nav>
        //     </section>

        //     {!taskCard && <div className="section-tasks__info">Для начала работы выберите задание или создайте новое</div>}

        //     {taskCard && <TaskCard props={taskId} set={setChanged} chan={change} taskCard={taskCard} setTaskCardActive={setTaskCardActive} />}
        //     {taskForm && <TaskFormNew set={setChanged} chan={change} setActive={setTaskFormActive} />}
        // </div>
        <>
            {loading && <Loader />}
            <div className="app-inner">
                <Aside />
                <main className="app-main">
                    <header className="app-main__top">
                        <div className="app-main__left">
                            <h1 className="app-main__title">Обучение - Преподаватель</h1>
                        </div>
                        <div className="app-main__right">
                            <div className="app-main__search app-search --th-empty">
                                <input type="text" placeholder="Text" className="app-search__elem" />
                                <button className="app-search__delete line-btn-dark">
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
                    <main className="app-main__mid">
                        <section className="app-cards">
                            <ul className="app-cards__inner">
                                <li className="app-cards__item">
                                    <button className="card-add --th-tasks" onClick={() => { history.push('/education/teacher/new') }}>
                                        <svg className="card-add__icon" viewBox="0 0 24 24" fill="none">
                                            <path
                                                d="M5 12H19M12 19V5"
                                                stroke="currentColor"
                                                strokeWidth={2}
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                            />
                                        </svg>
                                        <span className="card-add__text">Новое задание</span>
                                    </button>
                                </li>
                                {tasks
                                    .sort((a, b) => a.id - b.id)
                                    .map((task, index) => {
                                        return (
                                            <li className="app-cards__item" key={index + task.id} info={task.id}>
                                                <div className="card card-note --th-no-text">
                                                    <div className="card-note__top">
                                                        <p className="card-note__date">
                                                            <span>{task.date_create}</span>
                                                        </p>
                                                        <div className="card-note__actions" onClick={handleMoreBtn}>
                                                            {/*  --th-active */}
                                                            <div className="more-btn">

                                                                <button className="card-note__btn more-btn__btn">
                                                                    <svg viewBox="0 0 4 16">
                                                                        <path
                                                                            d="M2 2H2.01M2 8H2.01M2 14H2.01"
                                                                            stroke="currentColor"
                                                                            strokeWidth={3}
                                                                            strokeLinecap="round"
                                                                        />
                                                                    </svg>
                                                                </button>
                                                                <ul className="more-btn__menu">
                                                                    <li className="more-btn__item">
                                                                        <button className="more-btn__item-btn line-btn-dark" onClick={handleAppoint}>
                                                                            <svg className="icon" viewBox="0 0 24 24" fill="none">
                                                                                <path
                                                                                    d="M16 12H20M18 14V10M4 18V17C4 16.2044 4.31607 15.4413 4.87868 14.8787C5.44129 14.3161 6.20435 14 7 14H11C11.7956 14 12.5587 14.3161 13.1213 14.8787C13.6839 15.4413 14 16.2044 14 17V18C14 18.2652 13.8946 18.5196 13.7071 18.7071C13.5196 18.8946 13.2652 19 13 19H5C4.73478 19 4.48043 18.8946 4.29289 18.7071C4.10536 18.5196 4 18.2652 4 18ZM12 8C12 8.79565 11.6839 9.55871 11.1213 10.1213C10.5587 10.6839 9.79565 11 9 11C8.20435 11 7.44129 10.6839 6.87868 10.1213C6.31607 9.55871 6 8.79565 6 8C6 7.20435 6.31607 6.44129 6.87868 5.87868C7.44129 5.31607 8.20435 5 9 5C9.79565 5 10.5587 5.31607 11.1213 5.87868C11.6839 6.44129 12 7.20435 12 8Z"
                                                                                    stroke="currentColor"
                                                                                    strokeWidth={2}
                                                                                    strokeLinecap="round"
                                                                                    strokeLinejoin="round"
                                                                                />
                                                                            </svg>
                                                                            <span>Назначить</span>
                                                                        </button>
                                                                    </li>
                                                                    <li className="more-btn__item">
                                                                        <button className="more-btn__item-btn line-btn-dark" onClick={handleEdit}>
                                                                            <svg className="icon" viewBox="0 0 24 24">
                                                                                <path
                                                                                    fill="none"
                                                                                    d="M15.717 4.07486L18.9255 7.28329M7.49999 6.5003H4.125C3.82663 6.5003 3.54048 6.61883 3.3295 6.8298C3.11853 7.04078 3 7.32692 3 7.62528V18.875C3 19.1734 3.11853 19.4595 3.3295 19.6705C3.54048 19.8815 3.82663 20 4.125 20H16.5C16.7983 20 17.0845 19.8815 17.2955 19.6705C17.5064 19.4595 17.625 19.1734 17.625 18.875V13.8126M20.3351 2.66414C20.5459 2.87485 20.7131 3.12503 20.8272 3.40038C20.9413 3.67574 21 3.97087 21 4.26892C21 4.56697 20.9413 4.8621 20.8272 5.13745C20.7131 5.4128 20.5459 5.66298 20.3351 5.87369L12.6356 13.573L8.62499 14.3751L9.42711 10.3646L17.1266 2.66527C17.3371 2.45437 17.5872 2.28706 17.8625 2.17291C18.1378 2.05876 18.4328 2 18.7308 2C19.0289 2 19.3239 2.05876 19.5992 2.17291C19.8745 2.28706 20.1245 2.45437 20.3351 2.66527V2.66414Z"
                                                                                    stroke="currentColor"
                                                                                    strokeWidth={2}
                                                                                    strokeLinecap="round"
                                                                                    strokeLinejoin="round"
                                                                                />
                                                                            </svg>
                                                                            <span>Редактировать</span>
                                                                        </button>
                                                                    </li>
                                                                    <li className="more-btn__item">
                                                                        <button className="more-btn__item-btn line-btn-red" onClick={handleDelele}>
                                                                            <svg className="icon" viewBox="0 0 24 24">
                                                                                <path
                                                                                    d="M5 7H19M10 10V18M14 10V18M10 3H14C14.2652 3 14.5196 3.10536 14.7071 3.29289C14.8946 3.48043 15 3.73478 15 4V7H9V4C9 3.73478 9.10536 3.48043 9.29289 3.29289C9.48043 3.10536 9.73478 3 10 3ZM6 7H18V20C18 20.2652 17.8946 20.5196 17.7071 20.7071C17.5196 20.8946 17.2652 21 17 21H7C6.73478 21 6.48043 20.8946 6.29289 20.7071C6.10536 20.5196 6 20.2652 6 20V7Z"
                                                                                    stroke="currentColor"
                                                                                    strokeWidth={2}
                                                                                    fill="none"
                                                                                    strokeLinecap="round"
                                                                                    strokeLinejoin="round"
                                                                                />
                                                                            </svg>
                                                                            <span>Удалить</span>
                                                                        </button>
                                                                    </li>
                                                                </ul>
                                                            </div>
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
                                {/* <li className="app-cards__item">
                                <div className="card card-note --th-no-text">
                                    <div className="card-note__top">
                                        <p className="card-note__date">
                                            <span>18.11.2025</span>
                                        </p>
                                        <div className="card-note__actions">
                                            <div className="more-btn --th-active">
                                                <button className="card-note__btn more-btn__btn">
                                                    <svg viewBox="0 0 4 16">
                                                        <path
                                                            d="M2 2H2.01M2 8H2.01M2 14H2.01"
                                                            stroke="currentColor"
                                                            strokeWidth={3}
                                                            strokeLinecap="round"
                                                        />
                                                    </svg>
                                                </button>
                                                <ul className="more-btn__menu">
                                                    <li className="more-btn__item">
                                                        <button className="more-btn__item-btn line-btn-dark">
                                                            <svg className="icon" viewBox="0 0 24 24" fill="none">
                                                                <path
                                                                    d="M16 12H20M18 14V10M4 18V17C4 16.2044 4.31607 15.4413 4.87868 14.8787C5.44129 14.3161 6.20435 14 7 14H11C11.7956 14 12.5587 14.3161 13.1213 14.8787C13.6839 15.4413 14 16.2044 14 17V18C14 18.2652 13.8946 18.5196 13.7071 18.7071C13.5196 18.8946 13.2652 19 13 19H5C4.73478 19 4.48043 18.8946 4.29289 18.7071C4.10536 18.5196 4 18.2652 4 18ZM12 8C12 8.79565 11.6839 9.55871 11.1213 10.1213C10.5587 10.6839 9.79565 11 9 11C8.20435 11 7.44129 10.6839 6.87868 10.1213C6.31607 9.55871 6 8.79565 6 8C6 7.20435 6.31607 6.44129 6.87868 5.87868C7.44129 5.31607 8.20435 5 9 5C9.79565 5 10.5587 5.31607 11.1213 5.87868C11.6839 6.44129 12 7.20435 12 8Z"
                                                                    stroke="currentColor"
                                                                    strokeWidth={2}
                                                                    strokeLinecap="round"
                                                                    strokeLinejoin="round"
                                                                />
                                                            </svg>
                                                            <span>Назначить</span>
                                                        </button>
                                                    </li>
                                                    <li className="more-btn__item">
                                                        <button className="more-btn__item-btn line-btn-dark">
                                                            <svg className="icon" viewBox="0 0 24 24">
                                                                <path
                                                                    fill="none"
                                                                    d="M15.717 4.07486L18.9255 7.28329M7.49999 6.5003H4.125C3.82663 6.5003 3.54048 6.61883 3.3295 6.8298C3.11853 7.04078 3 7.32692 3 7.62528V18.875C3 19.1734 3.11853 19.4595 3.3295 19.6705C3.54048 19.8815 3.82663 20 4.125 20H16.5C16.7983 20 17.0845 19.8815 17.2955 19.6705C17.5064 19.4595 17.625 19.1734 17.625 18.875V13.8126M20.3351 2.66414C20.5459 2.87485 20.7131 3.12503 20.8272 3.40038C20.9413 3.67574 21 3.97087 21 4.26892C21 4.56697 20.9413 4.8621 20.8272 5.13745C20.7131 5.4128 20.5459 5.66298 20.3351 5.87369L12.6356 13.573L8.62499 14.3751L9.42711 10.3646L17.1266 2.66527C17.3371 2.45437 17.5872 2.28706 17.8625 2.17291C18.1378 2.05876 18.4328 2 18.7308 2C19.0289 2 19.3239 2.05876 19.5992 2.17291C19.8745 2.28706 20.1245 2.45437 20.3351 2.66527V2.66414Z"
                                                                    stroke="currentColor"
                                                                    strokeWidth={2}
                                                                    strokeLinecap="round"
                                                                    strokeLinejoin="round"
                                                                />
                                                            </svg>
                                                            <span>Редактировать</span>
                                                        </button>
                                                    </li>
                                                    <li className="more-btn__item">
                                                        <button className="more-btn__item-btn line-btn-red">
                                                            <svg className="icon" viewBox="0 0 24 24">
                                                                <path
                                                                    d="M5 7H19M10 10V18M14 10V18M10 3H14C14.2652 3 14.5196 3.10536 14.7071 3.29289C14.8946 3.48043 15 3.73478 15 4V7H9V4C9 3.73478 9.10536 3.48043 9.29289 3.29289C9.48043 3.10536 9.73478 3 10 3ZM6 7H18V20C18 20.2652 17.8946 20.5196 17.7071 20.7071C17.5196 20.8946 17.2652 21 17 21H7C6.73478 21 6.48043 20.8946 6.29289 20.7071C6.10536 20.5196 6 20.2652 6 20V7Z"
                                                                    stroke="currentColor"
                                                                    strokeWidth={2}
                                                                    fill="none"
                                                                    strokeLinecap="round"
                                                                    strokeLinejoin="round"
                                                                />
                                                            </svg>
                                                            <span>Удалить</span>
                                                        </button>
                                                    </li>
                                                </ul>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="card-note__content">
                                        <h3 className="card-note__title">
                                            Articles (definite&nbsp;— the, indefinite – a/an, no article){" "}
                                        </h3>
                                    </div>
                                </div>
                            </li> */}
                            </ul>
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

                            {appointModal &&
                                <div className="app-modal">
                                    <div className="app-modal__overlay" />
                                    <div className="app-modal__inner">
                                        <button className="app-modal__close btn line-btn-grey" onClick={() => { setAppointModal(false); }}>
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
                                            <ul className="task-more__list">
                                                <li className="task-step --th-creator --th-edited" id='users'>
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
                                                                <button className="pin__delete" onClick={() => {
                                                                    setUser({ users: '' });
                                                                    setCurrentTask();
                                                                }}>
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
                                                            {/* <li className="pin">
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
                                                            </li> */}
                                                            {tasks.find((task, index) => {
                                                                return task.id = currentTask;
                                                            })
                                                                .users.map((user, index) => {
                                                                    return (
                                                                        <li className="pin --th-new" key={user} user={user} >
                                                                            <span className="pin__text">{user}</span>
                                                                            <button className="pin__delete" onClick={() => { }}>
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
                                                                })
                                                            }

                                                        </ul>
                                                    </div>
                                                </li>
                                            </ul>
                                            <div className="confirm-delete__actions">
                                                <button className="confirm-delete__no btn btn-dark" onClick={() => { setAppointModal(false); }}>
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
            </div >
        </>
    )
};