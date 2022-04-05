import React, { useState } from 'react';
import { useHttp } from '../hooks/http.hook';
import { useMessage } from '../hooks/message.hook';
import { Loader } from './Loader';
import { validation } from '../hooks/validation.hook';

export const NoteForm = () => {
    const { loading, request, clearError } = useHttp();
    const { validationInputs } = validation();
    const [note, setNote] = useState({
        theme: '',
        text: '',
        example: '',
    });
    const message = useMessage();

    const changeHandler = (e) => {
        setNote({ ...note, [e.target.name]: e.target.value });
        validationInputs(e);
    }

    const handleSubmit = (async (e) => {
        e.preventDefault()
        try {
            const data = await request('/notes/addnote', 'POST', note);
            message(data.message);
            clearError();
            setNote({
                theme: '',
                text: '',
                example: '',
            })
        } catch (err) {
            message(err);
        }
    });

    // useEffect(() => {
    //     message(error);
    //     clearError(); // очищаем ошибку (сделали в http.hook)
    // }, [error, message, clearError]);

    return (
        <section className="notice-section">
            
            <div className="notice-section__content">
            {loading && <Loader />}
                <h3 className="notice-section__title">Добавить заметку</h3>
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
                                placeholder="Максимум 1200 символов"
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
                                placeholder="Максимум 100 символов."
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

                    <div className="form__buttons-container">
                        <button
                            className={"button button-disable"}
                            disabled={true}
                        >Запомнить</button>
                    </div>
                </form>
            </div>
        </section>
    )
};