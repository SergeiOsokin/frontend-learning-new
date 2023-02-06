import React, { useState, useCallback, useEffect, useContext } from 'react';
import { useHttp } from '../hooks/http.hook';
import { Loader } from './Loader';
import { useMessage } from '../hooks/message.hook';
import trashIcon from '../../src/img/trash_icon.png';
import { NoteFormChange } from './NoteFormChange';
import { AuthContext } from '../context/AuthContext';
// setChanged, change меняем, чтобы заставить navnotetheme вызывать useEffect 
// и обновлять динамично пункты меню после изменения заметки
export const NoteCard = ({ props, setChanged, change }) => {
    const { loading } = useContext(AuthContext);
    const message = useMessage();
    const { request } = useHttp();
    const [noteForm, setNoteFormActive] = useState(false);
    const [note, setNote] = useState({
        id: '',
        theme: '',
        text: '',
        example: '',
    });

    const deleteNote = useCallback(async (e) => {
        const [id] = e.target.closest(".main-content").getAttribute('noteinfo').split('+');
        const decision = window.confirm('Удалить заметку?');

        if (decision) {
            try {
                const data = await request(`/notes/delete/${id}`, 'DELETE', {});
                message(data.message);
            } catch (e) {
                message(e);
            }
        }
    }, [message, request]);

    const patchNote = () => {
        setNoteFormActive(true);
    }

    useEffect(() => {
        async function fetchData() {
            try {
                const data = await request(`/notes/get/${props.id}`, 'GET', {});
                message(data.message);
                setNote({
                    id: data[0].id,
                    theme: data[0].theme,
                    text: data[0].text,
                    example: data[0].example,
                })
            } catch (e) {
                message(e);
            }
        }
        fetchData();
        setChanged(!change);
    }, [noteForm, props.id])

    if (props === '') { return (<p className="empty-note"> Выберите заметку </p>) }

    return (
        <>
            {loading && <Loader />}
            {!loading &&
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
            }
            {noteForm && <NoteFormChange props={note} setActive={setNoteFormActive} />}
        </>
    )
}