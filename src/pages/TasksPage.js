import React, { useEffect, useState } from 'react';

import { useHttp } from '../hooks/http.hook';
import { useMessage } from '../hooks/message.hook';
import { Loader } from '../components/Loader';
import { TaskFormNew } from '../components/TaskFormNew';
import { TaskFormOld } from '../components/TaskFormChange';
import { TaskCard } from '../components/TaskCard';

export const TaskPage = () => {
    const { loading, request } = useHttp();
    const [tasks, setTasks] = useState([]);
    const btnCreateClick = false;
    const btnTaskClick = false;

    const [taskId, setTaskId] = useState({
        id: '',
        theme: ''
    });
    const [taskCard, setTaskCardActive] = useState(false);
    const [change, setChanged] = useState(false);

    const message = useMessage();

    useEffect(() => {
        async function fetchData() {
            try {
                const data = await request('/task/themes', 'GET', {});
                if (data === undefined) {
                    return
                }
                setTasks(data);
            } catch (e) {
                message(e)
            }
        }
        fetchData();
    }, [message, request, change]);

    const handleClickGet = (e) => {
        const taskId = e.target.getAttribute('info');
        setTaskId({
            id: taskId,
        });
        setTaskCardActive(true);
    }

    const handleClickCreate = () => {
        
    }

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
        <div className="section-tasks">
            <section className="section-nav-tasks">
                <input
                    className="input input_tasks"
                    type="input"
                    placeholder="поиск задания"
                    onChange={menuSearch}
                />
                <nav className="nav-tasks">
                    <ul className="nav__items_tasks nav__items_tasks">
                        {tasks.sort((a, b) => a.id - b.id).map((task, index) => {
                            return (
                                <li className="nav__item-li_tasks nav__item-li_tasks" key={index + task.id}>
                                    <button
                                        className="nav__item-button_tasks nav__item-button_tasks"
                                        info={task.id}
                                        onClick={handleClickGet}
                                    >{task.theme}</button>
                                </li>
                            )
                        })}
                    </ul>
                </nav>
            </section>

            {taskCard && <TaskCard props={taskId} setChanged={setChanged} change={change} />}
        </div>
    )
};