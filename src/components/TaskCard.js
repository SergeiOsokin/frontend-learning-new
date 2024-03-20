import React, { useState, useCallback, useEffect } from 'react';
import { useHttp } from '../hooks/http.hook';
import { Loader } from './Loader';
import { useMessage } from '../hooks/message.hook';
import trashIcon from '../../src/img/trash_icon.png';
import { NoteFormChange } from './NoteFormChange';
import { TaskFormChange } from './TaskFormChange';
import { AppointForm } from './AppointForm';
// setChanged, change меняем, чтобы заставить navnotetheme вызывать useEffect 
// и обновлять динамично пункты меню после изменения
export const TaskCard = ({ props, set, chan }) => {
    const message = useMessage();
    const { loading, request } = useHttp();
    const [taskForm, setTaskFormActive] = useState(false);
    const [appointForm, setAppointFormActive] = useState(false);
    const [task, setTask] = useState({
        id: '',
        theme: '',
        words: '',
        rules: '',
        read: '',
        translate: '',
        other: '',
        users: '',
    });
    //  
    const deleteTask = useCallback(async (e) => {
        const [id] = e.target.closest(".main-content").getAttribute('info').split('+');
        const decision = window.confirm('Удалить задание?');

        if (decision) {
            try {
                const data = await request(`/task/delete/${id}`, 'DELETE', {});
                console.log(data)
                set(!chan);
                message(data.message);
            } catch (e) {
                message(e);
            }
        }
    }, [message, request, chan]);

    function patchTask() {
        setTaskFormActive(true);
    }

    function appointTask() {
        setAppointFormActive(true);
    }

    useEffect(() => {
        async function fetchData() {
            try {
                const data = await request(`/task/theme/${props.id}`, 'GET', {});
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
                })
            } catch (e) {
                message(e);
            }
        }
        fetchData();
        set(!chan);
    }, [taskForm, props.id])

    return (
        <>
            {loading && <Loader />}
            {!loading &&
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

                    <p className="">Правила:</p>
                    <div className="note__example">
                        {task.rules}
                    </div>

                    <p className="">Слова для изучения:</p>
                    <div className="note__example">
                        {task.words}
                    </div>

                    <p className="">Для самостоятельного чтения:</p>
                    <div className="note__example">
                        {task.read}
                    </div>

                    <p className="">Выполните перевод:</p>
                    <div className="note__example">
                        {task.translate}
                    </div>

                    <p className="">Дополнительно:</p>
                    <div className="note__example">
                        {task.other}
                    </div>
                    <p className="">Назначено:</p>
                    <div className="note__example">
                        {task.users.join(', ')}
                    </div>

                </main>
            }
            {taskForm && <TaskFormChange props={task} setActive={setTaskFormActive} />}
            {appointForm && <AppointForm props={task} setActive={setAppointFormActive} />}
        </>
    )
}