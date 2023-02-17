//
import React, { useState } from 'react';
import { useHttp } from '../hooks/http.hook';
import { useMessage } from '../hooks/message.hook';
import { validation } from '../hooks/validation.hook';

export const CategoryForm = () => {
    const { loading, request, clearError } = useHttp();
    const { validationInputs } = validation();
    const [category, setCategory] = useState({
        categoryWord: ''
    });
    const message = useMessage();

    const changeHandler = (e) => {
        setCategory({ ...category, [e.target.name]: e.target.value });
        validationInputs(e);
    }

    const handleSubmit = (async (e) => {
        e.preventDefault()
        try {
            const data = await request('/category/add', 'POST', category);
            if(data === undefined) {
                return
            }
            message(data.message);
            setCategory({ ...category, categoryWord: '' });
            clearError();
        } catch (err) {
            message(err);
        }
    });
    // тут потом реализовать возможность подружать категории, для дальнейшего редактирования / удаления
    // useEffect(() => {
    //     message(error);
    //     clearError(); // очищаем ошибку (сделали в http.hook)
    // }, [error, message, clearError]);

    return (
        <section className="add-category-section commonClass">
            <div className="add-category-section__content">
                {/* {loading && <Loader />} */}
                <h3 className="add-category-section__title">Добавить категорию</h3>
                <form className="form" name="add-category-form" onSubmit={handleSubmit}>
                    <fieldset>
                        <div>
                            <label className="form__label" htmlFor="categoryWord">Категория</label>
                            <input
                                id="category"
                                type="text"
                                placeholder="Укажите категорию"
                                name="categoryWord"
                                onChange={changeHandler}
                                className="input"
                                required maxLength="30" minLength="1"
                                value={category.categoryWord}
                                autoComplete="off"
                                disabled={loading}
                            />
                        </div>
                    </fieldset>
                    {/* {!loading &&} */}
                    <div className="form__buttons-container">
                        <button
                            className={"button button-disable"}
                            disabled={true}
                        >Добавить</button>
                    </div>
                </form>
            </div>
        </section>
    )
};