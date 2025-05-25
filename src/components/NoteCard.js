import React, { useState, useCallback, useEffect, useLayoutEffect } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { useHttp } from '../hooks/http.hook';
import { Loader } from './Loader';
import { useMessage } from '../hooks/message.hook';
import trashIcon from '../../src/img/trash_icon.png';
import { NoteFormChange } from './NoteFormChange';
import { Aside } from '../components/Aside';
import { autoResize } from '../hooks/autoResize.hook';
// setChanged, change меняем, чтобы заставить navnotetheme вызывать useEffect 
// и обновлять динамично пункты меню после изменения заметки { props, setChanged, change, noteCard, setNoteCardActive }
export const NoteCard = () => {
    const message = useMessage();
    const { loading, request } = useHttp();
    const history = useHistory();
    const [deleteModal, setDeleteModal] = useState(false);
    // const [noteForm, setNoteFormActive] = useState(false);
    const [note, setNote] = useState({
        id: '',
        theme: '',
        text: '',
        example: '',
    });

    const changeHandler = (e) => {
        setNote({ ...note, [e.target.name]: e.target.value });
        autoResize(e.target.name);
        // validationInputs(e);
    }

    const handleSubmit = useCallback(async (e) => {
        e.preventDefault();
        try {
            const data = await request(`/notes/patch/${note.id}`, 'PATCH', note);
            if (data.hasOwnProperty('error')) {
                message(data.message, false);
                return;
            }
            return message(data.message, true);
        } catch (err) {
            message(err, false);
        }
    }, [note]);

    const handleOpenDeleteModal = (e) => {
        setDeleteModal(true);
    }

    const handleSubmitDelete = useCallback(async (e) => {
        // note.id);
        e.preventDefault();
        try {
            const data = await request(`/notes/delete/${note.id}`, 'DELETE', {});
            if (data.hasOwnProperty('error')) {
                message(data.message, false);
                return;
            }
            message(data.message, true);
            history.push('/notes')
        } catch (error) {
            message(error, false);
        }
    }, [note]);

    const handleCloseDeleteModal = (e) => {
        setDeleteModal(false);
    }

    useLayoutEffect(() => {
        async function fetchData() {
            try {
                const data = await request(`/notes/get/${parseInt(history.location.pathname.match(/\d+/))}`, 'GET', {});
                if (data.hasOwnProperty('error')) {
                    message(data.message, false);
                    return;
                }
                setNote({
                    id: data[0].id,
                    theme: data[0].theme,
                    text: data[0].text,
                    example: data[0].example,
                })

                window.addEventListener('textarea', autoResize('text'))

            } catch (error) {
                message(error, false);
            }
        }
        fetchData();
    }, [])

    // if (props === '') { return (<p className="empty-note"> Выберите заметку </p>) }

    return (
        <>
            {loading && <Loader />}

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
                            <h1 className="app-main__title">Заметка: {note.theme}</h1>
                        </div>
                        <div className="app-main__right">
                            <div className="app-main__search search" />
                        </div>
                    </header>

                    {!loading &&
                        <main className="app-main__mid">
                            <div className="app-create-notice">
                                <div className="app-create-notice__top">
                                    <div className="app-create-notice__title create-title">
                                        {/* <div className="create-title__elem">
                                    {note.theme}
                                </div> */}
                                        <input
                                            placeholder="Название"
                                            className="create-notice-title__elem theme"
                                            id="theme"
                                            type="text"
                                            name="theme"
                                            onChange={changeHandler}
                                            required maxLength="20"
                                            value={note.theme}
                                            autoComplete="off"
                                            disabled={loading}
                                        />
                                    </div>
                                    <div className="app-create-notice__added">
                                        <div className="notice-example-add --th-empty">
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
                                            {/* <div className="app-area-notice-text">
                                        {note.text}
                                    </div> */}
                                            <textarea
                                                className="app-area-notice-text text"
                                                placeholder="Текст заметки"
                                                id="text"
                                                type="text"
                                                name="text"
                                                onChange={changeHandler}
                                                value={note.text}
                                                autoComplete="off"
                                                disabled={loading}
                                                required maxLength="1200"
                                            />
                                        </div>
                                        <div className="notice-example-add">
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
                                            {/* <div className="app-area-notice-text">
                                        {note.example}
                                    </div> */}
                                            <textarea
                                                className="app-area-notice-text example"
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
                                <div className="app-create-notice__bot">
                                    <button className="app-create-notice__remove btn btn-red" onClick={handleOpenDeleteModal}>
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
                                        <span>Удалить</span>
                                    </button>
                                    <button className="app-create-notice__save btn btn-dark" onClick={handleSubmit}>
                                        Сохранить
                                    </button>
                                </div>
                            </div>
                        </main>
                    }



                    {deleteModal &&
                        <div className="app-modal">
                            <div className="app-modal__overlay" />
                            <div className="app-modal__inner">
                                <button className="app-modal__close btn line-btn-grey" onClick={handleCloseDeleteModal}>
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
                                        Вы уверены, что хотите <br />
                                        удалить заметку?
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
                                        <button className="confirm-delete__no btn btn-dark" onClick={handleCloseDeleteModal}>
                                            <span>Вернуться назад</span>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    }

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

            {/* {!loading &&

                <main className="main-content" noteinfo={`${note.id}`}>
                    <div className="main-content__control-panel">
                        <button className="control-panel__edit-button button" onClick={patchNote}>Редактировать</button>
                        <button
                            className="control-panel__delete-button"
                            onClick={deleteNote}
                        ><img className="trash-icon" src={trashIcon} alt="Удалить"></img></button>
                    </div>
                    <h1 className="note__title"> <span>{note.theme} </span></h1>
                    <p className="">Основная информация:</p>
                    <div className="note__text">
                        {note.text}
                    </div>
                    <p className="">Примеры:</p>
                    <div className="note__example">
                        {note.example}
                    </div>
                </main>
            } */}
            {/* {noteForm && <NoteFormChange props={note} setActive={setNoteFormActive} setChanged={setChanged} change={change} />} */}
        </>
    )
}