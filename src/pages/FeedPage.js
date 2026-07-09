import React, { useState, useEffect, useLayoutEffect, useCallback } from 'react';
import { useHttp } from '../hooks/http.hook';
import { useMessage } from '../hooks/message.hook';
import { Aside } from '../components/Aside';
import { useHistory } from 'react-router-dom/cjs/react-router-dom.min';
import { Loader } from '../components/Loader';
import { FooterInner } from '../components/Footer';
import EyeOpen from '../images/Eye-Open.svg'

export const FeedPage = () => {
    const message = useMessage();
    const history = useHistory();
    const [deleteModal, setDeleteModal] = useState(false);
    const [noteId, setNoteId] = useState();
    const [active, setModalActive] = useState(false);
    const [articles, setArticles] = useState([]);
    const { loading, request } = useHttp();
    const [inputValue, setInputValue] = useState('')
    const [filter, setFilter] = useState('Все статьи');
    const [filterValue, setFilterValue] = useState('any');
    const [offset, setOffset] = useState(2);

    function menuSearch() {
        let phrase = document.querySelector('.app-search__elem');
        let navItemTopics = document.querySelector('.app-cards__inner');
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
    };

    const handleChange = (e) => {
        setInputValue(e.target.value)
        menuSearch();
    };

    const handleRead = (e) => {
        e.target.closest(".card-note").childNodes[1].childNodes[2].style.webkitLineClamp = 3000;
    };

    const handleLike = async (e) => {
        const articleId = e.target.closest('.app-cards__item').getAttribute('info');

        try {
            const data = await request(`/article/like/${articleId}`, 'POST', {});
            if (data.hasOwnProperty('error')) {
                message(data.message || data.error, false);
                return;
            }

            message(data.message, true);
            setOffset(2);
            //   Тут добавить обновление стиля на лайке
            getArticles(filterValue, 0);
        } catch (error) {
            message(error, false);
        }
    };

    // Раскрытие списка фильтров
    const handleFilter = (e) => {
        document.querySelector(".dropdown-categories").classList.toggle('--th-active');
    };

    const handleCheckFilter = async (e) => {
        setFilter(e.target.closest('.dropdown-categories__row').getAttribute('name'));
        setFilterValue(e.target.value);
        setOffset(2);

        getArticles(e.target.value, 0);

        document.querySelector(".dropdown-categories").classList.toggle('--th-active');
    }

    const handleGetMoreArt = async (e) => {
        getArticles(filterValue, (offset - 1) * 10, articles);
        setOffset(offset + 1)
    };

    const getArticles = async function fetchData(fil, off, arr = []) {

        try {
            const data = await request(`/article/feed?filter=${fil}&offset=${off}`, 'GET', {});
            if (data.hasOwnProperty('error')) {
                message(data.message || data.error, false);
                return;
            }

            setArticles(arr.concat(data.data));

            if (data.data.length < 10) {
                return document.querySelector('.filters-down__more').classList.add('--th-disable');
            }
        } catch (error) {
            message(error, false);
        }
    };

    useEffect(() => {
        getArticles(filterValue, 0, articles);
    }, [noteId])


    return (
        <>
            <div className="app-inner">
                <Aside />
                <main className="app-main">
                    <header className="app-main__top">
                        <div className="app-main__left">
                            <h1 className="app-main__title">Статьи</h1>
                        </div>
                        <div className="app-main__right">
                            {/*  --th-empty для app-search */}
                            <div className="app-main__search app-search --th-active">
                                <input
                                    type="text"
                                    placeholder="Search text"
                                    className="app-search__elem"
                                    id="search"
                                    autoComplete="off"
                                    onChange={handleChange}
                                    value={inputValue}
                                />
                                <button className="app-search__delete line-btn-dark" onClick={menuSearch}>
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
                    {loading && <Loader />}

                    {!loading &&
                        <main className="app-main__mid">
                            <section className="app-cards">
                                <p class="quiz-categories__current">Привет в новом разделе! <br />Теперь можно читать статьи, которые публикуют другие пользователи <br />(доступно для роли: Преподаватель на компьютере)</p>
                                {/* <div class="filters-top__left">
                                    <div class="filters-categories">
                                        <button class="filters-categories__select" onClick={handleFilter}>
                                            <span>Показать: {filter}</span>
                                            <svg class="icon" viewBox="0 0 12 12" fill="none">
                                                <path fill-rule="evenodd" clip-rule="evenodd" d="M9.21243 5.1355C9.74943 4.4835 9.28493 3.5 8.43993 3.5H3.55993C2.71493 3.5 2.25093 4.4835 2.78793 5.1355L5.22843 8.099C5.32225 8.21294 5.44012 8.30471 5.5736 8.36771C5.70707 8.43071 5.85284 8.46338 6.00043 8.46338C6.14803 8.46338 6.29379 8.43071 6.42727 8.36771C6.56074 8.30471 6.67862 8.21294 6.77243 8.099L9.21243 5.1355Z" fill="#1F1E30"></path>
                                            </svg>
                                        </button>
                                        <div class="dropdown-categories --th-dictionary">
                                            <ul class="dropdown-categories__list">
                                                <li class="dropdown-categories__row" name='Все статьи'>
                                                    <div class="dropdown-categories__name">Все статьи</div>
                                                    <div class="dropdown-categories__checkbox">
                                                        <div class="app-checkbox">
                                                            <input type="checkbox" class="app-checkbox__input" value='any' onChange={handleCheckFilter} />
                                                            <div class="app-checkbox__elem">
                                                                <svg class="app-checkbox__icon" viewBox="0 0 14 10" fill="none">
                                                                    <path d="M1.16699 4.93083L5.10366 8.75L12.8337 1.25" stroke="#F6F6F1" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path>
                                                                </svg>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </li>
                                                <li class="dropdown-categories__row" name='Понравившиеся статьи'>
                                                    <div class="dropdown-categories__name">Понравившиеся статьи</div>
                                                    <div class="dropdown-categories__checkbox">
                                                        <div class="app-checkbox">
                                                            <input type="checkbox" class="app-checkbox__input" value='liked' onChange={handleCheckFilter} />
                                                            <div class="app-checkbox__elem">
                                                                <svg class="app-checkbox__icon" viewBox="0 0 14 10" fill="none">
                                                                    <path d="M1.16699 4.93083L5.10366 8.75L12.8337 1.25" stroke="#F6F6F1" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path>
                                                                </svg>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </li>
                                            </ul>
                                        </div>
                                    </div>
                                </div> */}
                                <ul className="app-cards__inner feed">
                                    {articles
                                        .map((article, index) => {
                                            return (
                                                <li className="app-cards__item" key={article.id} info={article.id}>
                                                    <div className="card card-note">
                                                        <div className="card-note__top">
                                                            <p className="card-note__date">{article.date_create ? article.date_create.substring(0, 10) : ''}</p>
                                                        </div>
                                                        <div className="card-note__content feed">
                                                            <h3 className="card-note__title">{article.theme}</h3>
                                                            <h4 className="card-note__title">{article.category}</h4>
                                                            <p className="card-note__text">
                                                                {article.text_art}
                                                            </p>
                                                        </div>
                                                        <div className="card-note__actions">
                                                            <button className="card-note__btn" onClick={handleRead}>
                                                                <img
                                                                    src={EyeOpen}
                                                                    alt="empty-secondary"
                                                                    className="feed-eye__img"
                                                                />
                                                            </button>
                                                            {/* <button
                                                                className={`place-card__like-icon ${article.liked ? '--the-liked' : ''}`}
                                                                onClick={handleLike}
                                                            >
                                                            </button> */}
                                                        </div>
                                                    </div>
                                                </li>
                                            )
                                        })}
                                </ul>

                            </section>
                            <div className="filters-top__left">
                                <button className=" btn btn-dark filters-down__more" onClick={handleGetMoreArt}>
                                    <svg className="icon" viewBox="0 0 25 24" fill="none">
                                        <path
                                            d="M5.5 12H19.5M12.5 19V5"
                                            stroke="currentColor"
                                            strokeWidth={2}
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                        />
                                    </svg>
                                    <span>Еще статьи</span>
                                </button>
                            </div>
                        </main>
                    }
                    <FooterInner />
                </main>
            </div>
            {/* <MobileMenu /> */}
        </>

    )
}