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
            const req = await request('/signin', 'POST', form);
            if (req === undefined) {
                return
            }
            history.push('/wordslist');
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
            <section className="o-form-reset app-modal">
                <div className="container">
                    <div className="o-form-wrapper ">
                        <form className="o-form" onSubmit={loginHandler}>
                            <h1 className="o-form__title">Восстановить пароль</h1>
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
                        </form>
                    </div>
                </div>
            </section>
        </>

    )
};