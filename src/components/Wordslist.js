import React, { useEffect, useCallback, useState, useContext, useLayoutEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useHistory, Link } from 'react-router-dom';
import { useHttp } from '../hooks/http.hook';
import { WordFormChange } from './WordFormChange';
import { useMessage } from '../hooks/message.hook';
import { Loader } from './Loader';
import trashIcon from '../../src/img/trash_icon.png';
import usePagination from "../hooks/pagination.hook";
import { Aside } from './Aside';
import { MobileMenu } from './MobileMenu';
import { WordForm } from './WordForm';
import { Categories } from './Categories';
import { FooterInner } from '../components/Footer';

export const WordsList = () => {
    const { authorization, logout } = useContext(AuthContext); // получаем контекст в объекте auth
    const { loading, request } = useHttp();
    const history = useHistory();
    const [wordsArr, setWordsArr] = useState([]);
    const message = useMessage();
    const [inputValue, setInputValue] = useState('')
    const [wordInfo, setWordInfo] = useState({});
    const [activeModalAdd, setActiveModalAdd] = useState(false);
    const [countItems, setCountItems] = useState(30);
    const [activeModalEdit, setActiveModalEdit] = useState(false);
    let newSet = new Set([]);

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
        document.querySelector('.pagination__settings-dropdown').classList.toggle('--th-active');
    }

    const handleItems2 = (e) => {
        document.querySelector('.pagination__settings-dropdown').classList.remove('--th-active');
        // document.querySelector('.pagination__settings-btn').classList.add('--th-current'); - найти "ближайший" с таким свойством
        setCountItems(e.target.value);
    }

    const handleAddWord = () => {
        setActiveModalAdd(true);
    };

    const handleEditCat = () => {
        setActiveModalEdit(true);
    };

    const handleWordBtn = (e) => {
        e.target.closest(".more-btn").classList.toggle('--th-active');
    }

    const logoutHandler = (event) => {
        event.preventDefault();
        logout();
        history.push('/authorization');
    };

    const handleCategoryFilter = (e) => {
        // filters-categories
        // document.querySelector('.dropdown-categories').classList.toggle('--th-active');

        // wordsArr.forEach(elem => {
        //     newSet.add(`${elem.category}`);
        // });

        // newSet);
        // if (e.target.classList.contains('filters-categories__select')) {
        //     document.querySelector('.dropdown-categories').classList.toggle('--th-active');
        // } else if (e.target.classList.contains('app-checkbox__input')) {

        // }
    }

    const tableSearch = () => {
        let phrase = document.querySelector('.app-search__elem');
        let table = document.querySelector('.app-dictionary__table');
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

        switch (e.target.value.length) {
            case 0:
                document.querySelector('.app-search').classList.add('--th-active');
                break;
            default:
                document.querySelector('.app-search').classList.remove('--th-active');
        }

        setInputValue(e.target.value)
        tableSearch();
    }

    const handleClose = () => {
        setInputValue('');

        document.querySelector('.app-search').classList.add('--th-active');

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
                if (data.hasOwnProperty('error')) {
                    message(data.message || data.error, false);
                    return;
                }
                message(data.message, true);
                e.target.closest(".word-string").parentElement.removeChild(e.target.closest(".word-string"));
            } catch (error) {
                message(error, false);
            }
        }
    }, [request]);

    const changeWord = (e) => {
        const [id, foreign_word, russian_word, category, category_word_id] = e.target.closest(".word-string").getAttribute('info').split('+');
        setWordInfo({ id, foreign_word, russian_word, category, category_word_id });
        setActiveModalAdd(true);
    };

    // const scroll = () => {
    //     if (window.scrollY > 50) {
    //         document.querySelector('.button-back_to_top').classList.add('button-back_to_top-show');
    //     } else {
    //         document.querySelector('.button-back_to_top').classList.remove('button-back_to_top-show');
    //     }
    // }

    useLayoutEffect(() => {
        document.addEventListener('scroll', () => {
            // history.location.pathname === '/wordslist')
            // if (history.location.pathname === '/wordslist') {
            //     scroll();
            // }
        });

        window.addEventListener('keydown', (event) => {
            // if (event.key === 'Escape') {
            //     // handleWordBtn(false);
            //     let btn = document.querySelectorAll(".more-btn")
            //     while (btn.length)
            //         btn[0].className = btn[0].classList.remove('--th-active');
            // }
        });

        async function fetchData() {
            try {
                const data = await request(`/words/list?category=null`, 'GET');
                console.log('true')
                if (data.hasOwnProperty('error')) {
                    message(data.message || data.error, false);
                    return;
                } else {
                    setWordsArr(data.data);
                    return;
                }
            } catch (err) {
                message(err, false);
            }
        }
        fetchData();
    }, [request, activeModalAdd]);

    return (
        <>
            {loading && <Loader />}

            <div className="app-inner">
                <Aside />
                <main className="app-main">
                    <header className="app-main__top">
                        <div className="app-main__left">
                            <h1 className="app-main__title">Словарь</h1>
                        </div>
                        <div className="app-main__right">
                            {/*  --th-empty для app-search */}
                            <div className="app-main__search app-search --th-active">
                                <input
                                    type="text"
                                    placeholder="Text"
                                    className="app-search__elem"
                                    id="search"
                                    autoComplete="off"
                                    onChange={handleChange}
                                    value={inputValue}
                                />
                                <button className="app-search__delete line-btn-dark" onClick={handleClose}>
                                    <svg className="icon" viewBox="0 0 24 24" fill="none">
                                        <path
                                            d="M5 19L18.93 5M19 19L5.07 5"
                                            stroke="currentColor"
                                            strokeWidth={2}
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                        />
                                    </svg>
                                </button>
                                <div className="app-search__icon">
                                    <svg className="icon" viewBox="0 0 24 24" fill="none">
                                        <path
                                            d="M20 20L16.8889 16.8889M16.4444 10.2222C16.4444 11.0393 16.2835 11.8484 15.9708 12.6034C15.6581 13.3583 15.1998 14.0442 14.622 14.622C14.0442 15.1998 13.3583 15.6581 12.6034 15.9708C11.8484 16.2835 11.0393 16.4444 10.2222 16.4444C9.40511 16.4444 8.596 16.2835 7.84108 15.9708C7.08617 15.6581 6.40023 15.1998 5.82245 14.622C5.24466 14.0442 4.78633 13.3583 4.47364 12.6034C4.16094 11.8484 4 11.0393 4 10.2222C4 8.57199 4.65555 6.98934 5.82245 5.82245C6.98934 4.65555 8.57199 4 10.2222 4C11.8725 4 13.4551 4.65555 14.622 5.82245C15.7889 6.98934 16.4444 8.57199 16.4444 10.2222Z"
                                            stroke="currentColor"
                                            strokeWidth={2}
                                            strokeLinecap="round"
                                        />
                                    </svg>
                                </div>
                            </div>
                        </div>
                    </header>
                    <main className="app-main__mid">
                        <section className="app-dictionary">
                            {/* Top */}
                            <div className="app-dictionary__top">
                                <div className="filters-top">
                                    <div className="filters-top__left">
                                        {/* <div className="filters-categories --th-desktop" onClick={handleCategoryFilter}>
                                            <button className="filters-categories__select">
                                                <span>Категории:</span>
                                                <span>все</span>
                                                <svg className="icon" viewBox="0 0 12 12" fill="none">
                                                    <path
                                                        fillRule="evenodd"
                                                        clipRule="evenodd"
                                                        d="M9.21243 5.1355C9.74943 4.4835 9.28493 3.5 8.43993 3.5H3.55993C2.71493 3.5 2.25093 4.4835 2.78793 5.1355L5.22843 8.099C5.32225 8.21294 5.44012 8.30471 5.5736 8.36771C5.70707 8.43071 5.85284 8.46338 6.00043 8.46338C6.14803 8.46338 6.29379 8.43071 6.42727 8.36771C6.56074 8.30471 6.67862 8.21294 6.77243 8.099L9.21243 5.1355Z"
                                                        fill="#1F1E30"
                                                    />
                                                </svg>
                                            </button>
                                            <div className="dropdown-categories --th-dictionary">
                                                <ul className="dropdown-categories__list">
                                                    <li className="dropdown-categories__row">
                                                        <div className="dropdown-categories__name">
                                                            Выбрать все
                                                        </div>
                                                        <div className="dropdown-categories__checkbox">
                                                            <div className="app-checkbox">
                                                                <input
                                                                    type="checkbox"
                                                                    className="app-checkbox__input"
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
                                                    {newSet
                                                        .sort((a, b) => a.id - b.id)
                                                        .slice(firstContentIndex, lastContentIndex)
                                                        .map((word, index) => {
                                                            return (
                                                                <li className="dropdown-categories__row"
                                                                    info={`${word.category_word_id}`}
                                                                    key={word.id}
                                                                >
                                                                    <div className="dropdown-categories__name">{word.category}</div>
                                                                    <div className="dropdown-categories__checkbox">
                                                                        <div className="app-checkbox">
                                                                            <input
                                                                                type="checkbox"
                                                                                className="app-checkbox__input"
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
                                                        })}
                                                    }
                                                </ul>
                                            </div>
                                        </div> */}
                                        <button className="filters-top__add-word --th-mobile btn btn-dark" onClick={handleAddWord}>
                                            <svg className="icon" viewBox="0 0 25 24" fill="none">
                                                <path
                                                    d="M5.5 12H19.5M12.5 19V5"
                                                    stroke="currentColor"
                                                    strokeWidth={2}
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                />
                                            </svg>
                                            <span>Добавить слова</span>
                                        </button>
                                    </div>
                                    <div className="filters-top__right">
                                        <button className="filters-top__edit-categories btn btn-dark-outline" onClick={handleEditCat}>
                                            <svg className="icon" viewBox="0 0 25 24" fill="none">
                                                <path
                                                    d="M20.5 6H10.5M10.5 6C10.5 5.46957 10.2893 4.96086 9.91421 4.58579C9.53914 4.21071 9.03043 4 8.5 4C7.96957 4 7.46086 4.21071 7.08579 4.58579C6.71071 4.96086 6.5 5.46957 6.5 6M10.5 6C10.5 6.53043 10.2893 7.03914 9.91421 7.41421C9.53914 7.78929 9.03043 8 8.5 8C7.96957 8 7.46086 7.78929 7.08579 7.41421C6.71071 7.03914 6.5 6.53043 6.5 6M6.5 6H4.5M20.5 12H18.5M18.5 12C18.5 11.4696 18.2893 10.9609 17.9142 10.5858C17.5391 10.2107 17.0304 10 16.5 10C15.9696 10 15.4609 10.2107 15.0858 10.5858C14.7107 10.9609 14.5 11.4696 14.5 12M18.5 12C18.5 12.5304 18.2893 13.0391 17.9142 13.4142C17.5391 13.7893 17.0304 14 16.5 14C15.9696 14 15.4609 13.7893 15.0858 13.4142C14.7107 13.0391 14.5 12.5304 14.5 12M14.5 12H4.5M20.5 18H10.5M10.5 18C10.5 17.4696 10.2893 16.9609 9.91421 16.5858C9.53914 16.2107 9.03043 16 8.5 16C7.96957 16 7.46086 16.2107 7.08579 16.5858C6.71071 16.9609 6.5 17.4696 6.5 18M10.5 18C10.5 18.5304 10.2893 19.0391 9.91421 19.4142C9.53914 19.7893 9.03043 20 8.5 20C7.96957 20 7.46086 19.7893 7.08579 19.4142C6.71071 19.0391 6.5 18.5304 6.5 18M6.5 18H4.5"
                                                    stroke="currentColor"
                                                    strokeWidth={2}
                                                    strokeLinecap="round"
                                                />
                                            </svg>
                                            <span className="text">Редактировать категории</span>
                                        </button>
                                        <button className="filters-top__add-word --th-desktop btn btn-dark" onClick={handleAddWord}>
                                            <svg className="icon" viewBox="0 0 25 24" fill="none">
                                                <path
                                                    d="M5.5 12H19.5M12.5 19V5"
                                                    stroke="currentColor"
                                                    strokeWidth={2}
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                />
                                            </svg>
                                            <span>Добавить слова</span>
                                        </button>
                                        {/* <div className="filters-categories --th-mobile">
                                            <button className="filters-categories__select">
                                                <span>Категории:</span>
                                                <span>все</span>
                                                <svg className="icon" viewBox="0 0 12 12" fill="none">
                                                    <path
                                                        fillRule="evenodd"
                                                        clipRule="evenodd"
                                                        d="M9.21243 5.1355C9.74943 4.4835 9.28493 3.5 8.43993 3.5H3.55993C2.71493 3.5 2.25093 4.4835 2.78793 5.1355L5.22843 8.099C5.32225 8.21294 5.44012 8.30471 5.5736 8.36771C5.70707 8.43071 5.85284 8.46338 6.00043 8.46338C6.14803 8.46338 6.29379 8.43071 6.42727 8.36771C6.56074 8.30471 6.67862 8.21294 6.77243 8.099L9.21243 5.1355Z"
                                                        fill="#1F1E30"
                                                    />
                                                </svg>
                                            </button>
                                            <div className="dropdown-categories --th-dictionary">
                                                <ul className="dropdown-categories__list">
                                                    <li className="dropdown-categories__row">
                                                        <div className="dropdown-categories__name">
                                                            Выбрать все
                                                        </div>
                                                        <div className="dropdown-categories__checkbox">
                                                            <div className="app-checkbox">
                                                                <input
                                                                    type="checkbox"
                                                                    className="app-checkbox__input"
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
                                                    <li className="dropdown-categories__row">
                                                        <div className="dropdown-categories__name">Слова</div>
                                                        <div className="dropdown-categories__checkbox">
                                                            <div className="app-checkbox">
                                                                <input
                                                                    type="checkbox"
                                                                    className="app-checkbox__input"
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
                                                    <li className="dropdown-categories__row">
                                                        <div className="dropdown-categories__name">Слова</div>
                                                        <div className="dropdown-categories__checkbox">
                                                            <div className="app-checkbox">
                                                                <input
                                                                    type="checkbox"
                                                                    className="app-checkbox__input"
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
                                                    <li className="dropdown-categories__row">
                                                        <div className="dropdown-categories__name">Слова</div>
                                                        <div className="dropdown-categories__checkbox">
                                                            <div className="app-checkbox">
                                                                <input
                                                                    type="checkbox"
                                                                    className="app-checkbox__input"
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
                                                    <li className="dropdown-categories__row">
                                                        <div className="dropdown-categories__name">Слова</div>
                                                        <div className="dropdown-categories__checkbox">
                                                            <div className="app-checkbox">
                                                                <input
                                                                    type="checkbox"
                                                                    className="app-checkbox__input"
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
                                                    <li className="dropdown-categories__row">
                                                        <div className="dropdown-categories__name">Слова</div>
                                                        <div className="dropdown-categories__checkbox">
                                                            <div className="app-checkbox">
                                                                <input
                                                                    type="checkbox"
                                                                    className="app-checkbox__input"
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
                                                    <li className="dropdown-categories__row">
                                                        <div className="dropdown-categories__name">Слова</div>
                                                        <div className="dropdown-categories__checkbox">
                                                            <div className="app-checkbox">
                                                                <input
                                                                    type="checkbox"
                                                                    className="app-checkbox__input"
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
                                                    <li className="dropdown-categories__row">
                                                        <div className="dropdown-categories__name">Слова</div>
                                                        <div className="dropdown-categories__checkbox">
                                                            <div className="app-checkbox">
                                                                <input
                                                                    type="checkbox"
                                                                    className="app-checkbox__input"
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
                                                    <li className="dropdown-categories__row">
                                                        <div className="dropdown-categories__name">Слова</div>
                                                        <div className="dropdown-categories__checkbox">
                                                            <div className="app-checkbox">
                                                                <input
                                                                    type="checkbox"
                                                                    className="app-checkbox__input"
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
                                                </ul>
                                            </div>
                                        </div> */}
                                    </div>
                                </div>
                            </div>
                            {/* Mid */}
                            <div className="app-dictionary__mid">
                                <table className="table app-dictionary__table">
                                    <thead className="table__head">
                                        <tr className="table__row">
                                            <td className="table__ceil">
                                                Слово
                                                <div className="app-checkbox">
                                                    <input type="checkbox" className="app-checkbox__input" />
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
                                            </td>
                                            <td className="table__ceil">Перевод</td>
                                            <td className="table__ceil">Категория</td>
                                            <td className="table__ceil" />
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {wordsArr
                                            .sort((a, b) => a.id - b.id)
                                            .slice(firstContentIndex, lastContentIndex)
                                            .map((word, index) => {
                                                return (
                                                    <tr className="table__ceil"
                                                        info={`${word.id}+${word.foreign_word}+${word.russian_word}+${word.category}+${word.category_word_id}`}
                                                        key={word.id}
                                                    >
                                                        <th className="table__ceil">
                                                            {" "}
                                                            <div className="app-checkbox">
                                                                <input type="checkbox" className="app-checkbox__input" />
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
                                                            </div>{" "}
                                                            {word.foreign_word}
                                                        </th>
                                                        <th className="table__ceil">{word.russian_word}</th>
                                                        <th className="table__ceil">{word.category}</th>
                                                        {/* <th className="table__ceil">
                                                            <div className="more-btn ">
                                                                <button className="more-btn__btn" onClick={handleWordBtn}>
                                                                    <svg className="icon" viewBox="0 0 24 24" fill="none">
                                                                        <path
                                                                            d="M12 6H12.01M12 12H12.01M12 18H12.01"
                                                                            stroke="currentColor"
                                                                            strokeWidth={3}
                                                                            strokeLinecap="round"
                                                                        />
                                                                    </svg>
                                                                </button>
                                                                <ul className="more-btn__menu">
                                                                    <li className="more-btn__item">
                                                                        <button className="more-btn__item-btn line-btn-dark">
                                                                            <svg
                                                                                className="icon"
                                                                                viewBox="0 0 24 24"
                                                                                fill="none"
                                                                            >
                                                                                <path
                                                                                    d="M8.5 11.5L11 14L15 10M21 12C21 13.1819 20.7672 14.3522 20.3149 15.4442C19.8626 16.5361 19.1997 17.5282 18.364 18.364C17.5282 19.1997 16.5361 19.8626 15.4442 20.3149C14.3522 20.7672 13.1819 21 12 21C10.8181 21 9.64778 20.7672 8.55585 20.3149C7.46392 19.8626 6.47177 19.1997 5.63604 18.364C4.80031 17.5282 4.13738 16.5361 3.68508 15.4442C3.23279 14.3522 3 13.1819 3 12C3 9.61305 3.94821 7.32387 5.63604 5.63604C7.32387 3.94821 9.61305 3 12 3C14.3869 3 16.6761 3.94821 18.364 5.63604C20.0518 7.32387 21 9.61305 21 12Z"
                                                                                    stroke="currentColor"
                                                                                    strokeWidth={2}
                                                                                    strokeLinecap="round"
                                                                                    strokeLinejoin="round"
                                                                                />
                                                                            </svg>
                                                                            <span>Выбрать</span>
                                                                        </button>
                                                                    </li>
                                                                    <li className="more-btn__item">
                                                                        <button className="more-btn__item-btn line-btn-dark">
                                                                            <svg className="icon" viewBox="0 0 24 24">
                                                                                <path
                                                                                    fill="none"
                                                                                    d="M15.717 4.07486L18.9255 7.28329M7.49999 6.5003H4.125C3.82663 6.5003 3.54048 6.61883 3.3295 6.8298C3.11853 7.04078 3 7.32692 3 7.62528V18.875C3 19.1734 3.11853 19.4595 3.3295 19.6705C3.54048 19.8815 3.82663 20 4.125 20H16.5C16.7983 20 17.0845 19.8815 17.2955 19.6705C17.5064 19.4595 17.625 19.1734 17.625 18.875V13.8126M20.3351 2.66414C20.5459 2.87485 20.7131 3.12503 20.8272 3.40038C20.9413 3.67574 21 3.97087 21 4.26892C21 4.56697 20.9413 4.8621 20.8272 5.13745C20.7131 5.4128 20.5459 5.66298 20.3351 5.87369L12.6356 13.573L8.62499 14.3751L9.42711 10.3646L17.1266 2.66527C17.3371 2.45437 17.5872 2.28706 17.8625 2.17291C18.1378 2.05876 18.4328 2 18.7308 2C19.0289 2 19.3239 2.05876 19.5992 2.17291C19.8745 2.28706 20.1245 2.45437 20.3351 2.66527V2.66414Z"
                                                                                    stroke="currentColor"
                                                                                    strokeWidth={2}
                                                                                    strokeLinecap="round"
                                                                                    strokeLinejoin="round"
                                                                                />
                                                                            </svg>
                                                                            <span>Редактировать</span>
                                                                        </button>
                                                                    </li>
                                                                    <li className="more-btn__item">
                                                                        <button className="more-btn__item-btn line-btn-red">
                                                                            <svg className="icon" viewBox="0 0 24 24">
                                                                                <path
                                                                                    d="M5 7H19M10 10V18M14 10V18M10 3H14C14.2652 3 14.5196 3.10536 14.7071 3.29289C14.8946 3.48043 15 3.73478 15 4V7H9V4C9 3.73478 9.10536 3.48043 9.29289 3.29289C9.48043 3.10536 9.73478 3 10 3ZM6 7H18V20C18 20.2652 17.8946 20.5196 17.7071 20.7071C17.5196 20.8946 17.2652 21 17 21H7C6.73478 21 6.48043 20.8946 6.29289 20.7071C6.10536 20.5196 6 20.2652 6 20V7Z"
                                                                                    stroke="currentColor"
                                                                                    strokeWidth={2}
                                                                                    fill="none"
                                                                                    strokeLinecap="round"
                                                                                    strokeLinejoin="round"
                                                                                />
                                                                            </svg>
                                                                            <span>Удалить</span>
                                                                        </button>
                                                                    </li>
                                                                </ul>
                                                            </div>
                                                        </th> */}
                                                    </tr>
                                                )
                                            })}
                                        {/* <tr>
                                            <th className="table__ceil">
                                                {" "}
                                                <div className="app-checkbox">
                                                    <input type="checkbox" className="app-checkbox__input" />
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
                                                </div>{" "}
                                                Backbone interface
                                            </th>
                                            <th className="table__ceil">Главное подключение</th>
                                            <th className="table__ceil">IT</th>
                                            <th className="table__ceil">
                                                <div className="more-btn ">
                                                    <button className="more-btn__btn">
                                                        <svg className="icon" viewBox="0 0 24 24" fill="none">
                                                            <path
                                                                d="M12 6H12.01M12 12H12.01M12 18H12.01"
                                                                stroke="currentColor"
                                                                strokeWidth={3}
                                                                strokeLinecap="round"
                                                            />
                                                        </svg>
                                                    </button>
                                                    <ul className="more-btn__menu">
                                                        <li className="more-btn__item">
                                                            <button className="more-btn__item-btn line-btn-dark">
                                                                <svg
                                                                    className="icon"
                                                                    viewBox="0 0 24 24"
                                                                    fill="none"
                                                                >
                                                                    <path
                                                                        d="M8.5 11.5L11 14L15 10M21 12C21 13.1819 20.7672 14.3522 20.3149 15.4442C19.8626 16.5361 19.1997 17.5282 18.364 18.364C17.5282 19.1997 16.5361 19.8626 15.4442 20.3149C14.3522 20.7672 13.1819 21 12 21C10.8181 21 9.64778 20.7672 8.55585 20.3149C7.46392 19.8626 6.47177 19.1997 5.63604 18.364C4.80031 17.5282 4.13738 16.5361 3.68508 15.4442C3.23279 14.3522 3 13.1819 3 12C3 9.61305 3.94821 7.32387 5.63604 5.63604C7.32387 3.94821 9.61305 3 12 3C14.3869 3 16.6761 3.94821 18.364 5.63604C20.0518 7.32387 21 9.61305 21 12Z"
                                                                        stroke="currentColor"
                                                                        strokeWidth={2}
                                                                        strokeLinecap="round"
                                                                        strokeLinejoin="round"
                                                                    />
                                                                </svg>
                                                                <span>Выбрать</span>
                                                            </button>
                                                        </li>
                                                        <li className="more-btn__item">
                                                            <button className="more-btn__item-btn line-btn-dark">
                                                                <svg className="icon" viewBox="0 0 24 24">
                                                                    <path
                                                                        fill="none"
                                                                        d="M15.717 4.07486L18.9255 7.28329M7.49999 6.5003H4.125C3.82663 6.5003 3.54048 6.61883 3.3295 6.8298C3.11853 7.04078 3 7.32692 3 7.62528V18.875C3 19.1734 3.11853 19.4595 3.3295 19.6705C3.54048 19.8815 3.82663 20 4.125 20H16.5C16.7983 20 17.0845 19.8815 17.2955 19.6705C17.5064 19.4595 17.625 19.1734 17.625 18.875V13.8126M20.3351 2.66414C20.5459 2.87485 20.7131 3.12503 20.8272 3.40038C20.9413 3.67574 21 3.97087 21 4.26892C21 4.56697 20.9413 4.8621 20.8272 5.13745C20.7131 5.4128 20.5459 5.66298 20.3351 5.87369L12.6356 13.573L8.62499 14.3751L9.42711 10.3646L17.1266 2.66527C17.3371 2.45437 17.5872 2.28706 17.8625 2.17291C18.1378 2.05876 18.4328 2 18.7308 2C19.0289 2 19.3239 2.05876 19.5992 2.17291C19.8745 2.28706 20.1245 2.45437 20.3351 2.66527V2.66414Z"
                                                                        stroke="currentColor"
                                                                        strokeWidth={2}
                                                                        strokeLinecap="round"
                                                                        strokeLinejoin="round"
                                                                    />
                                                                </svg>
                                                                <span>Редактировать</span>
                                                            </button>
                                                        </li>
                                                        <li className="more-btn__item">
                                                            <button className="more-btn__item-btn line-btn-red">
                                                                <svg className="icon" viewBox="0 0 24 24">
                                                                    <path
                                                                        d="M5 7H19M10 10V18M14 10V18M10 3H14C14.2652 3 14.5196 3.10536 14.7071 3.29289C14.8946 3.48043 15 3.73478 15 4V7H9V4C9 3.73478 9.10536 3.48043 9.29289 3.29289C9.48043 3.10536 9.73478 3 10 3ZM6 7H18V20C18 20.2652 17.8946 20.5196 17.7071 20.7071C17.5196 20.8946 17.2652 21 17 21H7C6.73478 21 6.48043 20.8946 6.29289 20.7071C6.10536 20.5196 6 20.2652 6 20V7Z"
                                                                        stroke="currentColor"
                                                                        strokeWidth={2}
                                                                        fill="none"
                                                                        strokeLinecap="round"
                                                                        strokeLinejoin="round"
                                                                    />
                                                                </svg>
                                                                <span>Удалить</span>
                                                            </button>
                                                        </li>
                                                    </ul>
                                                </div>
                                            </th>
                                        </tr> */}
                                    </tbody>
                                </table>
                                < ul className="app-dictionary__list dictionary-mob">
                                    {wordsArr
                                        .sort((a, b) => a.id - b.id)
                                        // .slice(firstContentIndex, lastContentIndex)
                                        .map((word, index) => {
                                            return (
                                                <li className="dictionary-mob__item"
                                                    info={`${word.id}+${word.foreign_word}+${word.russian_word}+${word.category}+${word.category_word_id}`}
                                                    key={word.id}
                                                >
                                                    <div className="dictionary-mob__item-inner">
                                                        <p className="dictionary-mob__categories">{word.category}</p>
                                                        <h3 className="dictionary-mob__title">
                                                            {word.foreign_word}
                                                        </h3>
                                                        <p className="dictionary-mob__text">
                                                            {word.russian_word}
                                                        </p>
                                                        {/* <div className="dictionary-mob__btn">
                                                            <div className="more-btn ">
                                                                <button className="more-btn__btn" onClick={handleWordBtn}>
                                                                    <svg className="icon" viewBox="0 0 24 24" fill="none">
                                                                        <path
                                                                            d="M12 6H12.01M12 12H12.01M12 18H12.01"
                                                                            stroke="currentColor"
                                                                            strokeWidth={3}
                                                                            strokeLinecap="round"
                                                                        />
                                                                    </svg>
                                                                </button>
                                                                <ul className="more-btn__menu">
                                                                    <li className="more-btn__item">
                                                                        <button className="more-btn__item-btn line-btn-dark">
                                                                            <svg
                                                                                className="icon"
                                                                                viewBox="0 0 24 24"
                                                                                fill="none"
                                                                            >
                                                                                <path
                                                                                    d="M8.5 11.5L11 14L15 10M21 12C21 13.1819 20.7672 14.3522 20.3149 15.4442C19.8626 16.5361 19.1997 17.5282 18.364 18.364C17.5282 19.1997 16.5361 19.8626 15.4442 20.3149C14.3522 20.7672 13.1819 21 12 21C10.8181 21 9.64778 20.7672 8.55585 20.3149C7.46392 19.8626 6.47177 19.1997 5.63604 18.364C4.80031 17.5282 4.13738 16.5361 3.68508 15.4442C3.23279 14.3522 3 13.1819 3 12C3 9.61305 3.94821 7.32387 5.63604 5.63604C7.32387 3.94821 9.61305 3 12 3C14.3869 3 16.6761 3.94821 18.364 5.63604C20.0518 7.32387 21 9.61305 21 12Z"
                                                                                    stroke="currentColor"
                                                                                    strokeWidth={2}
                                                                                    strokeLinecap="round"
                                                                                    strokeLinejoin="round"
                                                                                />
                                                                            </svg>
                                                                            <span>Выбрать</span>
                                                                        </button>
                                                                    </li>
                                                                    <li className="more-btn__item">
                                                                        <button className="more-btn__item-btn line-btn-dark">
                                                                            <svg className="icon" viewBox="0 0 24 24">
                                                                                <path
                                                                                    fill="none"
                                                                                    d="M15.717 4.07486L18.9255 7.28329M7.49999 6.5003H4.125C3.82663 6.5003 3.54048 6.61883 3.3295 6.8298C3.11853 7.04078 3 7.32692 3 7.62528V18.875C3 19.1734 3.11853 19.4595 3.3295 19.6705C3.54048 19.8815 3.82663 20 4.125 20H16.5C16.7983 20 17.0845 19.8815 17.2955 19.6705C17.5064 19.4595 17.625 19.1734 17.625 18.875V13.8126M20.3351 2.66414C20.5459 2.87485 20.7131 3.12503 20.8272 3.40038C20.9413 3.67574 21 3.97087 21 4.26892C21 4.56697 20.9413 4.8621 20.8272 5.13745C20.7131 5.4128 20.5459 5.66298 20.3351 5.87369L12.6356 13.573L8.62499 14.3751L9.42711 10.3646L17.1266 2.66527C17.3371 2.45437 17.5872 2.28706 17.8625 2.17291C18.1378 2.05876 18.4328 2 18.7308 2C19.0289 2 19.3239 2.05876 19.5992 2.17291C19.8745 2.28706 20.1245 2.45437 20.3351 2.66527V2.66414Z"
                                                                                    stroke="currentColor"
                                                                                    strokeWidth={2}
                                                                                    strokeLinecap="round"
                                                                                    strokeLinejoin="round"
                                                                                />
                                                                            </svg>
                                                                            <span>Редактировать</span>
                                                                        </button>
                                                                    </li>
                                                                    <li className="more-btn__item">
                                                                        <button className="more-btn__item-btn line-btn-red">
                                                                            <svg className="icon" viewBox="0 0 24 24">
                                                                                <path
                                                                                    d="M5 7H19M10 10V18M14 10V18M10 3H14C14.2652 3 14.5196 3.10536 14.7071 3.29289C14.8946 3.48043 15 3.73478 15 4V7H9V4C9 3.73478 9.10536 3.48043 9.29289 3.29289C9.48043 3.10536 9.73478 3 10 3ZM6 7H18V20C18 20.2652 17.8946 20.5196 17.7071 20.7071C17.5196 20.8946 17.2652 21 17 21H7C6.73478 21 6.48043 20.8946 6.29289 20.7071C6.10536 20.5196 6 20.2652 6 20V7Z"
                                                                                    stroke="currentColor"
                                                                                    strokeWidth={2}
                                                                                    fill="none"
                                                                                    strokeLinecap="round"
                                                                                    strokeLinejoin="round"
                                                                                />
                                                                            </svg>
                                                                            <span>Удалить</span>
                                                                        </button>
                                                                    </li>
                                                                </ul>
                                                            </div>
                                                        </div> */}
                                                    </div>
                                                </li>
                                            )
                                        })}
                                </ul>
                            </div>
                            {/* Footer */}
                            <div className="app-dictionary__bot">

                                <div className="pagination">
                                    <div className="pagination__settings">
                                        <span className="label">На странице</span>
                                        <span className="current" onClick={handleItems}>{countItems} слов</span >
                                        {/* <svg className="icon" viewBox="0 0 12 12" fill="none" onClick={handleItems}>
                                            <path
                                                fillRule="evenodd"
                                                clipRule="evenodd"
                                                d="M9.21292 5.1355C9.74992 4.4835 9.28542 3.5 8.44042 3.5H3.56042C2.71542 3.5 2.25142 4.4835 2.78842 5.1355L5.22892 8.099C5.32273 8.21294 5.44061 8.30471 5.57408 8.36771C5.70756 8.43071 5.85332 8.46338 6.00092 8.46338C6.14852 8.46338 6.29428 8.43071 6.42776 8.36771C6.56123 8.30471 6.6791 8.21294 6.77292 8.099L9.21292 5.1355Z"
                                                fill="#1F1E30"
                                            />
                                        </svg> */}
                                        {/* Добавить --th-active для pagination__settings-dropdown */}

                                        <ul className="pagination__settings-dropdown">
                                            <li className="pagination__settings-item">
                                                <button className="pagination__settings-btn" value='5' onClick={handleItems2}>5</button>
                                            </li>
                                            <li className="pagination__settings-item">
                                                {/* --th-current */}
                                                <button className="pagination__settings-btn  line-btn-grey" value='15' onClick={handleItems2}>
                                                    15
                                                </button>
                                            </li>
                                            <li className="pagination__settings-item">
                                                <button className="pagination__settings-btn line-btn-grey" value='30' onClick={handleItems2}>
                                                    30
                                                </button>
                                            </li>
                                            <li className="pagination__settings-item">
                                                <button className="pagination__settings-btn line-btn-grey" value='45' onClick={handleItems2}>
                                                    45
                                                </button>
                                            </li>
                                            <li className="pagination__settings-item" value={wordsArr.length} onClick={handleItems2}>
                                                <button className="pagination__settings-btn line-btn-grey">
                                                    {wordsArr.length}
                                                </button>
                                            </li>
                                        </ul>
                                    </div>
                                    <ul className="pagination__dots">
                                        <li className="pagination__dot">
                                            <button className="pagination__dot-btn --th-prev" onClick={prevPage}>
                                                <svg viewBox="0 0 25 24" fill="none">
                                                    <path
                                                        d="M14.5 16L10.5 12L14.5 8"
                                                        stroke="currentColor"
                                                        strokeWidth={2}
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                    />
                                                </svg>
                                            </button>
                                        </li>

                                        {/* Сделать нормальную пагинацию */}

                                        <li className="pagination__dot">
                                            <button className="pagination__dot-btn">{page}</button>
                                        </li>
                                        <li className="pagination__dot">
                                            <button className="pagination__dot-btn">из</button>
                                        </li>
                                        <li className="pagination__dot">
                                            <button className="pagination__dot-btn">{totalPages}</button>
                                        </li>

                                        {/* <li className="pagination__dot">
                                            <button className="pagination__dot-btn">1</button>
                                        </li>
                                        <li className="pagination__dot">
                                            <button className="pagination__dot-btn --th-current">
                                                2
                                            </button>
                                        </li>
                                        <li className="pagination__dot">
                                            <button className="pagination__dot-btn">...</button>
                                        </li>
                                        <li className="pagination__dot">
                                            <button className="pagination__dot-btn">11</button>
                                        </li>
                                        <li className="pagination__dot">
                                            <button className="pagination__dot-btn">12</button>
                                        </li> */}
                                        <li className="pagination__dot">
                                            <button className="pagination__dot-btn --th-next" onClick={nextPage}>
                                                <svg viewBox="0 0 25 24" fill="none">
                                                    <path
                                                        d="M14.5 16L10.5 12L14.5 8"
                                                        stroke="currentColor"
                                                        strokeWidth={2}
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                    />
                                                </svg>
                                            </button>
                                        </li>
                                    </ul>
                                    <div className="pagination__all">Всего {wordsArr.length} слов</div>
                                </div>
                            </div>
                        </section>
                    </main>
                    <FooterInner />
                </main>
            </div >
            {/* <MobileMenu /> */}
            < div className="app-selected" >
                <div className="app-selected__inner">
                    <p className="app-selected__left">Выбрано 3 из 79</p>
                    <ul className="app-selected__actions">
                        <li className="app-selected__item">
                            <button className="app-selected__btn">
                                <svg className="icon" viewBox="0 0 24 24" fill="none">
                                    <path
                                        d="M15.717 4.07486L18.9255 7.28329M7.49999 6.5003H4.125C3.82663 6.5003 3.54048 6.61883 3.3295 6.8298C3.11853 7.04078 3 7.32692 3 7.62528V18.875C3 19.1734 3.11853 19.4595 3.3295 19.6705C3.54048 19.8815 3.82663 20 4.125 20H16.5C16.7983 20 17.0845 19.8815 17.2955 19.6705C17.5064 19.4595 17.625 19.1734 17.625 18.875V13.8126M20.3351 2.66414C20.5459 2.87485 20.7131 3.12503 20.8272 3.40038C20.9413 3.67574 21 3.97087 21 4.26892C21 4.56697 20.9413 4.8621 20.8272 5.13745C20.7131 5.4128 20.5459 5.66298 20.3351 5.87369L12.6356 13.573L8.62499 14.3751L9.42711 10.3646L17.1266 2.66527C17.3371 2.45437 17.5872 2.28706 17.8625 2.17291C18.1378 2.05876 18.4328 2 18.7308 2C19.0289 2 19.3239 2.05876 19.5992 2.17291C19.8745 2.28706 20.1245 2.45437 20.3351 2.66527V2.66414Z"
                                        stroke="currentColor"
                                        strokeWidth={2}
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    />
                                </svg>
                                <span>Редактировать</span>
                            </button>
                        </li>
                        <li className="app-selected__item">
                            <button className="app-selected__btn">
                                <svg className="icon" viewBox="0 0 24 24" fill="none">
                                    <path
                                        d="M20 6H10M10 6C10 5.46957 9.78929 4.96086 9.41421 4.58579C9.03914 4.21071 8.53043 4 8 4C7.46957 4 6.96086 4.21071 6.58579 4.58579C6.21071 4.96086 6 5.46957 6 6M10 6C10 6.53043 9.78929 7.03914 9.41421 7.41421C9.03914 7.78929 8.53043 8 8 8C7.46957 8 6.96086 7.78929 6.58579 7.41421C6.21071 7.03914 6 6.53043 6 6M6 6H4M20 12H18M18 12C18 11.4696 17.7893 10.9609 17.4142 10.5858C17.0391 10.2107 16.5304 10 16 10C15.4696 10 14.9609 10.2107 14.5858 10.5858C14.2107 10.9609 14 11.4696 14 12M18 12C18 12.5304 17.7893 13.0391 17.4142 13.4142C17.0391 13.7893 16.5304 14 16 14C15.4696 14 14.9609 13.7893 14.5858 13.4142C14.2107 13.0391 14 12.5304 14 12M14 12H4M20 18H10M10 18C10 17.4696 9.78929 16.9609 9.41421 16.5858C9.03914 16.2107 8.53043 16 8 16C7.46957 16 6.96086 16.2107 6.58579 16.5858C6.21071 16.9609 6 17.4696 6 18M10 18C10 18.5304 9.78929 19.0391 9.41421 19.4142C9.03914 19.7893 8.53043 20 8 20C7.46957 20 6.96086 19.7893 6.58579 19.4142C6.21071 19.0391 6 18.5304 6 18M6 18H4"
                                        stroke="currentColor"
                                        strokeWidth={2}
                                        strokeLinecap="round"
                                    />
                                </svg>
                                <span>Выбрать категорию</span>
                            </button>
                        </li>
                        <li className="app-selected__item">
                            <button className="app-selected__btn">
                                <svg className="icon" viewBox="0 0 24 24" fill="none">
                                    <path
                                        d="M5 7H19M10 10V18M14 10V18M10 3H14C14.2652 3 14.5196 3.10536 14.7071 3.29289C14.8946 3.48043 15 3.73478 15 4V7H9V4C9 3.73478 9.10536 3.48043 9.29289 3.29289C9.48043 3.10536 9.73478 3 10 3ZM6 7H18V20C18 20.2652 17.8946 20.5196 17.7071 20.7071C17.5196 20.8946 17.2652 21 17 21H7C6.73478 21 6.48043 20.8946 6.29289 20.7071C6.10536 20.5196 6 20.2652 6 20V7Z"
                                        stroke="currentColor"
                                        strokeWidth={2}
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    />
                                </svg>
                                <span>Удалить</span>
                            </button>
                        </li>
                        <li className="app-selected__item">
                            <button className="app-selected__btn">
                                <svg
                                    className="icon"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path
                                        d="M7 17L14.96 9M15 17L7.04 9"
                                        stroke="currentColor"
                                        strokeWidth={2}
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    />
                                </svg>
                                <span>Отменить</span>
                            </button>
                        </li>
                    </ul>
                </div>
            </div >

            {/* Вызываем форму добавления слова */}
            {activeModalAdd && <WordForm wordInfo={wordInfo} setActive={setActiveModalAdd} />}
            {activeModalEdit && <Categories wordInfo={wordInfo} setActive={setActiveModalEdit} />}
        </>

    )
}