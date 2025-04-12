import React, { useEffect, useCallback, useState } from 'react';
import { useHttp } from '../hooks/http.hook';
import { WordFormChange } from './WordFormChange';
import { useMessage } from '../hooks/message.hook';
import { Loader } from './Loader';
import trashIcon from '../../src/img/trash_icon.png';

export const Categories = ({ setActive }) => {
    const { loading, request } = useHttp();
    const [categories, setCategories] = useState([]);
    const message = useMessage();
    const [wordInfo, setWordInfo] = useState({});
    const [active, setModalActive] = useState(false);

    const deleteCategory = useCallback(async (e) => {
        const decision = window.confirm('Удалить категорию?');
        const [id] = e.target.closest(".category-string").getAttribute('info').split('+');
        if (decision) {
            try {
                const data = await request(`/category/delete/${id}`, 'DELETE', {});
                message(data.message);
                e.target.closest(".category-string").parentElement.removeChild(e.target.closest(".category-string"));
            } catch (e) {
                message(e);
            }
        }
    }, [message, request]);

    const changeWord = (e) => {
        const [id, foreign_word, russian_word, category, category_word_id] = e.target.closest(".category-string").getAttribute('info').split('+');
        setWordInfo({ id, foreign_word, russian_word, category, category_word_id });
        setModalActive(true);
    };

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

    const handleDelCat = (e) => {
        e.target.closest(".edit-wrapper").classList.add('--th-delete-category');
    }


    useEffect(() => {
        window.addEventListener('keydown', (event) => {
            if (event.key === 'Escape') {
                setActive(false);
            }
        });

        async function fetchData() {
            try {
                const data = await request(`/category/get`, 'GET');
                if (data === undefined) {
                    return
                }
                if (data.data.length === 0) {
                    return message(data.message)
                } else {
                    setCategories(data.data);
                }
            } catch (err) {
                message(err);
            }
        }
        fetchData();
    }, [request, message, active]);

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
                            <button className="categories-edit-new__btn btn btn-grey">
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
                        {categories
                            .sort((a, b) => a.id - b.id)
                            .map((element, index) => {
                                return (
                                    <li className="categories-edit " info={`${element.id}+${element.category}`} key={element.id}>
                                        <div className="categories-edit__checkbox app-checkbox --th-dark">
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
                                        <div className="categories-edit-input">
                                            <input
                                                defaultValue={element.category}
                                                type="text"
                                                className="categories-edit-input__elem"
                                            />
                                            <div className="categories-edit-input__label">10 слов</div>
                                        </div>
                                        <button className="categories-edit-remove btn btn-grey-red-outline" onClick={handleDelCat}>
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
                        <p className="confirm-category-delete__board">Для работы</p>
                    </div>
                </div>
                <div className="categories-edit-actions">
                    <div className="categories-edit-actions__left">
                        <button className="categories-edit-actions__cancel btn btn-dark-outline" onClick={handleClose}>
                            Отменить
                        </button>
                    </div>
                    <div className="categories-edit-actions__right">
                        <button className="categories-edit-actions__combine btn btn-dark-outline">
                            Объединить категории
                        </button>
                        <button className="categories-edit-actions__save btn btn-dark">
                            Сохранить и закрыть
                        </button>
                    </div>
                </div>
            </div>
        </div>

        // <section className="category-section commonClass">
        //     {active &&
        //         <WordFormChange wordInfo={wordInfo} setActive={setModalActive} />
        //     }
        //     {loading && <Loader />}
        //     <>
        //         <table className="category-section__table" >
        //             <caption>
        //                 Ваши категории
        //             </caption>
        //             {/* <thead>
        //                 <tr>
        //                     <th>№ п/п</th>
        //                     <th>Категория</th>
        //                     <th></th>
        //                     <th></th>
        //                 </tr>
        //             </thead> */}

        //             <tbody>
        // {categories
        //     .sort((a, b) => a.id - b.id)
        //     .map((element, index) => {
        //         return (
        //             <tr className="category-string"
        //                 info={`${element.id}+${element.category}`}
        //                 key={element.id}
        //             >
        //                 {/* <td>{index + 1}</td> */}
        //                 <td>{element.category}</td>
        //                 {/* <td>
        //                     <button
        //                         className="button button_table"
        //                         onClick={changeWord}
        //                     >
        //                         <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-pencil-square" viewBox="0 0 16 16">
        //                             <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z" />
        //                             <path fillRule="evenodd" d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5v11z" />
        //                         </svg>
        //                     </button>
        //                 </td> */}
        //                 <td>
        //                     <button
        //                         className="button button_table-delete"
        //                         onClick={deleteCategory}
        //                     ><img className="trash-icon" src={trashIcon} alt="Удалить"></img></button>
        //                 </td>
        //             </tr>
        //         )
        //     })}
        //             </tbody>
        //         </table>

        //     </>
        // </section>
    )
}