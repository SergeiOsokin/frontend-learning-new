import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { useHttp } from '../hooks/http.hook';
import { useMessage } from '../hooks/message.hook';
import { Loader } from './Loader';
import { validation } from '../hooks/validation.hook';

export const TaskFormNew = ({ set, chan, setActive }) => {
    const { loading, request } = useHttp();
    const { validationInputs } = validation();
    const [task, setTaskForm] = useState({
        theme: '',
        words: '',
        rules: '',
        read: '',
        translate: '',
        other: '',
    });
    const message = useMessage();


    const changeHandler = (e) => {
        setTaskForm({ ...task, [e.target.name]: e.target.value });
        validationInputs(e);
    }

    const handleSubmit = (async (e) => {
        e.preventDefault()
        try {
            const data = await request(`/task/create`, 'POST', task);
            if (data === undefined) {
                return
            }
            message(data.message);
            setActive(false);
            set(!chan);
            setTaskForm({
                theme: '',
                words: '',
                rules: '',
                read: '',
                translate: '',
                other: '',
            });
        } catch (err) {
            message(err);
        }
    });

    useEffect(() => {
        window.addEventListener('keydown', (event) => {
            if (event.key === 'Escape') {
                setActive(false);
            }
        });
    }, [setActive]);

    return (
        <>
            <section className="change-task-section commonClass">
                <div className="change-task-section__content">
                    <h3 className="change-task-section__title">Создать задание</h3>
                    <span className="form__close" onClick={() => { setActive(false) }}></span>
                    <form className="form" name="add-word-form" onSubmit={handleSubmit}>
                        <fieldset>
                            <div>
                                <label className="form__label" htmlFor="theme">Тема:</label>
                                <input
                                    id="theme"
                                    type="text"
                                    placeholder="Максимум 20 символов"
                                    name="theme"
                                    onChange={changeHandler}
                                    className="input"
                                    required maxLength="20"
                                    value={task.theme}
                                    autoComplete="off"
                                    disabled={loading}
                                />
                            </div>
                            <div>
                                <label className="form__label" htmlFor="rules">Грамматика:</label>
                                <textarea
                                    id="rules"
                                    type="text"
                                    placeholder="Максимум 2000 символов"
                                    name="rules"
                                    onChange={changeHandler}
                                    value={task.rules}
                                    className="textarea"
                                    autoComplete="off"
                                    disabled={loading}
                                    required maxLength="2000"
                                />
                            </div>
                            <div>
                                <label className="form__label" htmlFor="words">Лексика:</label>
                                <textarea
                                    id="words"
                                    type="text"
                                    placeholder="Максимум 1000 символов."
                                    name="words"
                                    onChange={changeHandler}
                                    value={task.words}
                                    className="textarea"
                                    autoComplete="off"
                                    disabled={loading}
                                    required maxLength="200"
                                />
                            </div>
                            <div>
                                <label className="form__label" htmlFor="read">Чтение и Письмо:</label>
                                <textarea
                                    id="read"
                                    type="text"
                                    placeholder="Максимум 500 символов."
                                    name="read"
                                    onChange={changeHandler}
                                    value={task.read}
                                    className="textarea"
                                    autoComplete="off"
                                    disabled={loading}
                                    required maxLength="500"
                                />
                            </div>
                            <div>
                                <label className="form__label" htmlFor="translate">Аудирование и Видео:</label>
                                <textarea
                                    id="translate"
                                    type="text"
                                    placeholder="Максимум 500 символов."
                                    name="translate"
                                    onChange={changeHandler}
                                    value={task.translate}
                                    className="textarea"
                                    autoComplete="off"
                                    disabled={loading}
                                    required maxLength="500"
                                />
                            </div>
                            <div>
                                <label className="form__label" htmlFor="other">Дополнительные материалы:</label>
                                <textarea
                                    id="other"
                                    type="text"
                                    placeholder="Максимум 300 символов."
                                    name="other"
                                    onChange={changeHandler}
                                    value={task.other}
                                    className="textarea"
                                    autoComplete="off"
                                    disabled={loading}
                                    required maxLength="300"
                                />
                            </div>
                            {/* <div>
                                <label className="form__label" htmlFor="users">Назначить на:</label>
                                <textarea
                                    id="users"
                                    type="text"
                                    placeholder="Добавьте логины через запятую"
                                    name="users"
                                    onChange={changeHandler}
                                    value={task.users}
                                    className="textarea"
                                    autoComplete="off"
                                    disabled={loading}
                                    required maxLength="300"
                                />
                            </div> */}
                        </fieldset>

                        {!loading && <div className="form__buttons-container">
                            <button
                                className={"button button-disable"}
                                disabled={true}
                            >Создать</button>
                        </div>}

                        {loading && <Loader />}
                    </form>
                </div>
            </section>
        </>

    )
};