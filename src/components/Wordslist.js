import React, { useEffect, useCallback, useState } from 'react';
import { useHttp } from '../hooks/http.hook';
import { WordFormChange } from './WordFormChange';
import { useMessage } from '../hooks/message.hook';
import { Loader } from './Loader';
import trashIcon from '../../src/img/trash_icon.png';
import usePagination from "../hooks/pagination.hook";

export const WordsList = () => {
    const { loading, request } = useHttp();
    const [wordsArr, setWordsArr] = useState([]);
    const message = useMessage();
    const [inputValue, setInputValue] = useState('')
    const [wordInfo, setWordInfo] = useState({});
    const [active, setModalActive] = useState(false);

    const {
        firstContentIndex,
        lastContentIndex,
        nextPage,
        prevPage,
        page,
        setPage,
        totalPages,
    } = usePagination({
        contentPerPage: 250,
        count: wordsArr.length || 0,
    });


    function tableSearch() {
        let phrase = document.querySelector('.words-section__input-search');
        let table = document.querySelector('.words-section__table-words');
        let regPhrase = new RegExp(phrase.value, 'i');
        let flag = false;
        for (let i = 1; i < table.rows.length; i++) {
            flag = false;
            for (let j = table.rows[i].cells.length - 1; j >= 0; j--) {
                // проверяем, есть ли введенные символы в ячейке
                flag = regPhrase.test(table.rows[i].cells[j].innerHTML);
                if (flag) break;
            }
            if (flag) {
                table.rows[i].style.display = "";
            } else {
                table.rows[i].style.display = "none";
            }
        }
    }

    const handleChange = (e) => {
        setInputValue(e.target.value)
        tableSearch();
    }

    const handleClose = () => {
        setInputValue('');
        setTimeout(() => {
            tableSearch();
        }, 1)
    }

    const handleScrollUp = () => {
        window.scrollTo(0, 0);
    }

    const deleteWord = useCallback(async (e) => {
        const decision = window.confirm('Удалить слово?');
        const [id] = e.target.closest(".word-string").getAttribute('info').split('+');
        if (decision) {
            try {
                const data = await request(`/words/deleteword/${id}`, 'DELETE', {}, {
                    credentials: 'include'
                });
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
                const data = await request(`/words/wordslist`, 'GET');
                if (data.data.length === 0) {
                    return message(data.message)
                } else {
                    setWordsArr(data.data);
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
                <div className="words-section__input-container">
                    <div className="input-container">
                        <input
                            placeholder="Поиск слова"
                            className="words-section__input-search input"
                            id="search" type="text"
                            autoComplete="off"
                            onChange={handleChange}
                            value={inputValue}
                        />
                        <span
                            className="words-section__button-clean"
                            onClick={handleClose}
                        ></span>
                    </div>

                    <div className="pagination">
                        <p className="pagination__page-count">
                            {page}/{totalPages}
                        </p>
                        <button onClick={prevPage} className="pagination_page-previous">
                            &#60;
                        </button>
                        {[...Array(totalPages).keys()].map((el) => (
                            <button
                                onClick={() => setPage(el + 1)}
                                key={el}
                                className={`pagination_page-number ${page === el + 1 ? "active" : ""}`}
                            >
                                {el + 1}
                            </button>
                        ))}
                        <button onClick={nextPage} className="pagination_page-next">
                            &#62;
                        </button>
                    </div>
                </div>

                <table className="words-section__table-words" >
                    <caption>
                        Ваши слова
                    </caption>
                    <thead>
                        <tr>
                            <th>№ п/п</th>
                            <th>Иностранное слово</th>
                            <th>Перевод</th>
                            <th>Категория</th>
                            <th></th>
                            <th></th>
                        </tr>
                    </thead>

                    <tbody>
                        {wordsArr
                            .sort((a, b) => a.id - b.id)
                            .slice(firstContentIndex, lastContentIndex)
                            .map((word, index) => {
                                return (
                                    <tr className="word-string"
                                        info={`${word.id}+${word.foreign_word}+${word.russian_word}+${word.category}+${word.category_word_id}`}
                                        key={word.id}
                                    >
                                        <td>{index + 1}</td>
                                        <td>{word.foreign_word}</td>
                                        <td>{word.russian_word}</td>
                                        <td>{word.category}</td>
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

                <button
                    className="button button-up"
                    onClick={handleScrollUp}
                >UP</button>
            </>
        </section>
    )
}