import React, { useState, useEffect } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { useHttp } from '../hooks/http.hook';
import { useMessage } from '../hooks/message.hook';
import { Loader } from './Loader';
import { validation } from '../hooks/validation.hook';
import { Header } from './Header';
import { Footer } from './Footer';
// import { useMessage } from '../hooks/message.hook';

export const FormReg = () => {
    const message = useMessage();
    const { validationInputs } = validation();
    const { loading, request } = useHttp();
    const history = useHistory();
    const [form, setForm] = useState({
        email: '',
        password: '',
        passwordConfirm: ''
    });
    const [isError, setError] = useState(false)

    const changeHandler = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
        validationInputs(e);
    };

    const registrHandler = async (e) => {
        e.preventDefault();
        if (form.password === form.passwordConfirm) {
            try {
                const data = await request('/signup', 'POST', form);
                if (data === undefined) {
                    return
                }
                message(data.message, true);
            } catch (error) {
                message(error, false);
            }
        } else {
            message('Пароли не совпадают', false);
        }

    };

    const moveHandler = (event) => {
        history.push('/authorization');
    }

    return (
        <>
            <Header simple={true} />
            <main className="o-form-page">
                <div className="container">
                    <div className="o-form-wrapper">
                        <form className="o-form" onSubmit={registrHandler}>
                            <h1 className="o-form__title">Регистрация</h1>
                            <div className="o-form__inner">
                                <div className="o-form__input">
                                    <input
                                        className="o-form__input-elem"
                                        type="email"
                                        placeholder="Email"
                                        name="email"
                                        onChange={changeHandler}
                                        required maxLength="30" minLength="2"
                                        pattern="[a-zA-Z0-1\W\D]{1,}@[[a-zA-Z0-1\W\D]{1,}\.[a-zA-Z]{2,3}"
                                        value={form.email}
                                        autoComplete="off"
                                        disabled={loading}
                                    />
                                </div>
                                <div className="o-form__input">
                                    <input
                                        className="o-form__input-elem"
                                        id="password"
                                        type="password"
                                        placeholder="Пароль"
                                        name="password"
                                        required minLength="6"
                                        onChange={changeHandler}
                                        value={form.password}
                                        disabled={loading}
                                    />
                                    <div className="o-form__input-icon">
                                        <svg className="icon" viewBox="0 0 24 24" fill="none">
                                            <path
                                                d="M3.933 13.909C3.46923 13.3594 3.1487 12.7036 3 12C3 11 7 6 12 6M19.6 9.8C20.2506 10.3987 20.7332 11.1571 21 12C21 13 18 18 12 18C11.686 18 11.38 17.986 11.082 17.96M5 19L19 5M15 12C15 12.7956 14.6839 13.5587 14.1213 14.1213C13.5587 14.6839 12.7956 15 12 15C11.2044 15 10.4413 14.6839 9.87868 14.1213C9.31607 13.5587 9 12.7956 9 12C9 11.2044 9.31607 10.4413 9.87868 9.87868C10.4413 9.31607 11.2044 9 12 9C12.7956 9 13.5587 9.31607 14.1213 9.87868C14.6839 10.4413 15 11.2044 15 12Z"
                                                stroke="currentColor"
                                                strokeWidth={2}
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                            />
                                        </svg>
                                    </div>
                                </div>
                                <div className="o-form__input">
                                    <input
                                        className="o-form__input-elem"
                                        id="password"
                                        type="password"
                                        placeholder="Повторите пароль"
                                        name="passwordConfirm"
                                        required minLength="6"
                                        onChange={changeHandler}
                                        value={form.passwordConfirm}
                                        disabled={loading}
                                    />
                                    <div className="o-form__input-icon">
                                        <svg className="icon" viewBox="0 0 24 24" fill="none">
                                            <path
                                                d="M3.933 13.909C3.46923 13.3594 3.1487 12.7036 3 12C3 11 7 6 12 6M19.6 9.8C20.2506 10.3987 20.7332 11.1571 21 12C21 13 18 18 12 18C11.686 18 11.38 17.986 11.082 17.96M5 19L19 5M15 12C15 12.7956 14.6839 13.5587 14.1213 14.1213C13.5587 14.6839 12.7956 15 12 15C11.2044 15 10.4413 14.6839 9.87868 14.1213C9.31607 13.5587 9 12.7956 9 12C9 11.2044 9.31607 10.4413 9.87868 9.87868C10.4413 9.31607 11.2044 9 12 9C12.7956 9 13.5587 9.31607 14.1213 9.87868C14.6839 10.4413 15 11.2044 15 12Z"
                                                stroke="currentColor"
                                                strokeWidth={2}
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                            />
                                        </svg>
                                    </div>
                                </div>
                            </div>
                            <button className="o-form__action btn btn-dark">
                                Зарегистрироваться
                            </button>
                            <p className="o-form__police ">
                                Регистрируясь вы соглашаетесь с{" "}
                                <Link to="/">условиями использования</Link> и{" "}
                                <Link to="/">политикой конфиденциальности</Link>
                            </p>
                        </form>
                        <p className="o-form-wrapper__text">
                            Есть аккаунт? <Link to="/authorization">Вход</Link>
                        </p>
                    </div>
                </div>
            </main>
            <Footer />

        </>

    )
};