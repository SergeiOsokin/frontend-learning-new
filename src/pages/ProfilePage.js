import React, { useContext, useState, useCallback, useEffect, useLayoutEffect } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { useHttp } from '../hooks/http.hook';
import { Loader } from '../components/Loader';
import { useMessage } from '../hooks/message.hook';
import { validation } from '../hooks/validation.hook';
import { Aside } from '../components/Aside';
import { autoResize } from '../hooks/autoResize.hook';
import { FooterInner } from '../components/Footer';
import { AuthContext } from '../context/AuthContext';

export const ProfilePage = () => {
    const { logout } = useContext(AuthContext); // получаем контекст в объекте auth
    const message = useMessage();
    const { loading, request } = useHttp();
    const [token, setToken] = useState();
    const { validationInputs } = validation();
    const [form, setForm] = useState({
        passwordOld: '',
        passwordNew: '',
        passwordConfirm: ''
    });
    const [type, setType] = useState({
        type: localStorage.getItem('typeUser')
    });

    const genToken = async function fetchData() {
        try {
            const data = await request(`/lk/gen/token`, 'POST');
            if (data.hasOwnProperty('error')) {
                message(data.message || data.error, false);
                return;
            };
            setToken(data);
        } catch (err) {
            message(err, false);
        }
    };

    const newPassword = (async (e) => {
        e.preventDefault();
        if (form.passwordNew === form.passwordConfirm) {
            try {
                const data = await request('/lk/password', 'POST', form);
                if (data.hasOwnProperty('error')) {
                    return message(data.message || data.error, false);
                }
                message(data.message, true);
                setTimeout(() => {
                    logout()
                }, 2000)
            } catch (error) {
                message(error, false);
            }
        } else {
            message('Новый пароль и подтверждение пароля не совпадают', false);
        }
    });

    const updateType = (async (e) => {
        e.preventDefault();
        try {
            const data = await request('/lk/user/type', 'PATCH', type);
            if (data.hasOwnProperty('error')) {
                return message(data.message || data.error, false);
            }
            message(data.message, true);
            localStorage.setItem('typeUser', data.newType);
        } catch (error) {
            message(error, false);
        };
    });

    const changeHandlerPass = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
        validationInputs(e);
    };

    const changeHandlerType = (e) => {
        setType({ ...type, [e.target.name]: e.target.value });
    };

    const openList = (e) => {
        if (e.target.tagName === ('LI')) {
            const target = e.target.closest('.task-step');
            // открыть / закрыть
            e.target.closest('.task-step').children[1].classList.toggle('--th-disabled')
            // черная рамка вокруг
            target.classList.toggle('--th-edited');
            // автоматическая высота
            // target.querySelector('.app-area-text').style.height = target.querySelector('.app-area-text').scrollHeight + 'px';
        } else {
            return;
        };
    }

    const showPass = (e) => {
        document.querySelectorAll('.password').forEach((e, i) => {
            e.type === 'text' ?
                e.type = 'password' :
                e.type = 'text'
        })
    };

    useLayoutEffect(() => {
        genToken();
    }, []);

    return (
        <>
            <>
                <div className="app-inner">
                    <Aside />

                    <main className="app-main">
                        <header className="app-main__top">
                            <div className="app-main__left">
                                <h1 className="app-main__title">Профиль</h1>
                            </div>
                            <div className="app-main__right">
                                <div className="app-main__search search" />
                            </div>
                        </header>

                        {/* {loading && <Loader />} */}

                        {/* {!loading && */}
                        <main className="app-main__mid">
                            <section className="task-more">
                                <ul className="task-more__list">
                                    <li className="task-step" id='rules' onClick={openList}>
                                        <div className="task-step__header">
                                            <h4 className="task-step__title">Обновить пароль</h4>
                                        </div>
                                        <div className="task-step__body body_rules --th-disabled">
                                            <div className="task-step__text">
                                                <form className="o-form o-form-new-password" autoComplete='off'>
                                                    <div className="o-form__inner">
                                                        <div className="o-form__input">
                                                            <input
                                                                className="o-form__input-elem password"
                                                                id="password"
                                                                type="password"
                                                                placeholder="Старый пароль"
                                                                autoComplete="off"
                                                                name="passwordOld"
                                                                required minLength="6"
                                                                onChange={changeHandlerPass}
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
                                                                placeholder="Новый пароль"
                                                                autoComplete="off"
                                                                name="passwordNew"
                                                                required minLength="6"
                                                                onChange={changeHandlerPass}
                                                                value={form.passwordNew}
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
                                                                autoComplete="off"
                                                                name="passwordConfirm"
                                                                required minLength="6"
                                                                onChange={changeHandlerPass}
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
                                                    </div>
                                                    <button onClick={newPassword} className="o-form__action btn btn-dark">
                                                        Обновить
                                                    </button>
                                                </form>
                                            </div>

                                        </div>
                                    </li>
                                    <li className="task-step" id='words' onClick={openList}>
                                        <div className="task-step__header">
                                            <h4 className="task-step__title">Телеграмм бот</h4>
                                        </div>
                                        <div className="task-step__body body_words --th-disabled">
                                            <p className="task-step__text">
                                                Бот для повторения в <a className=" app-area-text words" title="Telegram" href="https://telegram.me/learnewru_bot" target="_blank" rel="noreferrer" >телеграмм</a>
                                            </p>
                                            <p className="task-step__text">
                                                Ваш токен доступа: <br />
                                                {!!token &&
                                                    <>
                                                        <i className="token" >{token.token}</i>
                                                        <button className="o-form__action btn btn-dark" onClick={() => {
                                                            navigator.clipboard.writeText(document.querySelector('.token').innerText)
                                                                .then(() => {
                                                                    message('Скопировано', true);
                                                                })
                                                                .catch(error => {
                                                                    console.error(`Текст не скопирован ${error}`);
                                                                    message(`Текст не скопирован ${error}`, false);
                                                                })
                                                        }} >Copy</button>
                                                    </>}
                                            </p>

                                            {
                                                !token &&
                                                <button className="card-add --th-tasks" onClick={genToken}>
                                                    <span className="card-add__text">Сгенерировать токен</span>
                                                </button>
                                            }


                                        </div>
                                    </li>
                                    <li className="task-step" id='rules' onClick={openList}>
                                        <div className="task-step__header">
                                            <h4 className="task-step__title">Сменить роль</h4>
                                        </div>
                                        <div className="task-step__body body_rules --th-disabled">
                                            <div className="task-step__text">
                                                <form className="o-form o-form-new-password" autoComplete='off'>
                                                    <select onChange={changeHandlerType} name="type" defaultValue={`${type.type}`} className="create-word-select">
                                                        <option value="1">Я - Студент</option>
                                                        <option value="2">Я - Преподаватель</option>
                                                        <option value="0">Я - Оба</option>
                                                    </select>
                                                    <button onClick={updateType} className="o-form__action btn btn-dark">
                                                        Обновить
                                                    </button>
                                                </form>
                                            </div>

                                        </div>
                                    </li>
                                </ul>

                            </section>
                        </main>
                        {/* } */}
                        <FooterInner />
                    </main>
                </div>
            </>
        </>
    )
}