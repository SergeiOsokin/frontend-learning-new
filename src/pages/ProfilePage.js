import React, { useState, useEffect, useLayoutEffect, useCallback } from 'react';
import { NavNoteThemes } from '../components/NavNoteThemes';
import { useHttp } from '../hooks/http.hook';
import { useMessage } from '../hooks/message.hook';
import { NoteCard } from '../components/NoteCard';
import { Aside } from '../components/Aside';
import { MobileMenu } from '../components/MobileMenu';
import { useHistory } from 'react-router-dom/cjs/react-router-dom.min';
import { Loader } from '../components/Loader';
import { FooterInner } from '../components/Footer';

export const ProfilePage = () => {
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

        <>
            <div className="app-inner">
                <Aside />
                <main className="app-main">
                    <header className="app-main__top">
                        <div className="app-main__left">
                            <h1 className="app-main__title">Мой профиль</h1>
                        </div>
                    </header>
                    {loading && <Loader />}

                    <FooterInner />
                </main>
            </div>
            {/* <MobileMenu /> */}
        </>

    )
}