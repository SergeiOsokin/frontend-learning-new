import React, { useContext, useState, useEffect } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { useHttp } from '../hooks/http.hook';
import { useMessage } from '../hooks/message.hook';
import { AuthContext } from '../context/AuthContext';
import { Loader } from './Loader';
import { validation } from '../hooks/validation.hook';
import { Header } from './Header';
import { Footer } from './Footer';

export const ResetForm = ({ props, setActive }) => {
    const message = useMessage();
    const { validationInputs } = validation();
    const { loading, request } = useHttp();
    const history = useHistory();
    const [form, setForm] = useState({
        email: ''
    });
    const [passwordReset, setPasswordReset] = useState(false)

    const changeHandler = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
        validationInputs(e);
    };

    const loginHandler = async (e) => {
        e.preventDefault();
        try {
            const data = await request('/reset', 'POST', form);
            if (data.hasOwnProperty('error')) {
                message(data.message || data.error, false);
                return;
            }
            message(data.message, true);
            document.querySelector('.o-form-wrapper__text').classList.remove('hidden');
            document.querySelector('.o-form__action').setAttribute('disabled', true);
        } catch (error) {
            message(error, false);
        }
    };
    const moveHandler = (event) => {
        history.push('/registration');
    }

    useEffect(() => {
        // document.getElementById("root").classList.add("o-wrapper");
        document.getElementById("root").classList.replace("app-wrapper", "o-wrapper");
    }, []);

    return (
        <>
            <section className="o-form-reset app-modal">
                <div className="container">
                    <div className="o-form-wrapper ">
                        <span className="form__close" onClick={() => { history.push('/authorization') }}></span>
                        <form className="o-form" onSubmit={loginHandler}>
                            <h1 className="o-form__title">Сброс пароля</h1>
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
                            </div>
                            <button className="o-form__action btn btn-dark"
                                onClick={loginHandler}
                                disabled={true}
                            >
                                Получить пароль
                            </button>
                            <p className="o-form-wrapper__text hidden">
                                Войти с новым паролем: <Link to="/authorization">Вход</Link>
                            </p>
                        </form>
                        <p className="o-form-wrapper__text">
                            Вернуться: <Link to="/authorization">Войти</Link>
                        </p>
                    </div>
                </div>
            </section>
        </>

    )
};