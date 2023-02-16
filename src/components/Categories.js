import React, { useEffect, useCallback, useState } from 'react';
import { useHttp } from '../hooks/http.hook';
import { WordFormChange } from './WordFormChange';
import { useMessage } from '../hooks/message.hook';
import { Loader } from './Loader';
import trashIcon from '../../src/img/trash_icon.png';

export const Categories = () => {
    const { loading, request } = useHttp();
    const [categories, setCategories] = useState([]);
    const message = useMessage();
    const [wordInfo, setWordInfo] = useState({});
    const [active, setModalActive] = useState(false);

    const deleteWord = useCallback(async (e) => {
        const decision = window.confirm('Удалить категорию?');
        const [id] = e.target.closest(".word-string").getAttribute('info').split('+');
        if (decision) {
            try {
                const data = await request(`/category/delete/${id}`, 'DELETE', {});
                message(data.message);
                e.target.closest(".word-string").parentElement.removeChild(e.target.closest(".word-string"));
            } catch (e) {
                message(e);
            }
        }
    }, [message, request]);

    const changeWord = (e) => {
        const [id, foreign_word, russian_word, category, category_word_id] = e.target.closest(".word-string").getAttribute('info').split('+');
        setWordInfo({ id, foreign_word, russian_word, category, category_word_id });
        setModalActive(true);
    };


    useEffect(() => {
        async function fetchData() {
            try {
                const data = await request(`/category/get`, 'GET');
                if (data === undefined) {
                    return
                }
                if (data.data.length === 0) {
                    return message(data.message)
                } else {
                    setCategories(data.data);
                }
            } catch (err) {
                message(err);
            }
        }
        fetchData();
    }, [request, message, active]);

    return (
        <section className="category-section every">
            {active &&
                <WordFormChange wordInfo={wordInfo} setActive={setModalActive} />
            }

            {loading && <Loader />}

            <>
                <table className="category-section__table" >
                    <caption>
                        Ваши категории
                    </caption>
                    {/* <thead>
                        <tr>
                            <th>№ п/п</th>
                            <th>Категория</th>
                            <th></th>
                            <th></th>
                        </tr>
                    </thead> */}

                    <tbody>
                        {categories
                            .sort((a, b) => a.id - b.id)
                            .map((element, index) => {
                                return (
                                    <tr className="category-string"
                                        info={`${element.id}+${element.category}`}
                                        key={element.id}
                                    >
                                        {/* <td>{index + 1}</td> */}
                                        <td>{element.category}</td>
                                        <td>
                                            <button
                                                className="button button_table"
                                                onClick={changeWord}
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-pencil-square" viewBox="0 0 16 16">
                                                    <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z" />
                                                    <path fillRule="evenodd" d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5v11z" />
                                                </svg>
                                            </button>
                                        </td>
                                        <td>
                                            <button
                                                className="button button_table-delete"
                                                onClick={deleteWord}
                                            ><img className="trash-icon" src={trashIcon} alt="Удалить"></img></button>
                                        </td>
                                    </tr>
                                )
                            })}
                    </tbody>
                </table>

            </>
        </section>
    )
}