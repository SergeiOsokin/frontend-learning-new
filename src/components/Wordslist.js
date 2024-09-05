import React, { useEffect, useCallback, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { useHttp } from '../hooks/http.hook';
import { WordFormChange } from './WordFormChange';
import { useMessage } from '../hooks/message.hook';
import { Loader } from './Loader';
import trashIcon from '../../src/img/trash_icon.png';
import usePagination from "../hooks/pagination.hook";

export const WordsList = () => {
    const { loading, request } = useHttp();
    const history = useHistory();
    const [wordsArr, setWordsArr] = useState([]);
    const message = useMessage();
    const [inputValue, setInputValue] = useState('')
    const [wordInfo, setWordInfo] = useState({});
    const [active, setModalActive] = useState(false);
    const [countItems, setCountItems] = useState(30);

    const {
        firstContentIndex,
        lastContentIndex,
        nextPage,
        prevPage,
        page,
        totalPages,
    } = usePagination({
        contentPerPage: countItems,
        count: wordsArr.length || 0,
    });

    const handleItems = (e) => {
        setCountItems(e.target.value)
    }

    const tableSearch = () => {
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
        if (window.pageYOffset > 0) {
            window.scrollBy(0, -80);
            setTimeout(handleScrollUp, 0);
        }
    }

    const deleteWord = useCallback(async (e) => {
        const decision = window.confirm('Удалить слово?');
        const [id] = e.target.closest(".word-string").getAttribute('info').split('+');
        if (decision) {
            try {
                const data = await request(`/words/delete/${id}`, 'DELETE', {}, {
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

    const scroll = () => {
        if (window.scrollY > 50) {
            document.querySelector('.button-back_to_top').classList.add('button-back_to_top-show');
        } else {
            document.querySelector('.button-back_to_top').classList.remove('button-back_to_top-show');
        }
    }

    useEffect(() => {
        document.addEventListener('scroll', () => {
            // console.log(history.location.pathname === '/wordslist')
            if (history.location.pathname === '/wordslist') {
                scroll();
            }
        });
        async function fetchData() {
            try {
                const data = await request(`/words/list?category=null`, 'GET');
                if (data === undefined) {
                    return
                }
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
        <section className="words-section commonClass">
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
                        <p className='pagination__text-count'>Отображать:
                            <select className="count-items" defaultValue={countItems} onChange={handleItems}>
                                <option value='30'>30</option>
                                <option value='50'>50</option>
                                <option value='100'>100</option>
                                <option value={wordsArr.length}>{wordsArr.length}</option>
                            </select>
                            слов
                        </p>
                        <button onClick={prevPage} className="pagination__page-previous">
                            &#60;
                        </button>
                        <p className="pagination__page-count">
                            Страница {page} из {totalPages}
                        </p>
                        <button onClick={nextPage} className="pagination__page-next">
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
                            {/* <th>№ п/п</th> */}
                            <th>Слово</th>
                            <th>Перевод</th>
                            <th className="category">Категория</th>
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
                                        {/* <td>{index + 1}</td> */}
                                        <td>{word.foreign_word}</td>
                                        <td>{word.russian_word}</td>
                                        <td className="category">{word.category}</td>
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

                <button
                    className="button button-back_to_top"
                    onClick={handleScrollUp}
                >↑</button>
            </>
        </section>
    )
}