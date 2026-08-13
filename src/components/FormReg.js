import React, { useState, useEffect } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { useHttp } from '../hooks/http.hook';
import { useMessage } from '../hooks/message.hook';
import { Loader } from './Loader';
import { validation } from '../hooks/validation.hook';
import { Header } from './Header';
import { Footer } from './Footer';
import { doments } from '../constants/const';
// import { useMessage } from '../hooks/message.hook';

export const FormReg = () => {
    const message = useMessage();
    const { validationInputs } = validation();
    const { loading, request } = useHttp();
    const history = useHistory();
    const [form, setForm] = useState({
        email: '',
        password: '',
        passwordConfirm: '',
        type: '1'
    });
    const [isError, setError] = useState(false)

    const changeHandler = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
        validationInputs(e);
    };

    const registrHandler = async (e) => {
        e.preventDefault();

        if (form.password === form.passwordConfirm && doments.some(sub => form.email.includes(sub))) {
            try {
                const data = await request('/signup', 'POST', form);
                if (data.hasOwnProperty('error')) {
                    message(data.message || data.error, false);
                    return;
                }
                message(data.message, true);
            } catch (error) {
                message(error, false);
            }
        } else {
            if (doments.some(sub => form.email.includes(sub))) {
                message('Пароли не совпадают', false);
            } else {
                message(`Разрешена только почта от: ${doments}. Sorry=(`, false);
            }
        }

    };

    const showPass = (e) => {
        document.querySelectorAll('.password').forEach((e, i) => {
            e.type === 'text' ?
                e.type = 'password' :
                e.type = 'text'
        })
    };

    const moveHandler = (event) => {
        history.push('/authorization');
    };

    useEffect(() => {
        // document.getElementById("root").classList.add("o-wrapper");
        document.getElementById("root").classList.replace("app-wrapper", "o-wrapper");
    }, []);

    return (
        <>
            <Header simple={true} />
            <main className="o-form-page">
                <div className="container">
                    <div className="o-form-wrapper">
                        <form className="o-form" onSubmit={registrHandler} autoComplete='off'>
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
                                        className="o-form__input-elem password"
                                        id="password"
                                        type="password"
                                        placeholder="Пароль"
                                        name="password"
                                        required minLength="6"
                                        onChange={changeHandler}
                                        value={form.password}
                                        disabled={loading}
                                    />
                                    <div className="o-form__input-icon" onClick={showPass}>
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
                                        className="o-form__input-elem password"
                                        id="password"
                                        type="password"
                                        placeholder="Повторите пароль"
                                        name="passwordConfirm"
                                        required minLength="6"
                                        onChange={changeHandler}
                                        value={form.passwordConfirm}
                                        disabled={loading}
                                    />
                                    <div className="o-form__input-icon" onClick={showPass}>
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
                                <select onChange={changeHandler} name="type" className="create-word-select">
                                    <option value="1">Я - Студент</option>
                                    <option value="2">Я - Преподаватель</option>
                                    <option value="0">Я - Оба</option>
                                </select>
                            </div>
                            <button className="o-form__action btn btn-dark">
                                Зарегистрироваться
                            </button>
                            <p className="o-form__police ">
                                Регистрируясь вы соглашаетесь с{" "}
                                <Link to="/agreement">условиями использования</Link> и{" "}
                                <Link to="/privacy">политикой конфиденциальности</Link>
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