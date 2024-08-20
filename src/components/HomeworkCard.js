import React, { useState, useCallback, useEffect } from 'react';
import { useHttp } from '../hooks/http.hook';
import { Loader } from './Loader';
import { useMessage } from '../hooks/message.hook';
import trashIcon from '../../src/img/trash_icon.png';
import { AppointForm } from './AppointForm';

import linkifyHtml from 'linkify-html';

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
    function searchLink() {
        // console.log(document.querySelector('.gramma').textContent);
        const beforeEl = linkifyHtml(document.querySelector('.gramma').textContent)
        const afterEl = document.querySelector('.gramma')

        afterEl.innerHTML = beforeEl;
    };

    // console.log(linkifyHtml(document.querySelectorAll('.note__example')));
    // console.log(document.querySelector('.gramma'));




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
                });
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
                    <div className="note__example gramma after">
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

                    <button
                        className="control-panel__delete-button"
                        onClick={searchLink}
                    >Показать ссылки</button>

                </main>
            }
            {appointForm && <AppointForm props={task} setActive={setAppointFormActive} />}
        </>
    )
}