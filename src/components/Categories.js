import React, { useEffect, useCallback, useState } from 'react';
import { useHttp } from '../hooks/http.hook';
import { WordFormChange } from './WordFormChange';
import { useMessage } from '../hooks/message.hook';
import { Loader } from './Loader';
import trashIcon from '../../src/img/trash_icon.png';
import { validation } from '../hooks/validation.hook';

export const Categories = ({ setActive }) => {
    const { loading, request } = useHttp();
    const [category, setCategory] = useState({
        categoryWord: ''
    });
    const { validationInputs } = validation();
    const [categories, setCategories] = useState([]);
    const message = useMessage();
    const [wordInfo, setWordInfo] = useState({});
    const [active, setModalActive] = useState(false);
    const [categoryInfo, setCategoryInfo] = useState({});

    const handleConfirmDeleteCategory = useCallback(async (e, categoryInfo) => {

        try {
            const data = await request(`/category/delete/${categoryInfo.id}`, 'DELETE', {});
            if (data.hasOwnProperty('error')) {
                message(data.message || data.error, false);
                return;
            }
            message(data.message, true);
            document.querySelector(".edit-wrapper").classList.remove('--th-delete-category');
            document.querySelector(".categories-edit-actions").classList.remove('--th-disabled');
            document.querySelector(".categories-edit").parentElement.removeChild(document.getElementById(categoryInfo.id));
            document.querySelector(".confirm-category-delete-actions").classList.remove('--th-active');
        } catch (error) {
            message(error, false);
        }
    }, [message, request]);

    const changeWord = (e) => {
        const [id, foreign_word, russian_word, category, category_word_id] = e.target.closest(".category-string").getAttribute('info').split('+');
        setWordInfo({ id, foreign_word, russian_word, category, category_word_id });
        setModalActive(true);
    };

    const handleClose = (async (e) => {
        setActive(false);

        // e.preventDefault();
        // try {
        //     const data = await request('/words/add', 'POST', word);
        //     if (data === undefined) {
        //         return
        //     }
        //     message(data.message, true);
        //     setWords({
        //         russianWord: '',
        //         foreignWord: '',
        //         categoryWord: '',
        //     })
        //     document.querySelector(".form__select").value = ""
        // } catch (err) {
        //     message(err, false);
        // }
    });

    const handleCancel = (async (e) => {
        switch (e.target.name) {
            case 'categories-edit-remove':
                document.querySelector(".categories-edit-new").classList.remove('--th-disabled');
                document.querySelector(".categories-create").classList.add('--th-disabled');
                document.querySelector(".categories-edit-input__elem").value = ''
                break;
            default:
                document.querySelector(".categories-edit-actions").classList.remove('--th-disabled');
                document.querySelector(".confirm-category-delete-actions").classList.remove('--th-active');
                document.querySelector(".edit-wrapper").classList.remove('--th-delete-category');
        }

    });

    const handleDelCat = (e, element) => {
        setCategoryInfo(element)
        // element)
        e.target.closest(".edit-wrapper").classList.add('--th-delete-category');

        // кнопки базовые для редактировани категории
        document.querySelector(".categories-edit-actions").classList.add('--th-disabled');
        // кнопки подтверждения удаления
        document.querySelector(".confirm-category-delete-actions").classList.add('--th-active');
    }

    const handleNewCategory = (e) => {
        e.target.closest(".categories-edit-new").classList.add('--th-disabled');
        document.querySelector(".categories-create").classList.remove('--th-disabled');
    }

    const handleSaveNewCategory = (async (e) => {
        // validationInputs(e);
        let category = document.querySelector('.categories-edit-input__elem').value

        e.preventDefault()
        try {
            const data = await request('/category/add', 'POST', { categoryWord: category });
            if (data.hasOwnProperty('error')) {
                message(data.message || data.error, false);
                return;
            }
            message(data.message, true);
            document.querySelector(".categories-edit-input__elem").value = '';
            setCategory({ ...category, categoryWord: '' });
        } catch (err) {
            message(err, false);
        }
    });


    useEffect(() => {
        window.addEventListener('keydown', (event) => {
            if (event.key === 'Escape') {
                setActive(false);
            }
        });

        async function fetchData() {
            try {
                const data = await request(`/category/get`, 'GET');
                if (data.hasOwnProperty('error')) {
                    message(data.message || data.error, false);
                    return;
                } else {
                    setCategories(data.data);
                }
            } catch (err) {
                message(err, false);
            }
        }
        fetchData();
    }, [request, active, category]);

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
                <h3 className="edit-modal__title">Редактировать категории</h3>
                <div className="edit-wrapper">
                    <ul className="categories-edit-list">
                        <li className="categories-edit-new">
                            <button className="categories-edit-new__btn btn btn-grey" onClick={handleNewCategory}>
                                <svg className="icon" viewBox="0 0 24 24" fill="none">
                                    <path
                                        d="M5 12H19M12 19V5"
                                        stroke="currentColor"
                                        strokeWidth={2}
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    />
                                </svg>
                                <span>Новая категория</span>
                            </button>
                        </li>
                        <li className="categories-create --th-disabled">
                            <div className="categories-create__checkbox app-checkbox --th-disabled --th-dark">
                                <div className="app-checkbox__elem" />
                            </div>
                            <div className="categories-edit-input">
                                <input
                                    defaultValue={''}
                                    type="text"
                                    className="categories-edit-input__elem"
                                    placeholder='Название категории'
                                />
                            </div>
                            <button className="categories-edit-save btn btn-green-outline" onClick={handleSaveNewCategory}>
                                <svg className="icon" viewBox="0 0 24 24" fill="none">
                                    <path
                                        d="M5 11.917L9.724 16.5L19 7.5"
                                        stroke="currentColor"
                                        strokeWidth={2}
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    />
                                </svg>
                            </button>
                            <button className="categories-edit-remove btn btn-grey-red-outline" name='categories-edit-remove' onClick={handleCancel}>
                                <svg className="icon" viewBox="0 0 24 24" fill="none" name='categories-edit-remove'>
                                    <path
                                        d="M5 7H19M10 10V18M14 10V18M10 3H14C14.2652 3 14.5196 3.10536 14.7071 3.29289C14.8946 3.48043 15 3.73478 15 4V7H9V4C9 3.73478 9.10536 3.48043 9.29289 3.29289C9.48043 3.10536 9.73478 3 10 3ZM6 7H18V20C18 20.2652 17.8946 20.5196 17.7071 20.7071C17.5196 20.8946 17.2652 21 17 21H7C6.73478 21 6.48043 20.8946 6.29289 20.7071C6.10536 20.5196 6 20.2652 6 20V7Z"
                                        stroke="currentColor"
                                        strokeWidth={2}
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        name='categories-edit-remove'
                                    />
                                </svg>
                            </button>
                        </li>

                        {categories
                            .sort((a, b) => a.id - b.id)
                            .map((element, index) => {
                                return (
                                    <li className="categories-edit " id={`${element.id}`} key={element.id}>
                                        <div className="categories-edit__checkbox app-checkbox --th-dark">
                                            {/* <input type="checkbox" className="app-checkbox__input" />
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
                                            </div> */}
                                        </div>
                                        <div className="categories-edit-input">
                                            <input
                                                defaultValue={element.category}
                                                type="text"
                                                className="categories-edit-input__elem"
                                                disabled={true}
                                            />
                                            {/* <div className="categories-edit-input__label">10 слов</div> */}
                                        </div>
                                        <button className="categories-edit-remove btn btn-grey-red-outline" onClick={(e) => { handleDelCat(e, element) }}>
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
                                    </li>
                                )
                            })}
                    </ul>

                    <div className="confirm-category-delete">
                        <h4 className="confirm-category-delete__title">
                            Вы уверены, что хотите удалить эту категорию?
                        </h4>
                        <p className="confirm-category-delete__lower">
                            Это действие будет нельзя отменить
                        </p>
                        <p className="confirm-category-delete__board" info={categoryInfo.id}>{categoryInfo.category}</p>
                    </div>

                </div>
                <div className="categories-edit-actions">
                    <div className="categories-edit-actions__left">
                        <button className="categories-edit-actions__cancel btn btn-dark-outline" onClick={handleClose}>
                            Отменить
                        </button>
                    </div>
                    <div className="categories-edit-actions__right">
                        {/* <button className="categories-edit-actions__combine btn btn-dark-outline">
                            Объединить категории
                        </button> */}
                        <button className="categories-edit-actions__save btn btn-dark" onClick={handleClose}>
                            Сохранить и закрыть
                        </button>
                    </div>
                </div>

                {/* Тупой, но быстрый вариант заменить кнопки */}
                <div className="confirm-category-delete-actions">
                    <div className="categories-edit-actions__left">
                        <button className="categories-edit-actions__delete btn btn-red-outline" onClick={(e) => { handleConfirmDeleteCategory(e, categoryInfo) }}>
                            <svg className="icon" viewBox="0 0 24 24" fill="none">
                                <path d="M5 7H19M10 10V18M14 10V18M10 3H14C14.2652 3 14.5196 3.10536 14.7071 3.29289C14.8946 3.48043 15 3.73478 15 4V7H9V4C9 3.73478 9.10536 3.48043 9.29289 3.29289C9.48043 3.10536 9.73478 3 10 3ZM6 7H18V20C18 20.2652 17.8946 20.5196 17.7071 20.7071C17.5196 20.8946 17.2652 21 17 21H7C6.73478 21 6.48043 20.8946 6.29289 20.7071C6.10536 20.5196 6 20.2652 6 20V7Z"
                                    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                            <span>Да, удалить</span>
                        </button>
                    </div>
                    <div className="categories-edit-actions__right">
                        <button className="categories-edit-actions__save btn btn-dark" onClick={handleCancel}>Нет, вернуться назад</button>
                    </div>
                </div>
            </div>
        </div>
    )
}