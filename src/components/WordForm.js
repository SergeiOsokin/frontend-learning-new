//
import React, { useEffect, useState } from 'react';
import { useHttp } from '../hooks/http.hook';
import { useMessage } from '../hooks/message.hook';
import { Loader } from './Loader';
import { validation } from '../hooks/validation.hook';

export const WordForm = () => {
    const { loading, request, clearError } = useHttp();
    const { validationInputs } = validation();
    const [word, setWords] = useState({
        russianWord: '',
        foreignWord: '',
        categoryWord: '',
    });
    const [category, setCategory] = useState([]);
    const message = useMessage();

    const changeHandler = (e) => {
        if (e.target.name === 'categoryWord') {
            const idCategory = e.target.closest(".form__select").selectedOptions[0].getAttribute('info');
            setWords({ ...word, [e.target.name]: idCategory });
        } else {
            setWords({ ...word, [e.target.name]: e.target.value });
        }
        validationInputs(e);
    }

    const handleSubmit = (async (e) => {
        e.preventDefault();
        try {
            const data = await request('/words/add', 'POST', word);
            if (data.statusCode === 200) {
                message(data.message);
                setWords({
                    russianWord: '',
                    foreignWord: '',
                    categoryWord: '',
                })
            } else {
                throw data.message
            }
        } catch (err) {
            message(err);
        }
    });

    useEffect(() => {
        async function fetchData() {
            try {
                const data = await request('/category/get', 'GET', {});
                message(data.message);
                setCategory(data.data)
            } catch (err) {
                message(err);
            }
        }
        fetchData();
    }, [request, message]);

    return (
        <section className="add-word-section">
            <div className="add-word-section__content">
                {loading && <Loader />}
                <h3 className="add-word-section__title">Добавить слово</h3>
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
                            <label className="form__label" htmlFor="foreignWord">Слово на иностранном</label>
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
                            <select className="form__select" name="categoryWord" onChange={changeHandler} disabled={loading} required >
                                <option value="" >Выберите категорию</option>
                                {category.map((element, index) => {
                                    return (
                                        <option key={index.toString()} className="form__selected" info={element.id}>{element.category}</option>
                                    )
                                })}
                            </select>
                        </div>
                    </fieldset>

                    {/* {!loading &&} */}
                    <div className="form__buttons-container">
                        <button
                            className={"button button-disable"}
                            disabled={true}
                        >Сохранить</button>
                    </div>
                </form>
            </div>
        </section>
    )
};