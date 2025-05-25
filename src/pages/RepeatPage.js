import React, { useEffect, useState, useLayoutEffect } from 'react';
import { useHttp } from '../hooks/http.hook';
import { useMessage } from '../hooks/message.hook';
import { Loader } from '../components/Loader';
import { FlashCard } from '../components/FlashCard';
import { FlashCardWrite } from '../components/FlashCardWrite';
import { Aside } from '../components/Aside';
import { MobileMenu } from '../components/MobileMenu';

import logoWhite from '../../src/images/empty/empty-secondary.png';

export const RepeatPage = () => {
    const { loading, request } = useHttp();
    const [isEasy, setEasy] = useState(true);
    const [easyHard, setEasyHard] = useState('сложнее');
    const [wordsInit, setWordsInit] = useState(null);
    const [categories, setCategories] = useState(null);
    const [category, setCategory] = useState(null);
    const [hand, setHand] = useState(true);
    const message = useMessage();

    async function getWords(category) {
        try {
            const data = await request(`/words/list?category=${category}`, 'GET');
            if (data.data.length < 10) {
                return setWordsInit(null)
            } else {
                setWordsInit(data.data);
            }
        } catch (err) {
            message(err, false);
        }
    };

    async function fetchCategory() {
        try {
            const data = await request(`/category/get`, 'GET');
            setCategories(data.data)
        } catch (err) {
            message(err, false);
        }
    }

    useLayoutEffect(() => {
        window.addEventListener('keydown', (event) => {
            if (event.key === 'Escape') {
                document.querySelector(".dropdown-categories").classList.remove('--th-active');
            }
        });

        // switch (isEasy) {
        //     case true:
        //         document.querySelector(".btn_easy").classList.add('--th-active');
        //         document.querySelector(".btn_hard").classList.remove('--th-active');
        //         break;
        //     default:
        //         document.querySelector(".btn_hard").classList.add('--th-active');
        //         document.querySelector(".btn_easy").classList.remove('--th-active');
        // }

        fetchCategory();
        getWords(null);
    }, [request]);

    const selectHandler = (e) => {
        document.querySelector(".dropdown-categories").classList.toggle('--th-active');
        // const categoryName = e.target.closest(".form__select").selectedOptions[0].getAttribute('value');
        // categoryName)
        // setCategory(e.target.value);
        // setHand(!hand);
    };

    const handleSetCategory = (e) => {
        document.querySelector(".dropdown-categories").classList.remove('--th-active');

        const categoryName = e.target.closest(".dropdown-categories__row").getAttribute('value');
        getWords(categoryName);
        // setHand(!hand);
    }

    const handleClick = (e) => {
        // setEasy(!isEasy);
        // e.target)
        switch (e.target.name) {
            case 'hard':
                document.querySelector(".btn_hard").classList.add('--th-active');
                document.querySelector(".btn_easy").classList.remove('--th-active');
                setEasy(false);
                break;
            default:
                document.querySelector(".btn_easy").classList.add('--th-active');
                document.querySelector(".btn_hard").classList.remove('--th-active');
                setEasy(true);
        }
        // setEasyHard(easyHard === 'проще' ? 'сложнее' : 'проще') 
    }; 

    return (
        // <>
        //     <div className="section-repeat commonClass">
        //         {loading && <Loader />}

        //         {(categories && !loading) && <div>
        //             <label className="form__label" htmlFor="categoryWord">Категория для повторения</label>
        //             <select className="form__select" name="categoryWord" onChange={selectHandler} disabled={loading} defaultValue={category}>
        //                 <option value="null" key={-1}>Все</option>
        // {categories.map((element, index) => {
        //     return (
        //         <option
        //             className="form__selected"
        //             key={index} info={index}
        //             value={element.category}
        //         >
        //             {element.category}
        //         </option>
        //     )
        // })}
        //             </select>
        //         </div>}

        //         {((!words || !categories) && !loading) && <div className="section-repeat__empty-wordArr">Недостаточно слов для повторения (минимум 10)</div>}

        // {((words && categories) && !loading) && <>
        //     <input className="button button__change-test" type="button" value={`Сделать ${easyHard}`} onClick={handleClick} />

        //     {isEasy && <FlashCard wordsArr={words} />}
        //     {!isEasy && <FlashCardWrite wordsArr={words} />}
        // </>}
        //     </div>
        // </>
        <>
            <>
                <div className="app-inner">
                    <Aside />
                    <main className="app-main">
                        <header className="app-main__top">
                            <div className="app-main__left">
                                <h1 className="app-main__title">Повторение</h1>
                            </div>
                            <div className="app-main__right">
                                <div className="app-main__search search" />
                            </div>
                        </header>
                        <main className="app-main__mid">
                            <section className="app-quiz">
                                <div className="app-quiz__inner">
                                    {/* Top */}
                                    {(categories && !loading) && <div className="app-quiz__top">
                                        <div className="quiz-categories">
                                            <div className="quiz-categories__list">
                                                <p className="quiz-categories__label">Категории повторения:</p>
                                                <p className="quiz-categories__current">{categories[0].category}, {categories[1].category}</p>
                                                <p className="quiz-categories__current --th-not-dropdown">...</p>
                                                <p className="quiz-categories__current">ещё {categories.length - 2}</p>
                                                <svg className="quiz-categories__arrow" viewBox="0 0 8 5" fill="none" onClick={selectHandler}>
                                                    <path
                                                        fillRule="evenodd"
                                                        clipRule="evenodd"
                                                        d="M7.21292 1.6355C7.74992 0.9835 7.28542 0 6.44042 0H1.56042C0.71542 0 0.25142 0.9835 0.78842 1.6355L3.22892 4.599C3.32273 4.71294 3.44061 4.80471 3.57408 4.86771C3.70756 4.93071 3.85332 4.96338 4.00092 4.96338C4.14852 4.96338 4.29428 4.93071 4.42776 4.86771C4.56123 4.80471 4.6791 4.71294 4.77292 4.599L7.21292 1.6355Z"
                                                        fill="currentColor"
                                                    />
                                                </svg>
                                            </div>
                                            <div className="dropdown-categories">
                                                <ul className="dropdown-categories__list">
                                                    <li className="dropdown-categories__row" value='null'>
                                                        <div className="dropdown-categories__name">Выбрать все</div>
                                                        <div className="dropdown-categories__checkbox">
                                                            <div className="app-checkbox">
                                                                <input type="checkbox" className="app-checkbox__input" onClick={handleSetCategory} />
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
                                                    {categories.map((element, index) => {
                                                        return (
                                                            <li className="dropdown-categories__row" key={index} info={index} value={element.category}>
                                                                <div className="dropdown-categories__name">{element.category}</div>
                                                                <div className="dropdown-categories__checkbox">
                                                                    <div className="app-checkbox">
                                                                        <input type="checkbox" className="app-checkbox__input" onClick={handleSetCategory} />
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
                                                    <li className="dropdown-categories__row">
                                                        <div className="dropdown-categories__name">Для теста в коде</div>
                                                        <div className="dropdown-categories__checkbox">
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
                                                        </div>
                                                    </li>
                                                </ul>
                                            </div>
                                        </div>

                                        <ul className="quiz-tabs">
                                            <li className="quiz-tabs__item">
                                                <button className="quiz-tabs__btn btn_hard" name="hard" onClick={handleClick}>Сложнее</button>
                                            </li>
                                            <li className="quiz-tabs__item">
                                                <button className="quiz-tabs__btn btn_easy --th-active" name="easy" onClick={handleClick}>Проще</button>
                                            </li>
                                        </ul>
                                    </div>}
                                    {/* Mid */}

                                    {((!wordsInit || !categories) && !loading) &&
                                        <div className="app-quiz__mid quiz-empty">
                                            <img
                                                src={logoWhite}
                                                alt="empty-secondary"
                                                className="quiz-empty__img"
                                            />
                                            <h2 className="quiz-empty__title">В выбранной категории недостаточно слов для повторения</h2>
                                        </div>

                                    }

                                    {((wordsInit && categories) && !loading) && <>
                                        {/* <input className="button button__change-test" type="button" value={`Сделать ${easyHard}`} onClick={handleClick} /> */}

                                        {isEasy && <FlashCard wordsArr={wordsInit} />}
                                        {!isEasy && <FlashCardWrite wordsArr={wordsInit} />}
                                    </>}
                                </div>
                            </section>
                        </main>
                        <footer className="app-main__bot">
                            <p className="app-main__copyright app-main__text">
                                © 2025 Learnew. <br /> Все права защищены.
                            </p>
                            <ul className="app-main__links">
                                <li className="app-main__link-wrapper">
                                    <a href="#" className="app-main__link app-main__text">
                                        Поддержка
                                    </a>
                                </li>
                                <li className="app-main__link-wrapper">
                                    <a href="#" className="app-main__link app-main__text">
                                        Условия использования
                                    </a>
                                </li>
                                <li className="app-main__link-wrapper">
                                    <a href="#" className="app-main__link app-main__text">
                                        Политика конфиденциальности
                                    </a>
                                </li>
                            </ul>
                        </footer>
                    </main>
                </div>
                <MobileMenu />
                {/* <div className="app-mobile-menu">
                    <ul className="app-mobile-menu__actions">
                        <li className="app-mobile-menu__item">
                            <button className="app-mobile-menu__btn">
                                <svg viewBox="0 0 32 32" fill="none">
                                    <path
                                        d="M9.56207 17.208L6.69141 25.756L10.2541 24.5694L12.3447 27.6894L14.7781 20.7787M22.4181 17.208L25.2901 25.756L21.7261 24.5694L19.6354 27.6894L17.2021 20.7787M12.2207 5.73335C12.9941 5.82402 13.7581 5.50669 14.2407 4.89602C14.4505 4.62998 14.7179 4.41496 15.0227 4.26712C15.3276 4.11929 15.6619 4.04248 16.0007 4.04248C16.3395 4.04248 16.6739 4.11929 16.9788 4.26712C17.2836 4.41496 17.551 4.62998 17.7607 4.89602C17.9978 5.19656 18.308 5.43133 18.6616 5.57792C19.0153 5.7245 19.4005 5.77802 19.7807 5.73335C20.117 5.69377 20.4579 5.73089 20.7778 5.84192C21.0976 5.95296 21.3882 6.13503 21.6276 6.37445C21.8671 6.61388 22.0491 6.90444 22.1602 7.22432C22.2712 7.5442 22.3083 7.88507 22.2687 8.22135C22.1781 8.99469 22.4954 9.76002 23.1061 10.2427C23.3719 10.4525 23.5867 10.7198 23.7344 11.0245C23.882 11.3292 23.9588 11.6634 23.9588 12.002C23.9588 12.3406 23.882 12.6748 23.7344 12.9796C23.5867 13.2843 23.3719 13.5516 23.1061 13.7614C22.8057 13.9986 22.5711 14.3088 22.4245 14.6624C22.278 15.016 22.2243 15.4012 22.2687 15.7814C22.3083 16.1176 22.2712 16.4585 22.1602 16.7784C22.0491 17.0983 21.8671 17.3888 21.6276 17.6283C21.3882 17.8677 21.0976 18.0497 20.7778 18.1608C20.4579 18.2718 20.117 18.3089 19.7807 18.2694C19.4003 18.2246 19.0148 18.278 18.661 18.4246C18.3071 18.5712 17.9967 18.806 17.7594 19.1067C17.5496 19.3725 17.2823 19.5873 16.9776 19.735C16.6729 19.8827 16.3387 19.9594 16.0001 19.9594C15.6615 19.9594 15.3272 19.8827 15.0225 19.735C14.7178 19.5873 14.4505 19.3725 14.2407 19.1067C14.0036 18.8062 13.6934 18.5715 13.3398 18.425C12.9862 18.2784 12.6009 18.2248 12.2207 18.2694C11.8844 18.3092 11.5433 18.2722 11.2233 18.1613C10.9032 18.0503 10.6125 17.8683 10.3729 17.6288C10.1333 17.3894 9.95114 17.0987 9.84003 16.7788C9.72892 16.4588 9.69178 16.1178 9.73141 15.7814C9.77609 15.4013 9.72273 15.0161 9.57639 14.6625C9.43005 14.3089 9.19561 13.9987 8.89541 13.7614C8.62937 13.5516 8.41435 13.2842 8.26651 12.9794C8.11867 12.6745 8.04187 12.3401 8.04187 12.0014C8.04187 11.6626 8.11867 11.3282 8.26651 11.0233C8.41435 10.7185 8.62937 10.4511 8.89541 10.2414C9.50607 9.76002 9.82341 8.99469 9.73141 8.22135C9.69178 7.88495 9.72892 7.54394 9.84003 7.22395C9.95114 6.90396 10.1333 6.61332 10.3729 6.37387C10.6125 6.13442 10.9032 5.95238 11.2233 5.84144C11.5433 5.7305 11.8844 5.69355 12.2207 5.73335ZM18.6674 12C18.6674 12.7073 18.3865 13.3855 17.8864 13.8856C17.3863 14.3857 16.708 14.6667 16.0007 14.6667C15.2935 14.6667 14.6152 14.3857 14.1151 13.8856C13.615 13.3855 13.3341 12.7073 13.3341 12C13.3341 11.2928 13.615 10.6145 14.1151 10.1144C14.6152 9.6143 15.2935 9.33335 16.0007 9.33335C16.708 9.33335 17.3863 9.6143 17.8864 10.1144C18.3865 10.6145 18.6674 11.2928 18.6674 12Z"
                                        stroke="currentColor"
                                        strokeWidth={2}
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    />
                                </svg>
                            </button>
                        </li>
                        <li className="app-mobile-menu__item">
                            <button className="app-mobile-menu__btn">
                                <svg viewBox="0 0 32 32" fill="none">
                                    <path
                                        d="M20.0013 5.33333H24.0013C24.3549 5.33333 24.6941 5.47381 24.9441 5.72386C25.1942 5.97391 25.3346 6.31304 25.3346 6.66667V26.6667C25.3346 27.0203 25.1942 27.3594 24.9441 27.6095C24.6941 27.8595 24.3549 28 24.0013 28H8.0013C7.64768 28 7.30854 27.8595 7.05849 27.6095C6.80844 27.3594 6.66797 27.0203 6.66797 26.6667V6.66667C6.66797 6.31304 6.80844 5.97391 7.05849 5.72386C7.30854 5.47381 7.64768 5.33333 8.0013 5.33333H12.0013M12.0013 9.33333H20.0013M12.0013 16H20.0013M12.0013 21.3333H20.0013M13.3346 4V9.33333H18.668V4H13.3346Z"
                                        stroke="currentColor"
                                        strokeWidth={2}
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    />
                                </svg>
                            </button>
                        </li>
                        <li className="app-mobile-menu__item">
                            <button className="app-mobile-menu__btn --th-active">
                                <svg viewBox="0 0 32 32" fill="none">
                                    <path
                                        d="M17.9987 10.6667H5.33203M5.33203 8.00008V25.3334C5.33203 25.687 5.47251 26.0262 5.72256 26.2762C5.9726 26.5263 6.31174 26.6667 6.66536 26.6667H25.332C25.6857 26.6667 26.0248 26.5263 26.2748 26.2762C26.5249 26.0262 26.6654 25.687 26.6654 25.3334V12.0001C26.6654 11.6465 26.5249 11.3073 26.2748 11.0573C26.0248 10.8072 25.6857 10.6667 25.332 10.6667H18.6227C18.4273 10.6667 18.2342 10.6236 18.0573 10.5407C17.8803 10.4577 17.7238 10.3369 17.5987 10.1867L15.0654 7.14675C14.9403 6.99658 14.7837 6.87575 14.6068 6.7928C14.4298 6.70986 14.2368 6.66682 14.0414 6.66675H6.66536C6.31174 6.66675 5.9726 6.80722 5.72256 7.05727C5.47251 7.30732 5.33203 7.64646 5.33203 8.00008Z"
                                        stroke="currentColor"
                                        strokeWidth={2}
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    />
                                </svg>
                            </button>
                        </li>
                        <li className="app-mobile-menu__item">
                            <button className="app-mobile-menu__btn">
                                <svg viewBox="0 0 32 32" fill="none">
                                    <path
                                        d="M6.66797 25.3333V5.33333C6.66797 4.97971 6.80844 4.64057 7.05849 4.39052C7.30854 4.14048 7.64768 4 8.0013 4H24.0013C24.3549 4 24.6941 4.14048 24.9441 4.39052C25.1942 4.64057 25.3346 4.97971 25.3346 5.33333V22.6667H9.33464C8.62739 22.6667 7.94911 22.9476 7.44902 23.4477C6.94892 23.9478 6.66797 24.6261 6.66797 25.3333ZM6.66797 25.3333C6.66797 26.0406 6.94892 26.7189 7.44902 27.219C7.94911 27.719 8.62739 28 9.33464 28H25.3346M12.0013 4V22.6667M21.3346 22.6667V28"
                                        stroke="currentColor"
                                        strokeWidth={2}
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    />
                                </svg>
                            </button>
                        </li>
                        <li className="app-mobile-menu__item">
                            <button className="app-mobile-menu__btn">
                                <svg viewBox="0 0 24 24" fill="none">
                                    <path
                                        d="M5 7H19M5 12H19M5 17H19"
                                        stroke="currentColor"
                                        strokeWidth={2}
                                        strokeLinecap="round"
                                    />
                                </svg>
                            </button>
                        </li>
                    </ul>
                </div> */}
            </>

        </>
    )
};