import React, { useState, useEffect } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { useHttp } from '../hooks/http.hook';
import { useMessage } from '../hooks/message.hook';
import { Loader } from './Loader';
import { validation } from '../hooks/validation.hook';
import { Aside } from './Aside';
import { autoResize } from '../hooks/autoResize.hook';

export const NoteForm = () => {
    const { loading, request, clearError } = useHttp();
    const history = useHistory()
    const { validationInputs } = validation();
    const [note, setNote] = useState({
        theme: '',
        text: '',
        example: '',
        date: `${new Date().getFullYear()}-${new Date().getMonth() + 1}-${new Date().getDate()}`
    });
    const message = useMessage();

    const changeHandler = (e) => {
        setNote({ ...note, [e.target.name]: e.target.value });
        if (e.target.type === 'textarea') { autoResize(e.target.name) }
        // validationInputs(e);
    }

    const handleAdd = (e) => {
        switch (e.target.id) {
            case 'add__text':
                document.querySelector('.notice-text-add').classList.toggle('--th-disabled');
                break;
            case 'add__example':
                document.querySelector('.notice-example-add').classList.toggle('--th-disabled');
                break;
            default:

        }
    }

    const handleCancel = () => {
        history.push('/notes')
    }

    const handleSubmit = (async (e) => {
        // note)
        e.preventDefault();
        try {
            const data = await request('/notes/add', 'POST', note);
            if (data === undefined) {
                return
            }
            message(data.message, true);
            clearError();
            setNote({
                theme: '',
                text: '',
                example: '',
            })
        } catch (err) {
            message(err, false);
        }
    });

    useEffect(() => {
        // window.addEventListener('input', autoResize())
        // message(error);
        // clearError(); // очищаем ошибку (сделали в http.hook)
    }, []);

    return (
        // <section className="notice-section commonClass">

        //     <div className="notice-section__content">
        //         {loading && <Loader />}
        //         <h3 className="notice-section__title">Добавить заметку</h3>
        //         <form className="form" name="add-word-form" onSubmit={handleSubmit}>
        //             <fieldset>
        //                 <div>
        //                     <label className="form__label" htmlFor="theme">Тема</label>
        //                     <input
        // id="theme"
        // type="text"
        // placeholder="Введите тему"
        // name="theme"
        // onChange={changeHandler}
        // className="input"
        // required maxLength="20"
        // value={note.theme}
        // autoComplete="off"
        // disabled={loading}
        //                     />
        //                 </div>
        //                 <div>
        //                     <label className="form__label" htmlFor="text">Текст</label>
        //                     <textarea
        // id="text"
        // type="text"
        // placeholder="Максимум 1200 символов"
        // name="text"
        // onChange={changeHandler}
        // value={note.text}
        // className="textarea"
        // autoComplete="off"
        // disabled={loading}
        // required maxLength="1200"
        //                     />
        //                 </div>
        //                 <div>
        //                     <label className="form__label" htmlFor="example">Примеры</label>
        //                     <textarea
        // id="example"
        // type="text"
        // placeholder="Максимум 100 символов."
        // name="example"
        // onChange={changeHandler}
        // value={note.example}
        // className="textarea"
        // autoComplete="off"
        // disabled={loading}
        // required maxLength="150"
        //                     />
        //                 </div>
        //             </fieldset>

        //             <div className="form__buttons-container">
        //                 <button
        //                     className={"button button-disable"}
        //                     disabled={true}
        //                 >Запомнить</button>
        //             </div>
        //         </form>
        //     </div>
        // </section>
        <div className="app-inner">
            <Aside />
            <main className="app-main">
                <header className="app-main__top">
                    <div className="app-main__left">
                        <Link className="app-main__back" to="/notes">
                            <svg viewBox="0 0 6 10" fill="none">
                                <path
                                    d="M5 9L1 5L5 1"
                                    stroke="#939393"
                                    strokeWidth={2}
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                />
                            </svg>
                            <span>Все заметки</span>
                        </Link>
                        <h1 className="app-main__title">Новая заметка</h1>
                    </div>
                    <div className="app-main__right">
                        <div className="app-main__search search" />
                    </div>
                </header>
                <main className="app-main__mid">
                    <div className="app-create-notice">
                        <div className="app-create-notice__top">
                            <div className="app-create-notice__title create-notice-title">
                                <input
                                    placeholder="Название"
                                    className="create-notice-title__elem"
                                    id="theme"
                                    type="text"
                                    name="theme"
                                    onChange={changeHandler}
                                    required maxLength="30"
                                    value={note.theme}
                                    autoComplete="off"
                                    disabled={loading}
                                />
                            </div>
                            <div className="app-create-notice__added">

                                <button className="notice-add btn btn-grey" id='add__text' onClick={handleAdd}>
                                    <svg className="notice-add__icon" viewBox="0 0 24 24">
                                        <path
                                            d="M5 12H19M12 19V5"
                                            stroke="currentColor"
                                            strokeWidth={2}
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                        />
                                    </svg>
                                    <span className="notice-add__text">Описание</span>
                                </button>

                                <div className="notice-text-add --th-empty --th-disabled">
                                    {/* Стили при наведении закомментированы .notice-example-add:hover */}
                                    <svg
                                        className="notice-example-add__menu"
                                        viewBox="0 0 16 12"
                                        fill="none"
                                    >
                                        <path
                                            d="M1 1H15M1 6H15M1 11H15"
                                            stroke="#939393"
                                            strokeWidth={2}
                                            strokeLinecap="round"
                                        />
                                    </svg>
                                    <textarea
                                        className="app-area-text text"
                                        placeholder="Текст заметки"
                                        id="text"
                                        type="text"
                                        name="text"
                                        onChange={changeHandler}
                                        value={note.text}
                                        autoComplete="off"
                                        disabled={loading}
                                        required maxLength="1500"
                                    />
                                </div>

                                <button className="notice-add btn btn-grey" id='add__example' onClick={handleAdd}>
                                    <svg className="notice-add__icon" viewBox="0 0 24 24">
                                        <path
                                            d="M5 12H19M12 19V5"
                                            stroke="currentColor"
                                            strokeWidth={2}
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                        />
                                    </svg>
                                    <span className="notice-add__text">Примеры</span>
                                </button>

                                <div className="notice-example-add --th-disabled">
                                    <svg
                                        className="notice-example-add__menu"
                                        viewBox="0 0 16 12"
                                        fill="none"
                                    >
                                        <path
                                            d="M1 1H15M1 6H15M1 11H15"
                                            stroke="#939393"
                                            strokeWidth={2}
                                            strokeLinecap="round"
                                        />
                                    </svg>
                                    <textarea
                                        className="app-area-text example"
                                        placeholder="Пример заметки"
                                        id="example"
                                        type="text"
                                        name="example"
                                        onChange={changeHandler}
                                        value={note.example}
                                        autoComplete="off"
                                        disabled={loading}
                                        required maxLength="1200"
                                    />
                                </div>
                            </div>
                        </div>
                        {/* Кнопки перенес в app-create-notice__added чтобы блоки текста отображались под соответствующей кнопкой */}
                        {/* <div className="app-create-notice__mid">
                            <button className="notice-add btn btn-grey" id='add__text' onClick={handleAdd}>
                                <svg className="notice-add__icon" viewBox="0 0 24 24">
                                    <path
                                        d="M5 12H19M12 19V5"
                                        stroke="currentColor"
                                        strokeWidth={2}
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    />
                                </svg>
                                <span className="notice-add__text">Текст</span>
                            </button>
                            <button className="notice-add btn btn-grey" id='add__example' onClick={handleAdd}>
                                <svg className="notice-add__icon" viewBox="0 0 24 24">
                                    <path
                                        d="M5 12H19M12 19V5"
                                        stroke="currentColor"
                                        strokeWidth={2}
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    />
                                </svg>
                                <span className="notice-add__text">Примеры</span>
                            </button>
                        </div> */}
                        <div className="app-create-notice__bot">
                            <button className="app-create-notice__remove btn btn-red" onClick={handleCancel}>
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
                                <span>Забыть</span>
                            </button>
                            <button className="app-create-notice__save btn btn-dark" onClick={handleSubmit}>
                                Запомнить
                            </button>
                        </div>
                    </div>
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
        </div>
    )
};