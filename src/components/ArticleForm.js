import React, { useState, useEffect } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { useHttp } from '../hooks/http.hook';
import { useMessage } from '../hooks/message.hook';
import { Loader } from './Loader';
import { validation } from '../hooks/validation.hook';
import { Aside } from './Aside';
import { autoResize } from '../hooks/autoResize.hook';
import { FooterInner } from './Footer';

export const ArticleForm = () => {
    const { loading, request, clearError } = useHttp();
    const history = useHistory()
    const { validationInputs } = validation();
    const [article, setArticle] = useState({
        theme: '',
        category: '',
        textArt: '',
    });
    const message = useMessage();

    const changeHandler = (e) => {
        setArticle({ ...article, [e.target.name]: e.target.value.normalize() });
        if (e.target.type === 'textarea') { autoResize(e.target.name) }
        // validationInputs(e);
    }

    const handleCancel = () => {
        history.push('/articles');
    }

    const handleSubmit = (async (e) => {
        e.preventDefault();
        try {
            const data = await request('/article/create', 'POST', article);
            if (data.hasOwnProperty('error')) {
                message(data.message || data.error, false);
                return;
            }
            message(data.message, true);
            clearError();
            setArticle({
                theme: '',
                category: '',
                textArt: '',
            })
        } catch (err) {
            message(err, false);
        }
    });

    useEffect(() => {
        // window.addEventListener('input', autoResize())
        // message(error);
        // clearError(); // очищаем ошибку (сделали в http.hook)
    }, []);

    return (

        <div className="app-inner">
            <Aside />
            <main className="app-main">
                <header className="app-main__top">
                    <div className="app-main__left">
                        <Link className="app-main__back" to="/articles">
                            <svg viewBox="0 0 6 10" fill="none">
                                <path
                                    d="M5 9L1 5L5 1"
                                    stroke="#939393"
                                    strokeWidth={2}
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                />
                            </svg>
                            <span>Все статьи</span>
                        </Link>
                        <h1 className="app-main__title">Новая статья</h1>
                    </div>
                    <div className="app-main__right">
                        <div className="app-main__search search" />
                    </div>
                </header>
                <main className="app-main__mid">
                    <div className="app-create-notice">
                        <div className="app-create-notice__top">
                            <div className="app-create-notice__title create-notice-title">
                                <input
                                    placeholder="Название"
                                    className="create-notice-title__elem"
                                    id="theme"
                                    type="text"
                                    name="theme"
                                    onChange={changeHandler}
                                    required maxLength="50"
                                    value={article.theme}
                                    autoComplete="off"
                                    disabled={loading}
                                />
                            </div>
                            <div className="app-create-notice__title create-notice-title">
                                <input
                                    placeholder="Категория"
                                    className="create-notice-title__elem"
                                    id="category"
                                    type="text"
                                    name="category"
                                    onChange={changeHandler}
                                    required maxLength="50"
                                    value={article.category}
                                    autoComplete="off"
                                    disabled={loading}
                                />
                            </div>
                            {/* <div className="app-create-notice__title create-notice-title">
                                <input
                                    placeholder="Ссылка на картинку (не обязательно)"
                                    className="create-notice-title__elem"
                                    id="image"
                                    type="text"
                                    name="image"
                                    onChange={changeHandler}
                                    maxLength="50"
                                    value={article.image}
                                    autoComplete="off"
                                    disabled={loading}
                                />
                            </div> */}
                            <div className="app-create-notice__added">

                                <div className="notice-example-add">
                                    <svg
                                        className="notice-example-add__menu"
                                        viewBox="0 0 16 12"
                                        fill="none"
                                    >
                                        <path
                                            d="M1 1H15M1 6H15M1 11H15"
                                            stroke="#939393"
                                            strokeWidth={2}
                                            strokeLinecap="round"
                                        />
                                    </svg>
                                    <textarea
                                        className="app-area-text textArt"
                                        placeholder="Текст статьи. Только на латинице!"
                                        id="textArt"
                                        type="text"
                                        name="textArt"
                                        onChange={changeHandler}
                                        value={article.textArt}
                                        autoComplete="off"
                                        disabled={loading}
                                        required maxLength="2000"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="app-create-notice__bot">
                            <button className="app-create-notice__remove btn btn-red" onClick={handleCancel}>
                                <svg className="icon" viewBox="0 0 24 24">
                                    <path
                                        d="M5 7H19M10 10V18M14 10V18M10 3H14C14.2652 3 14.5196 3.10536 14.7071 3.29289C14.8946 3.48043 15 3.73478 15 4V7H9V4C9 3.73478 9.10536 3.48043 9.29289 3.29289C9.48043 3.10536 9.73478 3 10 3ZM6 7H18V20C18 20.2652 17.8946 20.5196 17.7071 20.7071C17.5196 20.8946 17.2652 21 17 21H7C6.73478 21 6.48043 20.8946 6.29289 20.7071C6.10536 20.5196 6 20.2652 6 20V7Z"
                                        stroke="currentColor"
                                        fill="none"
                                        strokeWidth={2}
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    />
                                </svg>
                                <span>Отменить</span>
                            </button>
                            <button className="app-create-notice__save btn btn-dark" onClick={handleSubmit}>
                                Сохранить
                            </button>
                            {/* <button className="app-create-notice__save btn btn-dark" onClick={handleSubmit}>
                                Сохранить и опубликовать
                            </button> */}
                        </div>
                    </div>
                </main>

                <FooterInner />
            </main>
        </div>
    )
};