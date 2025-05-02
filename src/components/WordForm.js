//
import React, { useEffect, useState } from 'react';
import { useHttp } from '../hooks/http.hook';
import { useMessage } from '../hooks/message.hook';
import { Loader } from './Loader';
import { validation } from '../hooks/validation.hook';

export const WordForm = ({ wordInfo, setActive }) => {
    const { loading, request } = useHttp();
    const { validationInputs } = validation();
    const [word, setWords] = useState({
        russianWord: '',
        foreignWord: '',
        categoryWord: '',
    });
    const [category, setCategory] = useState([]);
    const message = useMessage();
    const {disable, setDisable} = useState(true);
    const [activeCategory, setActiveCategory] = useState('Выберите значение');

    const changeHandler = (e) => {
        // --th-disabled --th-dark
        if (e.target.name === 'categoryWord') {
            const idCategory = e.target.closest(".dropdown-categories__row").getAttribute('info');
            setWords({ ...word, [e.target.name]: idCategory });
            // console.log(document.querySelectorAll('.dropdown-categories__row .dropdown-categories__checkbox .app-checkbox'))
        } else {
            setWords({ ...word, [e.target.name]: e.target.value });
        }
        // validationInputs(e);
    }

    const handleClose = (async (e) => {
        setActive(false)
        // e.preventDefault();
        // try {
        //     const data = await request('/words/add', 'POST', word);
        //     if (data === undefined) {
        //         return
        //     }
        //     message(data.message);
        //     setWords({
        //         russianWord: '',
        //         foreignWord: '',
        //         categoryWord: '',
        //     })
        //     document.querySelector(".form__select").value = ""
        // } catch (err) {
        //     message(err);
        // }
    });

    const handleSubmit = (async (e) => {
        console.log(word)
        // e.preventDefault();
        // try {
        //     const data = await request('/words/add', 'POST', word);
        //     if (data === undefined) {
        //         return
        //     }
        //     message(data.message);
        //     setWords({
        //         russianWord: '',
        //         foreignWord: '',
        //         categoryWord: '',
        //     })
        //     document.querySelector(".form__select").value = ""
        // } catch (err) {
        //     message(err);
        // }
    });

    const handleCheckCat = (e) => {
        
        if(e.target.classList.contains('create-word-select')) {
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
                if (data === undefined) {
                    return
                }
                message(data.message);
                setCategory(data.data)
            } catch (err) {
                message(err);
            }
        }
        fetchData();
    }, [request, message]);

    return (
        // <section className="add-word-section commonClass">
        //     <div className="add-word-section__content">
        //         {loading && <Loader />}
        //         <h3 className="add-word-section__title">Добавить слово</h3>
        //         <form className="form" name="add-word-form" onSubmit={handleSubmit}>
        //             <fieldset>
        //                 <div>
        //                     <label className="form__label" htmlFor="russianWord">Слово на русском</label>
        //                     <input
        // id="russianWord"
        // type="text"
        // placeholder="Введите слово"
        // name="russianWord"
        // onChange={changeHandler}
        // className="input"
        // required maxLength="30" minLength="1"
        // value={word.russianWord}
        // autoComplete="off"
        // disabled={loading}
        //                     />
        //                 </div>
        //                 <div>
        //                     <label className="form__label" htmlFor="foreignWord">Слово на иностранном</label>
        //                     <input
        // id="foreignWord"
        // type="text"
        // placeholder="Введите слово"
        // name="foreignWord"
        // onChange={changeHandler}
        // value={word.foreignWord}
        // className="input"
        // autoComplete="off"
        // disabled={loading}
        // required maxLength="30" minLength="1"
        //                     />
        //                 </div>
        //                 <div>
        //                     <label className="form__label" htmlFor="categoryWord">Выберите категорию</label>
        //                     <select className="form__select" name="categoryWord" onChange={changeHandler} disabled={loading} required >
        //                         <option value="" defaultValue>Выберите категорию</option>
        //                         {category.map((element, index) => {
        //                             return (
        //                                 <option key={index.toString()} className="form__selected" info={element.id}>{element.category}</option>
        //                             )
        //                         })}
        //                     </select>
        //                 </div>
        //             </fieldset>

        //             {/* {!loading &&} */}
        //             <div className="form__buttons-container">
        //                 <button
        //                     className={"button button-disable"}
        //                     disabled={true}
        //                 >Сохранить</button>
        //             </div>
        //         </form>
        //     </div>
        // </section>
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
                <h3 className="edit-modal__title">Добавить в словарь</h3>
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
                                                id="russianWord"
                                                name="russianWord"
                                                onChange={changeHandler}
                                                required maxLength="30" minLength="1"
                                                value={word.russianWord}
                                                autoComplete="off"
                                                disabled={loading}
                                            />
                                            <button className="word-delete btn btn-grey">
                                                <svg className="icon" viewBox="0 0 24 24" fill="none">
                                                    <path
                                                        d="M5 7H19M10 10V18M14 10V18M10 3H14C14.2652 3 14.5196 3.10536 14.7071 3.29289C14.8946 3.48043 15 3.73478 15 4V7H9V4C9 3.73478 9.10536 3.48043 9.29289 3.29289C9.48043 3.10536 9.73478 3 10 3ZM6 7H18V20C18 20.2652 17.8946 20.5196 17.7071 20.7071C17.5196 20.8946 17.2652 21 17 21H7C6.73478 21 6.48043 20.8946 6.29289 20.7071C6.10536 20.5196 6 20.2652 6 20V7Z"
                                                        stroke="currentColor"
                                                        strokeWidth={2}
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                    />
                                                </svg>
                                            </button>
                                        </div>
                                        <div className="create-word__col">
                                            <input
                                                placeholder="Перевод"
                                                type="text"
                                                className="create-word__input"
                                                id="foreignWord"
                                                name="foreignWord"
                                                onChange={changeHandler}
                                                value={word.foreignWord}
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
                                                        {/* <li className="dropdown-categories__row">
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
                                                            </li> */}
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
                                                        <li className="dropdown-categories__row --th-button">
                                                            <button className="dropdown-categories-add btn btn-grey">
                                                                Новая категория
                                                            </button>
                                                        </li>
                                                        <li className="dropdown-categories__row --th-input">
                                                            <div className="dropdown-categories-input">
                                                                <input
                                                                    type="text"
                                                                    className="dropdown-categories-input__elem"
                                                                />
                                                                <div className="dropdown-categories-input__actions">
                                                                    <button className="dropdown-categories-input__btn --th-delete">
                                                                        <svg
                                                                            className="icon"
                                                                            viewBox="0 0 24 24"
                                                                            fill="none"
                                                                        >
                                                                            <path
                                                                                d="M5 7H19M10 10V18M14 10V18M10 3H14C14.2652 3 14.5196 3.10536 14.7071 3.29289C14.8946 3.48043 15 3.73478 15 4V7H9V4C9 3.73478 9.10536 3.48043 9.29289 3.29289C9.48043 3.10536 9.73478 3 10 3ZM6 7H18V20C18 20.2652 17.8946 20.5196 17.7071 20.7071C17.5196 20.8946 17.2652 21 17 21H7C6.73478 21 6.48043 20.8946 6.29289 20.7071C6.10536 20.5196 6 20.2652 6 20V7Z"
                                                                                stroke="currentColor"
                                                                                strokeWidth={2}
                                                                                strokeLinecap="round"
                                                                                strokeLinejoin="round"
                                                                            />
                                                                        </svg>
                                                                    </button>
                                                                    <button className="dropdown-categories-input__btn --th-save">
                                                                        <svg
                                                                            className="icon"
                                                                            viewBox="0 0 24 24"
                                                                            fill="none"
                                                                        >
                                                                            <path
                                                                                d="M5 11.917L9.724 16.5L19 7.5"
                                                                                stroke="currentColor"
                                                                                strokeWidth={2}
                                                                                strokeLinecap="round"
                                                                                strokeLinejoin="round"
                                                                            />
                                                                        </svg>
                                                                    </button>
                                                                </div>
                                                            </div>
                                                        </li>
                                                    </ul>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="create-word__col --th-delete">
                                            <button className="word-delete btn btn-grey">
                                                <svg className="icon" viewBox="0 0 24 24" fill="none">
                                                    <path
                                                        d="M5 7H19M10 10V18M14 10V18M10 3H14C14.2652 3 14.5196 3.10536 14.7071 3.29289C14.8946 3.48043 15 3.73478 15 4V7H9V4C9 3.73478 9.10536 3.48043 9.29289 3.29289C9.48043 3.10536 9.73478 3 10 3ZM6 7H18V20C18 20.2652 17.8946 20.5196 17.7071 20.7071C17.5196 20.8946 17.2652 21 17 21H7C6.73478 21 6.48043 20.8946 6.29289 20.7071C6.10536 20.5196 6 20.2652 6 20V7Z"
                                                        stroke="currentColor"
                                                        strokeWidth={2}
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                    />
                                                </svg>
                                            </button>
                                        </div>
                                    </li>
                                </ul>
                                <button className="create-word__add btn btn-grey">
                                    <svg className="icon" viewBox="0 0 25 24" fill="none">
                                        <path
                                            d="M5.5 12H19.5M12.5 19V5"
                                            stroke="currentColor"
                                            strokeWidth={2}
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                        />
                                    </svg>
                                    <span>Ещё одно слово </span>
                                </button>
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