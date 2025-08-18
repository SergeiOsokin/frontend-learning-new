//
import React, { useEffect, useState } from 'react';
import { useHttp } from '../hooks/http.hook';
import { useMessage } from '../hooks/message.hook';
import { Loader } from './Loader';
import { validation } from '../hooks/validation.hook';

export const WordFormChange = ({ wordInfo, setActive }) => {
    // console.log(wordInfo)
    const { loading, request } = useHttp();
    const { validationInputs } = validation();
    const [word, setWords] = useState({
        russianWord: wordInfo.translate,
        foreignWord: wordInfo.word,
        categoryWordId: wordInfo.categoryId,
        categoryWord: wordInfo.category,
        id: wordInfo.id
    });
    const [category, setCategory] = useState([]);
    const message = useMessage();
    const { disable, setDisable } = useState(true);
    const [activeCategory, setActiveCategory] = useState(wordInfo.category);

    const changeHandler = (e) => {
        // --th-disabled --th-dark
        if (e.target.name === 'categoryWordId') {
            const idCategory = e.target.closest(".dropdown-categories__row").getAttribute('info');
            setWords({ ...word, [e.target.name]: idCategory });
            // document.querySelectorAll('.dropdown-categories__row .dropdown-categories__checkbox .app-checkbox'))
        } else {
            setWords({ ...word, [e.target.name]: e.target.value });
        }
        // validationInputs(e);
    }

    const handleClose = (async (e) => {
        setActive(false)
    });

    const handleSubmit = (async (e) => {
        e.preventDefault();
        console.log(word)
        try {
            const data = await request(`/words/patch/${word.id}`, 'PATCH', word);
            if (data.hasOwnProperty('error')) {
                message(data.message || data.error, false);
                return;
            }
            message(data.message, true);
            setActive(false);
            // setWords({
            //     russianWord: wordInfo.word,
            //     foreignWord: wordInfo.translate,
            //     categoryWordId: wordInfo.categoryId,
            //     categoryWord: wordInfo.category,
            //     id: wordInfo.id
            // })
            // document.querySelector(".form__select").value = ""
        } catch (err) {
            message(err, false);
        }
    });

    // Раскрытие списка категорий
    const handleCheckCat = (e) => {

        if (e.target.classList.contains('create-word-select')) {
            document.querySelector(".checkCatAdd .dropdown-categories").classList.toggle('--th-active');
        } else if (e.target.classList.contains('app-checkbox__input')) {
            setActiveCategory(e.target.closest('.dropdown-categories__checkbox').getAttribute('info'));
            document.querySelector(".checkCatAdd .dropdown-categories").classList.toggle('--th-active');
        }
    }

    useEffect(() => {
        window.addEventListener('keydown', (event) => {
            if (event.key === 'Escape') {
                setActive(false);
            }
        });

        async function fetchData() {
            try {
                const data = await request('/category/get', 'GET', {});
                if (data.hasOwnProperty('error')) {
                    message(data.message || data.error, false);
                    return;
                }
                setCategory(data.data)
            } catch (err) {
                message(err, false);
            }
        }
        fetchData();
    }, []);

    return (
        <div className="edit-modal">
            <div className="edit-modal__inner">
                <button className="edit-modal__close" onClick={handleClose}>
                    <svg className="icon" viewBox="0 0 32 32" fill="none">
                        <path
                            d="M2.6665 29.3327L29.1998 2.66602M29.3332 29.3327L2.79984 2.66602"
                            stroke="currentColor"
                            strokeWidth={2}
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
                    </svg>
                </button>
                <h3 className="edit-modal__title">Редактировать слово</h3>
                <div className="edit-wrapper">
                    <section className="create-word">
                        <div className="create-word__top">
                            <div className="create-word">
                                <ul className="create-word__list">
                                    <li className="create-word__row">
                                        <div className="create-word__col --th-word">
                                            <input
                                                placeholder="Слово"
                                                type="text"
                                                className="create-word__input"
                                                id="foreignWord"
                                                name="foreignWord"
                                                onChange={changeHandler}
                                                required maxLength="30" minLength="1"
                                                value={word.foreignWord}
                                                autoComplete="off"
                                                disabled={loading}
                                            />
                                        </div>
                                        <div className="create-word__col">
                                            <input
                                                placeholder="Перевод"
                                                type="text"
                                                className="create-word__input"
                                                id="russianWord"
                                                name="russianWord"
                                                onChange={changeHandler}
                                                value={word.russianWord}
                                                autoComplete="off"
                                                disabled={loading}
                                                required maxLength="30" minLength="1"
                                            />
                                        </div>
                                        <div className="create-word__col checkCatAdd" onClick={handleCheckCat}>
                                            <div className="create-word-select">
                                                <div
                                                    style={{ display: "none" }}
                                                    className="create-word-select__placeholder"
                                                >
                                                    Выберите значение
                                                </div>
                                                <div className="create-word-select__value">
                                                    {activeCategory}
                                                </div>
                                                <svg className="icon" viewBox="0 0 12 12" fill="none">
                                                    <path
                                                        fillRule="evenodd"
                                                        clipRule="evenodd"
                                                        d="M9.21243 5.1355C9.74943 4.4835 9.28493 3.5 8.43993 3.5H3.55993C2.71493 3.5 2.25093 4.4835 2.78793 5.1355L5.22843 8.099C5.32225 8.21294 5.44012 8.30471 5.5736 8.36771C5.70707 8.43071 5.85284 8.46338 6.00043 8.46338C6.14803 8.46338 6.29379 8.43071 6.42727 8.36771C6.56074 8.30471 6.67862 8.21294 6.77243 8.099L9.21243 5.1355Z"
                                                        fill="currentColor"
                                                    />
                                                </svg>
                                                <div className="dropdown-categories --th-create-word " >
                                                    <ul className="dropdown-categories__list" >
                                                        {
                                                            category.map((element, index) => {
                                                                return (
                                                                    <li
                                                                        className="dropdown-categories__row"
                                                                        key={index.toString()}
                                                                        info={element.id}
                                                                    >
                                                                        <div className="dropdown-categories__name">
                                                                            {element.category}
                                                                        </div>
                                                                        <div className="dropdown-categories__checkbox" info={element.category}>
                                                                            <div className="app-checkbox" >
                                                                                <input
                                                                                    type="checkbox"
                                                                                    className="app-checkbox__input"
                                                                                    name="categoryWordId"
                                                                                    onChange={changeHandler}
                                                                                    disabled={disable}
                                                                                    // eslint-disable-next-line eqeqeq
                                                                                    defaultChecked={element.id == wordInfo.categoryId ? true : false}
                                                                                    required
                                                                                />
                                                                                <div className="app-checkbox__elem">
                                                                                    <svg
                                                                                        className="app-checkbox__icon"
                                                                                        viewBox="0 0 14 10"
                                                                                        fill="none"
                                                                                    >
                                                                                        <path
                                                                                            d="M1.16699 4.93083L5.10366 8.75L12.8337 1.25"
                                                                                            stroke="#F6F6F1"
                                                                                            strokeWidth={2}
                                                                                            strokeLinecap="round"
                                                                                            strokeLinejoin="round"
                                                                                        />
                                                                                    </svg>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    </li>
                                                                )
                                                            })
                                                        }
                                                    </ul>
                                                </div>
                                            </div>
                                        </div>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </section>
                </div>
                <div className="create-word__bot">
                    <button disabled="" className="create-word__cancel btn btn-dark-outline" onClick={handleClose}>
                        Отменить
                    </button>
                    <button disabled="" className="create-word__save btn btn-dark" onClick={handleSubmit}>
                        Сохранить
                    </button>
                </div>
            </div>
        </div>
    )
};