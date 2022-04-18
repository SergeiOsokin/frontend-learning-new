import React, { useEffect, useState } from 'react';
import { useHttp } from '../hooks/http.hook';
import { useMessage } from '../hooks/message.hook';
import { Loader } from '../components/Loader';
import { Header } from '../components/Header';
import { NavNoteThemes } from '../components/NavNoteThemes';

export const NotesPage = () => {
    const { loading, request } = useHttp();
    const [noteThemes, setNoteThemes] = useState([]);

    const message = useMessage();

    // useEffect(() => {
    //     async function fetchData() {
    //         try {
    //             const data = await request('/notes/notethemes', 'GET', {});
    //             setNoteThemes(data);
    //         } catch (e) {
    //             message(e)
    //         }
    //     }
    //     fetchData();
    // }, [message, request]);

    return (
        <>
            <section className="section-main">
                {/* {loading && <Loader />} */}
                {/* {!loading && <NavNoteThemes arrNoteThemes={noteThemes} />} */}
                <NavNoteThemes />
            </section>
        </>
    )
}