import React, { useState, useEffect, useLayoutEffect, useCallback } from 'react';
import { NavNoteThemes } from '../components/NavNoteThemes';
import { useHttp } from '../hooks/http.hook';
import { useMessage } from '../hooks/message.hook';
import { NoteCard } from '../components/NoteCard';
import { Aside } from '../components/Aside';
import { MobileMenu } from '../components/MobileMenu';
import { useHistory } from 'react-router-dom/cjs/react-router-dom.min';
import { Loader } from '../components/Loader';

export const NotesPage = () => {
    const message = useMessage();
    const history = useHistory();
    const [deleteModal, setDeleteModal] = useState(false);
    const [noteId, setNoteId] = useState();
    const [themes, setThemes] = useState([]);
    const [noteCard, setNoteCardActive] = useState(false);
    const [change, setChanged] = useState(false);
    const [active, setModalActive] = useState(false);
    const [notes, setNotes] = useState([]);
    const { loading, request } = useHttp();


    function menuSearch() {
        let phrase = document.querySelector('.input_topics');
        let navItemTopics = document.querySelector('.nav__items_topics');
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
    const handleOpenNotice = (e) => {
        history.push(`/notes/open/${e.target.closest('.app-cards__item').getAttribute('info')}`);
        // const idNote = e.target.getAttribute('info');
        // setNoteId({
        //     id: idNote,
        // });
        // setNoteCardActive(true);
    };

    const handleCreateNote = (e) => {
        history.push('/notes/new');
    }

    const handleOpenDeleteModal = (e) => {
        setNoteId(e.target.closest('.app-cards__item').getAttribute('info'));
        setDeleteModal(true)
    }

    const handleCloseDeleteModal = (e) => {
        setDeleteModal(false);
    }

    const handleSubmitDelete = useCallback(async (e) => {
        try {
            const data = await request(`/notes/delete/${noteId}`, 'DELETE', {});
            if (data.hasOwnProperty('error')) {
                message(data.message || data.error, false);
                return;
            }
            message(data.message, true);
            setDeleteModal(false);
            getNotes();
        } catch (error) {
            message(error, false);
        }
    }, [noteId]);

    // useEffect(() => {
    //     async function fetchData() {
    //         try {
    //             const data = await request('/notes/themes', 'GET', {});
    //             if (data === undefined) {
    //                 return
    //             }
    //             setThemes(data);
    //         } catch (error) {
    //             message(error, false)
    //         }
    //     }
    //     fetchData();
    // }, [change]);

    const getNotes = async function fetchData() {
        try {
            const data = await request(`/notes/get`, 'GET', {});
            if (data.hasOwnProperty('error')) {
                message(data.message || data.error, false);
                return;
            }
            setNotes(data.data)
        } catch (error) {
            message(error, false);
        }
    }

    useLayoutEffect(() => {
        // async function fetchData() {
        //     try {
        //         const data = await request(`/notes/get`, 'GET', {});
        //         if (data === undefined) {
        //             return
        //         }
        //         message(data.message, true);
        //         setNotes(data.data)
        //     } catch (error) {
        //         message(error, false);
        //     }
        // }
        getNotes();
    }, [request, active])


    return (
        // <>
        //     <input id="menu__toggle" type="checkbox" />
        //     <label className="menu__btn" htmlFor="menu__toggle">
        //         <span></span>
        //     </label>
        //     <section className="section-nav-topics">
        //         <input
        //             className="input input_topics"
        //             type="input"
        //             placeholder="поиск темы"
        //             onChange={menuSearch}
        //         />
        //         <nav className="nav-themes">
        // <ul className="nav__items_topics nav__items_topics">
        //     {themes.sort((a, b) => a.id - b.id).map((theme, index) => {
        //         return (
        //             <li className="nav__item-li_topics nav__item-li_topics" key={index + theme.id}>
        //                 <button
        //                     className="nav__item-button_topics nav__item-button_topics"
        //                     info={theme.id}
        //                     onClick={handleClickGetNote}
        //                 >{theme.theme}</button>
        //             </li>
        //         )
        //     })}
        // </ul>
        //         </nav>
        //     </section>

        //     {!noteCard && <div className="section-tasks__info">Для начала работы выберите заметку или создайте новую</div>}
        //     {noteCard && <NoteCard props={noteId} setChanged={setChanged} change={change} noteCard={noteCard} setNoteCardActive={setNoteCardActive} />}
        // </>
        <>
            <div className="app-inner">
                <Aside />
                <main className="app-main">
                    <header className="app-main__top">
                        <div className="app-main__left">
                            <h1 className="app-main__title">Заметки</h1>
                        </div>
                        <div className="app-main__right">
                            <div className="app-main__search app-search --th-empty">
                                <input
                                    type="text"
                                    placeholder="Text"
                                    className="app-search__elem"
                                />
                                <button className="app-search__delete line-btn-dark">
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
                                <div className="app-search__icon">
                                    <svg className="icon" viewBox="0 0 24 24" fill="none">
                                        <path
                                            d="M20 20L16.8889 16.8889M16.4444 10.2222C16.4444 11.0393 16.2835 11.8484 15.9708 12.6034C15.6581 13.3583 15.1998 14.0442 14.622 14.622C14.0442 15.1998 13.3583 15.6581 12.6034 15.9708C11.8484 16.2835 11.0393 16.4444 10.2222 16.4444C9.40511 16.4444 8.596 16.2835 7.84108 15.9708C7.08617 15.6581 6.40023 15.1998 5.82245 14.622C5.24466 14.0442 4.78633 13.3583 4.47364 12.6034C4.16094 11.8484 4 11.0393 4 10.2222C4 8.57199 4.65555 6.98934 5.82245 5.82245C6.98934 4.65555 8.57199 4 10.2222 4C11.8725 4 13.4551 4.65555 14.622 5.82245C15.7889 6.98934 16.4444 8.57199 16.4444 10.2222Z"
                                            stroke="currentColor"
                                            strokeWidth={2}
                                            strokeLinecap="round"
                                        />
                                    </svg>
                                </div>
                            </div>
                        </div>
                    </header>
                    {loading && <Loader />}

                    {!loading &&
                        <main className="app-main__mid">
                            <section className="app-cards">

                                <ul className="app-cards__inner">
                                    <li className="app-cards__item">
                                        <button className="card-add" onClick={handleCreateNote}>
                                            <svg className="card-add__icon" viewBox="0 0 24 24" fill="none">
                                                <path
                                                    d="M5 12H19M12 19V5"
                                                    stroke="currentColor"
                                                    strokeWidth={2}
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                />
                                            </svg>
                                            <span className="card-add__text">Новая заметка</span>
                                        </button>
                                    </li>
                                    {notes
                                        .sort((a, b) => a.id - b.id)
                                        .map((note, index) => {
                                            return (
                                                <li className="app-cards__item" key={index + note.id} info={note.id}>
                                                    <div className="card card-note">
                                                        <div className="card-note__top">
                                                            <p className="card-note__date">{note.date_create}</p>
                                                            <div className="card-note__actions">
                                                                <button className="card-note__btn" onClick={handleOpenNotice}>
                                                                    <svg viewBox="0 0 24 24" fill="none">
                                                                        <path
                                                                            d="M15.717 4.07486L18.9255 7.28329M7.49999 6.5003H4.125C3.82663 6.5003 3.54048 6.61883 3.3295 6.8298C3.11853 7.04078 3 7.32692 3 7.62528V18.875C3 19.1734 3.11853 19.4595 3.3295 19.6705C3.54048 19.8815 3.82663 20 4.125 20H16.5C16.7983 20 17.0845 19.8815 17.2955 19.6705C17.5064 19.4595 17.625 19.1734 17.625 18.875V13.8126M20.3351 2.66414C20.5459 2.87485 20.7131 3.12503 20.8272 3.40038C20.9413 3.67574 21 3.97087 21 4.26892C21 4.56697 20.9413 4.8621 20.8272 5.13745C20.7131 5.4128 20.5459 5.66298 20.3351 5.87369L12.6356 13.573L8.62499 14.3751L9.42711 10.3646L17.1266 2.66527C17.3371 2.45437 17.5872 2.28706 17.8625 2.17291C18.1378 2.05876 18.4328 2 18.7308 2C19.0289 2 19.3239 2.05876 19.5992 2.17291C19.8745 2.28706 20.1245 2.45437 20.3351 2.66527V2.66414Z"
                                                                            stroke="currentColor"
                                                                            strokeWidth={2}
                                                                            strokeLinecap="round"
                                                                            strokeLinejoin="round"
                                                                        />
                                                                    </svg>
                                                                </button>
                                                                <button className="card-note__btn delete" onClick={handleOpenDeleteModal}>
                                                                    <svg viewBox="0 0 24 24" fill="none">
                                                                        <path
                                                                            d="M5 7H19M10 10V18M14 10V18M10 3H14C14.2652 3 14.5196 3.10536 14.7071 3.29289C14.8946 3.48043 15 3.73478 15 4V7H9V4C9 3.73478 9.10536 3.48043 9.29289 3.29289C9.48043 3.10536 9.73478 3 10 3ZM6 7H18V20C18 20.2652 17.8946 20.5196 17.7071 20.7071C17.5196 20.8946 17.2652 21 17 21H7C6.73478 21 6.48043 20.8946 6.29289 20.7071C6.10536 20.5196 6 20.2652 6 20V7Z"
                                                                            stroke="currentColor"
                                                                            strokeWidth={2}
                                                                            strokeLinecap="round"
                                                                            strokeLinejoin="round"
                                                                        />
                                                                    </svg>
                                                                </button>
                                                            </div>
                                                        </div>
                                                        <div className="card-note__content">
                                                            <h3 className="card-note__title">{note.theme}</h3>
                                                            <p className="card-note__text">
                                                                {note.text}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </li>
                                            )
                                        })}
                                </ul>

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
                            </section>
                        </main>
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
            <MobileMenu />
        </>

    )
}