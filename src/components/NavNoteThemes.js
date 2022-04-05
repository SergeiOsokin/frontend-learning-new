//
import React, { useState } from 'react';
import { useHttp } from '../hooks/http.hook';
import { useMessage } from '../hooks/message.hook';
import { NoteCard } from './NoteCard';

export const NavNoteThemes = ({ arrNoteThemes }) => {
    const { loading, request } = useHttp();
    const message = useMessage();
    const [note, setNote] = useState({
        id: '',
        theme: '',
        text: '',
        example: '',
    });

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
    const handleClickGetNote = async (e) => {
        const idNote = e.target.getAttribute('info');
        e.preventDefault();
        try {
            const data = await request(`/notes/getnote/${idNote}`, 'GET', {});
            message(data.message);
            setNote({
                id: data[0].id,
                theme: data[0].theme,
                text: data[0].text,
                example: data[0].example,
            })
        } catch (err) {
            message('Ошибка:', err);
        }
    };

    return (
        <>
            <label className="nav-themes-toggle" htmlFor="nav-theme-checkbox">M</label>
            <input className="nav-theme-checkbox" type="checkbox" id="nav-theme-checkbox" />
            <section className="section-nav-topics">
                <input
                    className="input input_topics"
                    type="input"
                    placeholder="поиск темы"
                    onChange={menuSearch}
                />
                <nav className="nav-themes">
                    <ul className="nav__items_topics nav__items_topics">
                        {arrNoteThemes.sort((a, b) => a.id - b.id).map((note, index) => {
                            return (
                                <li className="nav__item-li_topics nav__item-li_topics" key={index + note.id}>
                                    <button
                                        className="nav__item-button_topics nav__item-button_topics"
                                        info={note.id}
                                        onClick={handleClickGetNote}
                                    >{note.theme}</button>
                                </li>
                            )
                        })}
                    </ul>
                </nav>
            </section>
            {!loading && <NoteCard note={note} />}
        </>
    )
};