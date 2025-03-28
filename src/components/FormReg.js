import React, { useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { useHttp } from '../hooks/http.hook';
import { useMessage } from '../hooks/message.hook';
import { Loader } from './Loader';
import { validation } from '../hooks/validation.hook';

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
        <section className={"registration form-section"}>
            <div className="registration form-content">
                <h3 className={"registration authorization__title form-title"}>Регистрация</h3>
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
                        <div className="form-buttons-container">
                            <button
                                className={"button button_registration "}
                                onClick={registrHandler}
                                disabled={true}
                            >Зарегистрироваться</button>
                        </div>
                    }
                    {loading && < Loader />}
                </form>
                <div className='form-text-block'>
                    <p className='form-text'>Регистрируясь вы соглашаетесь с <Link className="form-link" to="/authorization">условиями использования</Link> и <Link className="form-link" to="/authorization">политикой конфиденциальности</Link></p>
                </div>
            </div>
            <div className='form-q'>
                <p className='form-text form-text_registration'>Есть аккаунт? <Link className="form-link form-link_registration" to="/authorization">Войти</Link></p>
            </div>
        </section>
    )
};