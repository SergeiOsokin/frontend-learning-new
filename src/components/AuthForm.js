import React, { useContext, useState } from 'react';
import { useHistory, Redirect } from 'react-router-dom';
import { useHttp } from '../hooks/http.hook';
import { useMessage } from '../hooks/message.hook';
import { AuthContext } from '../context/AuthContext';
import { Loader } from './Loader';
import { validation } from '../hooks/validation.hook';

export const AuthForm = () => {
    const auth = useContext(AuthContext); // получаем контекст в объекте auth
    const message = useMessage();
    const { validationInputs } = validation();
    const { loading, request } = useHttp();
    const history = useHistory();
    const [form, setForm] = useState({
        email: '',
        password: ''
    });

    const changeHandler = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
        validationInputs(e);
    };

    const loginHandler = async (e) => {
        e.preventDefault();
        try {
            const req = await request('/signin', 'POST', form);
            if(req === undefined) {
                return
            }
            history.push('/wordslist');
            auth.login(req); // передаем полученные данные в auth.hook
        } catch (e) {
            message(e);
        }
    };
    const moveHandler = (event) => {
        history.push('/registration');
    }

    return (
        <section className={"authorization commonClass "}>
            <div className="authorization__content">
                <h3 className={"authorization__title "}>Вход</h3>
                <form className="form" name="entrance" onSubmit={loginHandler}>
                    <fieldset>
                        <div>
                            <label htmlFor="email" className="form__label">Email</label>
                            <input
                                id="email"
                                type="email"
                                placeholder="Введите email"
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
                            <label htmlFor="password" className="form__label">Пароль</label>
                            <input
                                id="password"
                                type="password"
                                placeholder="Введите пароль"
                                name="password"
                                className="input"
                                required minLength="6"
                                onChange={changeHandler}
                                value={form.password}
                                disabled={loading}
                            />
                            <div className="from__error"></div>
                        </div>
                    </fieldset>

                    {!loading &&
                        <div className="form__buttons-container">
                            <button
                                className={"button button_enter button-disable"}
                                onClick={loginHandler}
                                disabled={true}
                            >Войти</button>
                        </div>
                    }
                </form>
                <button
                    className="button button-move"
                    onClick={moveHandler}
                >Зарегистрироваться
                </button>
            </div>
            {loading && < Loader />}
        </section>
    )
};