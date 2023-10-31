import React, { useEffect, useState } from 'react';

import { useHttp } from '../hooks/http.hook';
import { useMessage } from '../hooks/message.hook';
import { Loader } from '../components/Loader';
import { FlashCard } from '../components/FlashCard';
import { FlashCardWrite } from '../components/FlashCardWrite';
import { TaskFormNew } from '../components/TaskFormNew';
import { TaskFormOld } from '../components/TaskFormOld';

export const Tasks = () => {
    const { loading, request } = useHttp();
    const [tasks, setTasks] = useState([]);
    const btnCreateClick = false;
    const btnTaskClick = false;

    const message = useMessage();

    useEffect(() => {
        async function fetchData() {
            try {
                const data = await request(`/task/themes`, 'GET');
                console.log(data)
                if (data.length = 0) {
                    return setTasks([])
                } else {
                    setTasks(data);
                }
            } catch (err) {
                message(err);
            }
        }
        fetchData();
    }, [message, request]);

    const handleClick = () => {
        console.log('click task')
    }

    const handleClickCreate = () => {
        console.log('click create');
    }

    return (
        <div className="section-tasks">
            <section className="section-tasks__nav">
                <button
                    className="button button-create-task"
                    type="input"
                    placeholder="Создать задание"
                    onClick={handleClickCreate}
                />
                <nav className="section-tasks__tasks">
                    <ul className="section-tasks__ui">
                        {tasks.sort((a, b) => a.id - b.id).map((theme, index) => {
                            return (
                                <li className="section-tasks__li" key={index + theme.id}>
                                    <button
                                        className="section-tasks__button"
                                        info={theme.id}
                                        onClick={handleClick}
                                    >{theme.theme}</button>
                                </li>
                            )
                        })}
                    </ul>
                </nav>
            </section>

            <section className="section-field">
                {btnCreateClick && <TaskFormNew />}

                {btnTaskClick && <TaskFormOld />}

            </section>

        </div>
    )
};