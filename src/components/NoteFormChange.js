import React, { useState, useEffect } from 'react';
import { useHttp } from '../hooks/http.hook';
import { useMessage } from '../hooks/message.hook';
import { validation } from '../hooks/validation.hook';
import { Loader } from './Loader';

export const NoteFormChange = ({ props, setActive }) => {
    const { loading, request } = useHttp();
    const { validationInputs } = validation();
    const [note, setNoteForm] = useState({
        id: `${props.id}`,
        theme: props.theme,
        text: props.text,
        example: props.example,
    });
    const message = useMessage();


    const changeHandler = (e) => {
        setNoteForm({ ...note, [e.target.name]: e.target.value });
        validationInputs(e);
    }

    const handleSubmit = (async (e) => {
        e.preventDefault()
        try {
            const data = await request('/notes/patch', 'PATCH', note);
            if (data === undefined) {
                return
            }
            message(data.message);
            setActive(false);
            setNoteForm({
                id: '',
                theme: '',
                text: '',
                example: '',
            })
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
            <section className="change-notice-section commonClass">
                <div className="change-notice-section__content">
                    <h3 className="change-notice-section__title">Изменить заметку</h3>
                    <span className="form__close" onClick={() => { setActive(false) }}></span>
                    <form className="form" name="add-word-form" onSubmit={handleSubmit}>
                        <fieldset>
                            <div>
                                <label className="form__label" htmlFor="theme">Тема</label>
                                <input
                                    id="theme"
                                    type="text"
                                    placeholder="Введите тему"
                                    name="theme"
                                    onChange={changeHandler}
                                    className="input"
                                    required maxLength="20"
                                    value={note.theme}
                                    autoComplete="off"
                                    disabled={loading}
                                />
                            </div>
                            <div>
                                <label className="form__label" htmlFor="text">Текст</label>
                                <textarea
                                    id="text"
                                    type="text"
                                    placeholder="Напишите текст заметки. Максимум 1200 символов"
                                    name="text"
                                    onChange={changeHandler}
                                    value={note.text}
                                    className="textarea"
                                    autoComplete="off"
                                    disabled={loading}
                                    required maxLength="1200"
                                />
                            </div>
                            <div>
                                <label className="form__label" htmlFor="example">Примеры</label>
                                <textarea
                                    id="example"
                                    type="text"
                                    placeholder="Напишите примеры. Максимум 100 символов."
                                    name="example"
                                    onChange={changeHandler}
                                    value={note.example}
                                    className="textarea"
                                    autoComplete="off"
                                    disabled={loading}
                                    required maxLength="150"
                                />
                            </div>
                        </fieldset>

                        {!loading && <div className="form__buttons-container">
                            <button
                                className={"button button-disable"}
                                disabled={true}
                            >Изменить</button>
                        </div>}

                        {loading && <Loader />}
                    </form>
                </div>
            </section>
        </>

    )
};