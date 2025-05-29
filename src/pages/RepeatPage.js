import React, { useEffect, useState, useLayoutEffect } from 'react';
import { useHttp } from '../hooks/http.hook';
import { useMessage } from '../hooks/message.hook';
import { Loader } from '../components/Loader';
import { FlashCard } from '../components/FlashCard';
import { FlashCardWrite } from '../components/FlashCardWrite';
import { Aside } from '../components/Aside';
import { MobileMenu } from '../components/MobileMenu';

import logoWhite from '../../src/images/empty/empty-secondary.png';
import { FooterInner } from '../components/Footer';

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
                                                    {/* <li className="dropdown-categories__row">
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
                                                    </li> */}
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
                        <FooterInner />
                    </main>
                </div>
                {/* <MobileMenu /> */}
            </>

        </>
    )
};