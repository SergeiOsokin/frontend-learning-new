import React, { useContext, useState, useEffect } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { useHttp } from '../hooks/http.hook';
import { useMessage } from '../hooks/message.hook';
import { AuthContext } from '../context/AuthContext';
import { Loader } from './Loader';
import { validation } from '../hooks/validation.hook';
import { Header } from './Header';
import { Footer } from './Footer';
import { ResetForm } from './ResetForm';

export const FormAuth = () => {
    const auth = useContext(AuthContext); // получаем контекст в объекте auth
    const message = useMessage();
    const { validationInputs } = validation();
    const { loading, request } = useHttp();
    const history = useHistory();
    const [form, setForm] = useState({
        email: '',
        password: ''
    });
    const [passwordReset, setPasswordReset] = useState(false)

    const changeHandler = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
        validationInputs(e);
    };

    const loginHandler = async (e) => {
        e.preventDefault();
        try {
            const data = await request('/signin', 'POST', form);
            if (data.hasOwnProperty('error')) {
                message(data.message || data.error, false);
                return;
            }
            history.push('/wordslist');
            auth.login(data); // передаем полученные данные в auth.hook
        } catch (error) {
            message(error, false);
        }
    };
    const moveHandler = (event) => {
        history.push('/registration');
    }

    const showPass = (e) => {
        document.getElementById('password').type === 'text' ?
            document.getElementById('password').type = 'password' :
            document.getElementById('password').type = 'text'
    }

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
                        <form className="o-form" onSubmit={loginHandler}>
                            <h1 className="o-form__title">Вход</h1>
                            <div className="o-form__inner">
                                <   div className="o-form__input">
                                    <input
                                        className="o-form__input-elem"
                                        id="email"
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
                            </div>
                            <button className="o-form__action btn btn-dark"
                                onClick={loginHandler}
                                disabled={true}
                            >
                                Войти
                            </button>
                            <p className="o-form__police --th-center">
                                Забыли пароль?
                                <button onClick={(e) => {
                                    e.preventDefault();
                                    setPasswordReset(true);
                                    document.querySelector('.o-form-page').classList.toggle('hidden');
                                    // console.log(document.getElementsByClassName('.o-form-page').classList)
                                }} >
                                    Сбросить</button>
                            </p>

                        </form>
                        <p className="o-form-wrapper__text">
                            Нет аккаунта? <Link to="/registration">Зарегистрироваться</Link>
                        </p>
                    </div>
                </div>
            </main>

            {passwordReset && <ResetForm />}

            <Footer />
        </>

    )
};