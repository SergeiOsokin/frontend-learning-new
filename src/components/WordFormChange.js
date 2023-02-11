//
import React, { useEffect, useState } from 'react';
import { useHttp } from '../hooks/http.hook';
import { useMessage } from '../hooks/message.hook';
import { Loader } from './Loader';
import { validation } from '../hooks/validation.hook';

export const WordFormChange = ({ wordInfo, setActive }) => {
    const { loading, request, clearError } = useHttp();
    const { validationInputs } = validation();
    const [word, setWords] = useState({
        id: '',
        russianWord: '',
        foreignWord: '',
        categoryWord: '',
        categoryWordId: ''
    });
    const [category, setCategory] = useState([]);
    const message = useMessage();

    const changeHandler = (e) => {
        if (e.target.name === 'categoryWord') {
            const idCategory = e.target.closest(".form__select").selectedOptions[0].getAttribute('info');
            setWords({ ...word, [e.target.name]: e.target.value, categoryWordId: idCategory });
        } else {
            setWords({ ...word, [e.target.name]: e.target.value });
        }
        validationInputs(e);
    };

    const handleSubmit = (async (e) => {
        e.preventDefault();
        try {
            const data = await request(`/words/patch/${word.id}`, 'PATCH', word);
            message(data.message);
            clearError();
            setActive(false);
        } catch (err) {
            message('Ошибка:', err);
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
                const data = await request('/category/get', 'GET', {});
                message(data.message);
                setWords({
                    id: wordInfo.id,
                    russianWord: wordInfo.russian_word,
                    foreignWord: wordInfo.foreign_word,
                    categoryWord: wordInfo.category,
                    categoryWordId: wordInfo.category_word_id
                })
                setCategory(data.data)
            } catch (err) {
                message(err);
            }
        }
        fetchData();
    }, [message, request, setActive, wordInfo.category, wordInfo.category_word_id, wordInfo.foreign_word, wordInfo.id, wordInfo.russian_word]);

    return (
        <section className="change-word-section commonClass">
            <div className="change-word-section__content">
                <h3 className="change-word-section__title">Изменить слово</h3>
                <span className="form__close" onClick={() => { setActive(false) }}></span>
                <form className="form" name="add-word-form" onSubmit={handleSubmit}>
                    <fieldset>
                        <div>
                            <label className="form__label" htmlFor="russianWord">Слово на русском</label>
                            <input
                                id="russianWord"
                                type="text"
                                placeholder="Введите слово"
                                name="russianWord"
                                onChange={changeHandler}
                                className="input"
                                required maxLength="30" minLength="1"
                                value={word.russianWord}
                                autoComplete="off"
                                disabled={loading}
                            />
                        </div>
                        <div>
                            <label className="form__label" htmlFor="foreignWord">Перевод</label>
                            <input
                                id="foreignWord"
                                type="text"
                                placeholder="Введите слово"
                                name="foreignWord"
                                onChange={changeHandler}
                                value={word.foreignWord}
                                className="input"
                                autoComplete="off"
                                disabled={loading}
                                required maxLength="30" minLength="1"
                            />
                        </div>
                        <div>
                            <label className="form__label" htmlFor="categoryWord">Выберите категорию</label>
                            <select className="form__select" name="categoryWord" onChange={changeHandler} disabled={loading} value={word.categoryWord}>
                                <option value="" key={-1}>Выберите катагорию</option>
                                {category.map((element, index) => {
                                    return (
                                        <option
                                            className="form__selected"
                                            key={index} info={element.id}
                                            value={element.category}
                                        >
                                            {element.category}
                                        </option>
                                    )
                                })}
                            </select>
                        </div>
                    </fieldset>

                    {loading && <Loader />}

                    {!loading && <div className="form__buttons-container">
                        <button
                            className={"button button-disable"}
                            disabled={true}
                        >Сохранить</button>
                    </div>
                    }
                </form>
            </div>
        </section>
    )
};