import React, { useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { useHttp } from '../hooks/http.hook';
import { useMessage } from '../hooks/message.hook';
import { Loader } from './Loader';
import { validation } from '../hooks/validation.hook';

export const RegistrationForm = () => {
    const message = useMessage();
    const { validationInputs } = validation();
    const { loading, request } = useHttp();
    const history = useHistory();
    const [form, setForm] = useState({
        email: '',
        password: '',
        passwordConfirm: ''
    });

    const changeHandler = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
        validationInputs(e);
    };

    const registrHandler = async (e) => {
        e.preventDefault();
        try {
            const data = await request('/signup', 'POST', form);
            if (data === undefined) {
                return
            }
            message(data.message);
        } catch (e) {
            message(e);
        }
    };

    const moveHandler = (event) => {
        history.push('/authorization');
    }

    return (
        <section className={"authorization commonClass"}>
            <div className="authorization__content">
                <h3 className={"authorization__title "}>Регистрация</h3>
                <form className="form" name="entrance" onSubmit={registrHandler}>
                    <fieldset>
                        <div>
                            {/* <label htmlFor="email" className="form__label">Email</label> */}
                            <input
                                id="email"
                                type="email"
                                placeholder="Email"
                                name="email"
                                onChange={changeHandler}
                                className="input"
                                required maxLength="30" minLength="2"
                                pattern="[a-zA-Z0-1\W\D]{1,}@[[a-zA-Z0-1\W\D]{1,}\.[a-zA-Z]{2,3}"
                                value={form.email}
                                autoComplete="off"
                                disabled={loading}
                            />
                            <div className="form__error"></div>
                        </div>
                        <div>
                            {/* <label htmlFor="password" className="form__label">Пароль</label> */}
                            <input
                                id="password"
                                type="password"
                                placeholder="Пароль"
                                name="password"
                                className="input"
                                required minLength="6"
                                onChange={changeHandler}
                                value={form.password}
                                disabled={loading}
                            />
                            <div className="from__error"></div>
                        </div>
                        <div>
                            {/* <label htmlFor="password" className="form__label">Повторите пароль</label> */}
                            <input
                                id="password"
                                type="password"
                                placeholder="Повторите пароль"
                                name="passwordConfirm"
                                className="input"
                                required minLength="6"
                                onChange={changeHandler}
                                value={form.passwordConfirm}
                                disabled={loading}
                            />
                            <div className="from__error"></div>
                        </div>
                    </fieldset>

                    {!loading &&
                        <div className="form__buttons-container">
                            <button
                                className={"button button_rigistration "}
                                onClick={registrHandler}
                                disabled={true}
                            >Зарегистрироваться</button>
                        </div>
                    }
                </form>
                <div>
                    <p>Регистрируясь вы соглашаетесь с <Link className="" to="/authorization">условиями использования</Link> и <Link className="" to="/authorization">политикой конфиденциальности</Link></p>
                </div>
            </div>
            {loading && < Loader />}
            <div className='authorization__account-q'>
                <p className='authorization__account-q'>Есть аккаунт?</p><Link className="introduction__registration-link" to="/authorization">Войти</Link>
            </div>
        </section>
    )
};