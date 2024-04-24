import React, { useState, useCallback, useEffect } from 'react';
import { useHttp } from '../hooks/http.hook';
import { Loader } from './Loader';
import { useMessage } from '../hooks/message.hook';
import trashIcon from '../../src/img/trash_icon.png';
import { AppointForm } from './AppointForm';
// setChanged, change меняем, чтобы заставить navnotetheme вызывать useEffect 
// и обновлять динамично пункты меню после изменения
export const HomeworkCard = ({ props, set, chan }) => {
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
                const data = await request(`/homework/theme/${props.id}`, 'GET', {});
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

                </main>
            }
            {appointForm && <AppointForm props={task} setActive={setAppointFormActive} />}
        </>
    )
}