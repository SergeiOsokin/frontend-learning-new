import React, { useState, useCallback } from 'react';
import { useHttp } from '../hooks/http.hook';
import { Loader } from './Loader';
import { useMessage } from '../hooks/message.hook';
import trashIcon from '../../src/img/trash_icon.png';
import { NoteFormChange } from './NoteFormChange';

export const NoteCard = (props) => {
    const message = useMessage();
    const { request } = useHttp();
    const [noteForm, setNoteForm] = useState(false);

    const deleteNote = useCallback(async (e) => {
        const [id] = e.target.closest(".main-content").getAttribute('noteinfo').split('+');
        const decision = window.confirm('Удалить заметку?');

        if (decision) {
            try {
                const data = await request(`/notes/deletenote/${id}`, 'DELETE', {});
                message(data.message);
                // e.target.closest(".word-string").parentElement.removeChild(e.target.closest(".word-string"));
            } catch (e) {
                message(e);
            }
        }
    }, [message, request]);

    const patchNote = () => {
        setNoteForm(true);
    }

    if (props.note.theme === '') { return (<p className="empty-note"> Выберите заметку </p>) }

    return (
        <>
            {props.loading && <Loader />}
            {!props.loading &&
                <main className="main-content" noteinfo={`${props.note.id}`}>
                    <div className="main-content__control-panel">
                        <button className="control-panel__edit-button button" onClick={patchNote}>Редактировать</button>
                        <button
                            className="control-panel__delete-button"
                            onClick={deleteNote}
                        ><img className="trash-icon" src={trashIcon} alt="Удалить"></img></button>
                    </div>
                    <h1 className="note__title"> <span>{props.note.theme} </span></h1>
                    <p className="">Основная информация:</p>
                    <div className="note__text">
                        {props.note.text}
                    </div>
                    <p className="">Примеры:</p>
                    <div className="note__example">
                        {props.note.example}
                    </div>
                </main>
            }
            {noteForm && <NoteFormChange props={props.note} setActive={setNoteForm} />}
        </>
    )
}