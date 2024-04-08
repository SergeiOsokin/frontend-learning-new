//
import React, { useState, useEffect } from 'react';
import { useHttp } from '../hooks/http.hook';
import { useMessage } from '../hooks/message.hook';
import { NoteCard } from './NoteCard';

export const NavNoteThemes = () => {
    const { request } = useHttp();
    const message = useMessage();
    const [noteId, setNoteId] = useState({
        id: '',
        theme: ''
    });
    const [themes, setThemes] = useState([]);
    const [noteCard, setNoteCardActive] = useState(false);
    const [change, setChanged] = useState(false);

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
    const handleClickGetNote = (e) => {
        const idNote = e.target.getAttribute('info');
        setNoteId({
            id: idNote,
        });
        setNoteCardActive(true);
    };

    useEffect(() => {
        async function fetchData() {
            try {
                const data = await request('/notes/themes', 'GET', {});
                if (data === undefined) {
                    return
                }
                setThemes(data);
            } catch (e) {
                message(e)
            }
        }
        fetchData();
    }, [change]);

    return (
        <>
            <input id="menu__toggle" type="checkbox" />
            <label className="menu__btn" htmlFor="menu__toggle">
                <span></span>
            </label>
            <section className="section-nav-topics">
                <input
                    className="input input_topics"
                    type="input"
                    placeholder="поиск темы"
                    onChange={menuSearch}
                />
                <nav className="nav-themes">
                    <ul className="nav__items_topics nav__items_topics">
                        {themes.sort((a, b) => a.id - b.id).map((theme, index) => {
                            return (
                                <li className="nav__item-li_topics nav__item-li_topics" key={index + theme.id}>
                                    <button
                                        className="nav__item-button_topics nav__item-button_topics"
                                        info={theme.id}
                                        onClick={handleClickGetNote}
                                    >{theme.theme}</button>
                                </li>
                            )
                        })}
                    </ul>
                </nav>
            </section>

            {!noteCard && <div className="section-tasks__info">Для начала работы выберите заметку или создайте новую</div>}
            {noteCard && <NoteCard props={noteId} setChanged={setChanged} change={change} noteCard={noteCard} setNoteCardActive={setNoteCardActive} />}
        </>
    )
};