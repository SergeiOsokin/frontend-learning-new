import React, { useContext, useState } from 'react';
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
    const [form, setForm] = useState({
        email: '',
        password: ''
    });
    const [classAnimation, setAnimation] = useState('');
    const [registration, setRegistration] = useState(false);

    const changeHandler = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
        validationInputs(e);
    };

    const registrHandler = async (e) => {
        e.preventDefault();
        console.log('какого хера')
        // try {
        //     const data = await request('/signup', 'POST', form);
        //     message(data.message);
        //     clearError();
        // } catch (e) {
        //     message(e);
        // }
    };
    const loginHandler = async (e) => {
        e.preventDefault();
        try {
            const req = await request('/signin', 'POST', form);
            message(req.message);
            auth.login(req.user); // передаем полученные данные в auth.hook
        } catch (e) {
            message(e);
        }
    };
    const moveHandler = (event) => {
        setRegistration(!registration);
        setAnimation('animation');
        setTimeout(() => { setAnimation('') }, 1000)
    }

    return (
        <section className={"authorization " + classAnimation}>
            <div className="authorization__content">
                {!registration && <h3 className={"authorization__title "}>Вход</h3>}
                {registration && <h3 className={"authorization__title "}>Регистрация</h3>}
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
                            {/* {registration &&
                                <button
                                    className={"button button_rigistration "}
                                    onClick={registrHandler}
                                    disabled={true}
                                >Зарегистрироваться</button>
                            } */}
                            {!registration &&
                                <button
                                    className={"button button_enter button-disable"}
                                    onClick={loginHandler}
                                    disabled={true}
                                >Войти</button>
                            }
                        </div>
                    }
                </form>
                <button
                    className="button button-move"
                    onClick={moveHandler}
                >
                    {!registration && "Новый пользователь"}
                    {registration && "Выполнить вход"}
                </button>
            </div>
            {loading && < Loader />}
        </section>
    )
};