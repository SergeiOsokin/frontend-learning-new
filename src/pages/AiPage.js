import React, { useState, useEffect, useLayoutEffect, useCallback } from 'react';
import { useHttp } from '../hooks/http.hook';
import { useMessage } from '../hooks/message.hook';
import { Aside } from '../components/Aside';
import { useHistory } from 'react-router-dom/cjs/react-router-dom.min';
import { Loader } from '../components/Loader';
import { FooterInner } from '../components/Footer';
import { ThemesAI } from '../constants/ThemesAI';

export const AiPage = () => {
    const message = useMessage();
    const [active, setModalActive] = useState(false);
    const [notes, setNotes] = useState([]);
    const { loading, request, clearError } = useHttp();
    const [word, setWords] = useState({
        russianWord: '',
        foreignWord: '',
        categoryWord: '',
    });
    const [category, setCategory] = useState([]);
    const { disable, setDisable } = useState(true);
    const [activeCategory, setActiveCategory] = useState('Категория слов для AI');
    const [activeTheme, setActiveTheme] = useState('Тема генерации для AI');

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

    const changeHandler = (e) => {
        // --th-disabled --th-dark
        if (e.target.name === 'categoryWord') {
            const idCategory = e.target.closest(".dropdown-categories__row").getAttribute('info');
            setWords({ ...word, [e.target.name]: idCategory });
        } else {
            setWords({ ...word, [e.target.name]: e.target.value });
        }
    };

    const changeHandlerTheme = (e) => {
        // --th-disabled --th-dark
        if (e.target.name === 'themes') {
            const idCategory = e.target.closest(".dropdown-categories__row").getAttribute('info');
            setWords({ ...word, [e.target.name]: idCategory });
        } else {
            setWords({ ...word, [e.target.name]: e.target.value });
        }
    }

    const handleSubmit = (async (e) => {
        e.preventDefault();
        try {
            const data = await request('/words/add', 'POST', word);
            if (data.hasOwnProperty('error')) {
                message(data.message || data.error, false);
                return;
            }
            message(data.message, true);
            setWords({
                russianWord: '',
                foreignWord: '',
                categoryWord: '',
            })
            // document.querySelector(".form__select").value = ""
        } catch (err) {
            message(err, false);
        }
    });

    const handleCheckCat = (e) => {
        if (e.target.classList.contains('create-word-select')) {
            document.querySelector(".checkCatAdd .dropdown-categories").classList.toggle('--th-active');
        } else if (e.target.classList.contains('app-checkbox__input')) {
            setActiveCategory(e.target.closest('.dropdown-categories__checkbox').getAttribute('info'));
            document.querySelector(".checkCatAdd .dropdown-categories").classList.toggle('--th-active');
        }
    };

    const handleCheckTheme = (e) => {
        if (e.target.classList.contains('create-word-select')) {
            document.querySelector(".checkTheme .dropdown-categories").classList.toggle('--th-active');
        } else if (e.target.classList.contains('app-checkbox__input')) {
            setActiveTheme(e.target.closest('.dropdown-categories__checkbox').getAttribute('info'));
            document.querySelector(".checkTheme .dropdown-categories").classList.toggle('--th-active');
        }
    };

    useEffect(() => {
        window.addEventListener('keydown', (event) => {
            if (event.key === 'Escape') {
                // setActive(false);
            }
        });
        fetchData();
    }, []);

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
        getNotes();
    }, [request, active])


    return (
        <>
            <div className="app-inner">
                <Aside />
                <main className="app-main">
                    <header className="app-main__top">
                        <div className="app-main__left">
                            <h1 className="app-main__title">Закрепляем с AI</h1>
                        </div>
                        <div className="app-main__right">
                        </div>
                    </header>
                    {loading && <Loader />}

                    {!loading &&
                        <>
                            <section className="create-word">
                                <div className="create-word__top">
                                    <div className="create-word">
                                        <ul className="create-word__list">
                                            <li className="create-word__row">
                                                <div className="create-word__col checkTheme" onClick={handleCheckTheme}>
                                                    <div className="create-word-select">
                                                        <div
                                                            style={{ display: "none" }}
                                                            className="create-word-select__placeholder"
                                                        >
                                                            Какую категорию использовать
                                                        </div>
                                                        <div className="create-word-select__value">
                                                            {activeTheme}
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
                                                                    ThemesAI.map((element, index) => {
                                                                        console.log(element)
                                                                        return (
                                                                            <li
                                                                                className="dropdown-categories__row"
                                                                                key={index.toString()}
                                                                                info={index}
                                                                            >
                                                                                <div className="dropdown-categories__name">
                                                                                    {element}
                                                                                </div>
                                                                                <div className="dropdown-categories__checkbox" info={element}>
                                                                                    <div className="app-checkbox" >
                                                                                        <input
                                                                                            type="checkbox"
                                                                                            className="app-checkbox__input"
                                                                                            name="themes"
                                                                                            onChange={changeHandlerTheme}
                                                                                            disabled={disable}
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
                                                <div className="create-word__col checkCatAdd" onClick={handleCheckCat}>
                                                    <div className="create-word-select">
                                                        <div
                                                            style={{ display: "none" }}
                                                            className="create-word-select__placeholder"
                                                        >
                                                            Какую категорию использовать
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
                                                                                            name="categoryWord"
                                                                                            onChange={changeHandler}
                                                                                            disabled={disable}
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
                                    <div className="create-word__bot">
                                        <button disabled="" className="create-word__save btn btn-dark" onClick={handleSubmit}>
                                            Составить предложения
                                        </button>
                                    </div>
                                </div>
                            </section>
                        </>
                    }
                    <FooterInner />
                </main>
            </div>
            {/* <MobileMenu /> */}
        </>

    )
}