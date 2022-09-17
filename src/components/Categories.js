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
        <section className="words-section">
            {active &&
                <WordFormChange wordInfo={wordInfo} setActive={setModalActive} />
            }

            {loading && <Loader />}

            <>
                <table className="words-section__table-words" >
                    <caption>
                        Ваши заметки
                    </caption>
                    <thead>
                        <tr>
                            <th>№ п/п</th>
                            <th>Категория</th>
                            <th></th>
                            <th></th>
                        </tr>
                    </thead>

                    <tbody>
                        {categories
                            .sort((a, b) => a.id - b.id)
                            .map((element, index) => {
                                return (
                                    <tr className="word-string"
                                        info={`${element.id}+${element.category}`}
                                        key={element.id}
                                    >
                                        <td>{index + 1}</td>
                                        <td>{element.category}</td>
                                        <td>
                                            <button
                                                className="button button_table"
                                                onClick={changeWord}
                                            >Редактировать</button>
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